const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");

class Scc {
  constructor(name, author) {
    this.path = process.cwd() + process.env.DIRECTORY;
    this.name = this.path.split("\\").pop();
    this.author = os.userInfo().username;
  }

  init() {
    console.log("Init repository at current directory: ", this.path);
    console.log("Repository name: ", this.name);
    console.log("Author: ", this.author);

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
    console.log("Checksum of the current repository");
    const files = fs.readdir(this.path, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        console.log(file);
        const filePath = path.join(this.path, file);
        const buffer = fs.readFileSync(filePath);
        console.log(buffer);
        hash.update(buffer);
      });
    });
    return hash.digest("hex");
  }

  add() {
    console.log("Add files to the index");
  }
}

module.exports = Scc;
