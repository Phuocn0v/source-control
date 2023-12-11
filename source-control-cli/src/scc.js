const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");

class Scc {
  constructor() {
    this.path = process.cwd() + process.env.DIRECTORY;
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

  add() {
    console.log("Add files to the index");
  }
}

module.exports = Scc;
