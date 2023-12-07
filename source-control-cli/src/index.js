const { Command } = require("commander");
const Repository = require("./repository.js");

const program = new Command();
const repository = new Repository();

program
  .name("source-control-cli")
  .description("CLI to control source code")
  .version("0.0.0");

program
  .command("init")
  .description("initialize a new repository")
  .action(() => {
    repository.init();
  });

module.exports = program;
