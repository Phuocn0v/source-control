const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");

class Scc {
  constructor() {
    this.directory = path.join(process.cwd(), process.env.DIRECTORY);
    this.name = this.directory.split("\\").pop();
    this.author = os.userInfo().username;
    this.path = {
      scc: path.join(this.directory, ".scc"),
      ignore: path.join(this.directory, ".sccignore"),
      scc: path.join(this.directory, ".scc"),
      staging: path.join(this.directory, ".scc", ".staging"),
      commit: path.join(this.directory, ".scc", ".commit"),
      blob: path.join(this.directory, ".scc", ".blob"),
    };
  }

  init() {
    // Create .sccignore file if it doesn't exist
    if (!fs.existsSync(`${this.directory}/.sccignore`)) {
      fs.writeFileSync(`${this.directory}/.sccignore`, "");
    }

    // Create .scc directory if it doesn't exist
    if (!fs.existsSync(`${this.directory}/.scc`)) {
      fs.mkdirSync(`${this.directory}/.scc`);
    }

    if (!fs.existsSync(`${this.directory}/.scc/.staging`)) {
      fs.writeFileSync(`${this.directory}/.scc/.staging`, "");
    }

    if (!fs.existsSync(`${this.directory}/.scc/.commit`)) {
      fs.mkdirSync(`${this.directory}/.scc/.commit`);
    }

    if (!fs.existsSync(`${this.directory}/.scc/.blob`)) {
      fs.mkdirSync(`${this.directory}/.scc/.blob`);
    }

    // Create or overwrite HEAD file
    fs.writeFileSync(`${this.directory}/.scc/HEAD`, this.generateChecksum());
  }
  generateChecksum() {
    const hash = crypto.createHash("sha1");
    const files = fs.readdirSync(this.directory);
    files.forEach((file) => {
      const filePath = path.join(this.directory, file);
      if (fs.statSync(filePath).isFile()) {
        const buffer = fs.readFileSync(filePath);
        hash.update(buffer);
      }
    });
    return hash.digest("hex");
  }

  status() {
    const files = this._getAllFiles();
    const stagingPath = path.join(this.directory, ".scc", ".staging");

    // get checksum of every files
    const checksums = files.map((file) => {
      const filePath = path.join(this.directory, file);
      if (fs.lstatSync(filePath).isFile()) {
        const buffer = fs.readFileSync(filePath);
        const hash = crypto.createHash("sha1");
        hash.update(buffer);
        return hash.digest("hex");
      }
    });

    // get checksum of staging file
    const messages = [];
    const stagingChecksums = fs.existsSync(stagingPath)
      ? fs.readFileSync(stagingPath, "utf-8").split("\n")
      : [];

    files.forEach((file, index) => {
      const stagingChecksum = stagingChecksums.find((stagingChecksum) =>
        stagingChecksum.includes(file)
      );
      const checksum = checksums[index];

      // if file is not in staging file
      if (!stagingChecksum) {
        messages.push(`A  ${file}`);
      } else {
        // if file is in staging file and checksum is different
        if (stagingChecksum.split(" ")[1] !== checksum) {
          messages.push(`M  ${file}`);
        }
      }
    });

    // if file is in staging file but not in files
    stagingChecksums.forEach((stagingChecksum) => {
      const file = stagingChecksum.split(" ")[0];
      if (!files.includes(path.relative(this.directory, file))) {
        messages.push(`D  ${file}`);
      }
    });
    return messages.join("\n");
  }

  add(file, options) {
    if (file && file !== ".") {
      const filepath = path.join(this.directory, file);
      if (fs.existsSync(filepath)) {
        this._staging(filepath);
      } else {
        console.log(`fatal: pathspec '${file}' did not match any files`);
      }
    }

    if (options.all || file === ".") {
      const files = this._getAllFiles();
      files.forEach((file) => {
        const filepath = path.join(this.directory, file);
        this._staging(filepath);
      });
    }
  }

  _staging(filepath) {
    try {
      const stagingPath = path.join(this.directory, ".scc", ".staging");
      const buffer = fs.readFileSync(filepath);
      const hash = crypto.createHash("sha1");

      hash.update(buffer);
      const hashDigest = hash.digest("hex");
      const hashString = `${filepath} ${hashDigest}`;

      let stagingContent = fs.existsSync(stagingPath)
        ? fs.readFileSync(stagingPath, "utf-8")
        : "";
      let stagingContentArray = stagingContent.split("\n");

      let found = false;
      stagingContentArray = stagingContentArray.map((content) => {
        if (content.includes(filepath)) {
          found = true;
          return hashString;
        } else return content;
      });

      // if file is not in staging file (ADD)
      if (!found) stagingContentArray.push(hashString);
      stagingContentArray = stagingContentArray.filter(
        (content) => content !== ""
      );

      // remove line in staging file if file is deleted
      const files = this._getAllFiles();
      stagingContentArray = stagingContentArray.filter((content) => {
        const file = content.split(" ")[0];
        return files.includes(path.relative(this.directory, file));
      });

      // save blob
      const fileContent = fs.readFileSync(filepath, "utf-8");
      const newFilePath = path.join(
        this.directory,
        ".scc",
        ".blob",
        hashDigest
      );
      fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
      fs.writeFileSync(newFilePath, fileContent);

      stagingContent = stagingContentArray.join("\n");
      fs.writeFileSync(stagingPath, stagingContent);
    } catch (err) {
      throw err;
    }
  }

  _getAllFiles() {
    let files = fs.readdirSync(this.directory, { recursive: true });
    // remove all folders
    files = files
      .map((file) => {
        const filePath = path.join(this.directory, file);
        if (fs.lstatSync(filePath).isFile()) return file;
      })
      .filter((file) => file);

    // get all ignore files from .sccignore
    const ignoreFilePath = path.join(this.directory, ".sccignore");
    let ignoreFiles = fs.existsSync(ignoreFilePath)
      ? fs.readFileSync(ignoreFilePath, "utf-8").split("\n")
      : [];
    ignoreFiles = ignoreFiles.filter((file) => file !== "");

    files = files.filter((file) => {
      return !file.includes(".scc");
    });

    // filter files based on ignore
    files = files.filter((file) => {
      let found = false;
      ignoreFiles.forEach((ignoreFile) => {
        if (file.includes(ignoreFile)) found = true;
      });
      return !found;
    });

    return files;
  }

  commit(message) {
    const stagingContent = fs.readFileSync(this.path.staging, "utf-8");
    const buffer = fs.readFileSync(this.path.staging);
    const hash = crypto.createHash("sha1");
    hash.update(buffer);
    const hashDigest = hash.digest("hex");

    const commitPath = path.join(this.path.commit, hashDigest);
    fs.mkdirSync(commitPath, { recursive: true });
    fs.writeFileSync(path.join(commitPath, "message"), message);
    fs.writeFileSync(path.join(commitPath, "author"), this.author);
    fs.writeFileSync(path.join(commitPath, "date"), new Date().toISOString());
    fs.writeFileSync(path.join(commitPath, "checksum"), hashDigest);
    fs.writeFileSync(path.join(commitPath, "records"), stagingContent);

    // update HEAD and staging
    fs.writeFileSync(this.path.staging, "");
    fs.writeFileSync(this.path.scc, hashDigest);
  }
}

module.exports = Scc;
