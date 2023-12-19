const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");

class Scc {
  constructor() {
    this.path = path.join(process.cwd(), process.env.DIRECTORY);
    this.name = this.path.split("\\").pop();
    this.author = os.userInfo().username;
  }

  init() {
    // Create .sccignore file if it doesn't exist
    if (!fs.existsSync(`${this.path}/.sccignore`)) {
      fs.writeFileSync(`${this.path}/.sccignore`, "");
    }

    // Create .scc directory if it doesn't exist
    if (!fs.existsSync(`${this.path}/.scc`)) {
      fs.mkdirSync(`${this.path}/.scc`);
    }

    if (!fs.existsSync(`${this.path}/.scc/.staging`)) {
      fs.writeFileSync(`${this.path}/.scc/.staging`, "");
    }

    if (!fs.existsSync(`${this.path}/.scc/.commit`)) {
      fs.mkdirSync(`${this.path}/.scc/.commit`);
    }

    // Create or overwrite HEAD file
    fs.writeFileSync(`${this.path}/.scc/HEAD`, this.generateChecksum());
  }
  generateChecksum() {
    const hash = crypto.createHash("sha1");
    const files = fs.readdirSync(this.path);
    files.forEach((file) => {
      const filePath = path.join(this.path, file);
      if (fs.statSync(filePath).isFile()) {
        const buffer = fs.readFileSync(filePath);
        hash.update(buffer);
      }
    });
    return hash.digest("hex");
  }

  status() {
    const files = this._getAllFiles();
    const stagingPath = path.join(this.path, ".scc", ".staging");

    // get checksum of every files
    const checksums = files.map((file) => {
      const filePath = path.join(this.path, file);
      console.log(filePath);

      if (fs.lstatSync(filePath).isFile()) {
        const buffer = fs.readFileSync(filePath);
        const hash = crypto.createHash("sha1");
        hash.update(buffer);
        return hash.digest("hex");
      }
    });

    // get checksum of staging file
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
        console.log(`A  ${file}`);
      } else {
        // if file is in staging file and checksum is different
        if (stagingChecksum.split(" ")[1] !== checksum) {
          console.log(`M  ${file}`);
        }
      }
    });
  }

  add(file, options) {
    if (file && file !== ".") {
      const filepath = path.join(this.path, file);
      if (fs.existsSync(filepath)) {
        this._addFile(filepath);
      } else {
        console.log(`fatal: pathspec '${file}' did not match any files`);
      }
    }

    if (options.all || file === ".") {
      const files = this._getAllFiles();
      files.forEach((file) => {
        const filepath = path.join(this.path, file);
        if (fs.statSync(filepath).isFile()) {
          this._addFile(filepath);
        } else {
          console.log(`fatal: pathspec '${file}' did not match any files`);
        }
      });
    }
  }

  _addFile(filepath) {
    try {
      const stagingPath = `${this.path}/.scc/.staging`;
      const buffer = fs.readFileSync(filepath);
      const hash = crypto.createHash("sha1");

      hash.update(buffer);
      const hashString = `${filepath} ${hash.digest("hex")}`;

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
      if (!found) stagingContentArray.push(hashString);

      stagingContent = stagingContentArray.join("\n");
      fs.writeFileSync(stagingPath, stagingContent);
    } catch (err) {
      throw err;
    }
  }

  _getAllFiles() {
    let files = fs.readdirSync(this.path, { recursive: true });

    // get all ignore files from .sccignore
    const ignoreFilePath = `${path.join(this.path, ".sccignore")}`;
    const ignoreFiles = fs.existsSync(ignoreFilePath)
      ? fs.readFileSync(ignoreFilePath, "utf-8").split("\n")
      : [];

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
}

module.exports = Scc;
