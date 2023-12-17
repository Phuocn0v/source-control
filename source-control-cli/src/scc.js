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
    const regex = new RegExp(`^.*${this.path}/${file}.*$`, "gm");

    if (file && file !== ".") {
      const filepath = path.parse(file);
      const buffer = fs.readFileSync(`${path.join(this.path, filepath)}`);
      const hash = crypto.createHash("sha1");

      hash.update(buffer);
      const hashString = `${this.path}/${file} ${hash.digest("hex")}\n`;

      let stagingContent = fs.existsSync(stagingPath)
        ? fs.readFileSync(stagingPath, "utf-8")
        : "";

      if (regex.test(stagingContent)) {
        stagingContent = stagingContent.replace(
          `${this.path}/${file}`,
          hashString.trim()
        );
      } else stagingContent += hashString;

      fs.writeFileSync(stagingPath, stagingContent);
    }

    if (file === "." || !file || options.all) {
      const files = fs.readdirSync(this.path);
      files.forEach((file) => {
        const filePath = path.join(this.path, file);
        if (fs.statSync(filePath).isFile()) {
          const buffer = fs.readFileSync(filePath);
          const hash = crypto.createHash("sha1");

          hash.update(buffer);
          const hashString = `${filePath} ${hash.digest("hex")}\n`;

          let stagingContent = fs.existsSync(stagingPath)
            ? fs.readFileSync(stagingPath, "utf-8")
            : "";

          if (regex.test(stagingContent)) {
            stagingContent = stagingContent.replace(
              `${this.path}/${file}`,
              hashString.trim()
            );
          } else stagingContent += hashString;

          fs.writeFileSync(stagingPath, stagingContent);
        }
      });
    }
  }
}

module.exports = Scc;
