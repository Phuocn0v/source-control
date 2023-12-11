const { Command } = require("commander");
const Scc = require("./scc.js");

const Program = new Command();
const scc = new Scc();

Program.name("source-control-cli")
  .description("CLI to control source code")
  .version("0.0.0");

Program.command("init")
  .description("initialize a new repository")
  .action(() => {
    scc.init();
  });

module.exports = Program;
