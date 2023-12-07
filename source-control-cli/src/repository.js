const os = require("os");

class Repository {
  constructor() {
    this.path = process.cwd();
    this.name = this.path.split("\\").pop();
    this.author = os.userInfo().username;
  }

  init() {
    console.log("Init repository at current directory: ", process.cwd());
    console.log("Repository name: ", this.name);
    console.log("Author: ", this.author);
  }
}

module.exports = Repository;
