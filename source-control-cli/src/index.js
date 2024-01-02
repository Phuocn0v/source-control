const { Command } = require("commander");
const Scc = require("./scc");

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
    const messages = scc.status();
    console.log(messages);
  });

Program.command("add [filename]")
  .description("add file contents to the index")
  .option("-a, --all", "add all files to staging area")
  .action((filename, options, command) => {
    const opts = command.opts();
    scc.add(filename, opts);
  });

Program.command("commit [message]")
  .description("record changes to the repository")
  .action((message) => {
    scc.commit(message);
  });

module.exports = Program;
