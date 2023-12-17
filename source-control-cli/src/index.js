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

Program.command("status")
  .description("show the working tree status")
  .action(() => {
    scc.status();
  });

Program.command("add [filename]")
  .description("add file contents to the index")
  .option("-a, --all", "add all files to staging area")
  .action((filename, options, command) => {
    const opts = command.opts();
    console.log(filename, opts);
  });

module.exports = Program;
