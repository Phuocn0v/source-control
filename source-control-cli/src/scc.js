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

  status() {}

  add(file, options) {
    const stagingPath = `${this.path}/.scc/.staging`;
    // const regex = new RegExp(`^.*${this.path}/${file}.*$`, "gm");

    if (file && file !== ".") {
      const filepath = path.join(this.path, file);
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
    }

    if (options.all || file === ".") {
      const files = fs.readdirSync(this.path);
      files.forEach((file) => {
        const filePath = path.join(this.path, file);
        if (fs.statSync(filePath).isFile()) {
          const buffer = fs.readFileSync(filePath);
          const hash = crypto.createHash("sha1");

          hash.update(buffer);
          const hashString = `${filePath} ${hash.digest("hex")}`;

          let stagingContent = fs.existsSync(stagingPath)
            ? fs.readFileSync(stagingPath, "utf-8")
            : "";
          let stagingContentArray = stagingContent.split("\n");
          stagingContentArray = stagingContentArray.filter(
            (content) => content !== ""
          );

          let found = false;
          stagingContentArray = stagingContentArray.map((content) => {
            if (content.includes(filePath)) {
              found = true;
              return hashString;
            } else return content;
          });
          if (!found) stagingContentArray.push(hashString);

          stagingContent = stagingContentArray.join("\n");
          fs.writeFileSync(stagingPath, stagingContent);
        }
      });
    }
  }
}

module.exports = Scc;
