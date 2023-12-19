const Scc = require("../src/scc");
const fs = require("fs");

describe("Scc class", () => {
  let scc;
  beforeEach(() => {
    scc = new Scc();
  });

  describe("INIT", () => {
    afterEach(() => {
      fs.rmdirSync(`${scc.path}/.scc`, { recursive: true });
      fs.unlinkSync(`${scc.path}/.sccignore`);
    });

    it("should create hidden folder .scc if they do not exist", () => {
      scc.init();
      expect(fs.existsSync(`${scc.path + "/.scc/"}`)).toBe(true);
    });
    it("should create HEAD file if they do not exist", () => {
      scc.init();
      expect(fs.existsSync(`${scc.path + "/.scc/HEAD"}`)).toBe(true);
    });
    it("should create .sccignore file if they do not exist", () => {
      scc.init();
      expect(fs.existsSync(`${scc.path + "/.sccignore"}`)).toBe(true);
    });

    it("should create .staging folder if they do not exist", () => {
      scc.init();
      expect(fs.existsSync(`${scc.path + "/.scc/.staging"}`)).toBe(true);
    });

    it("should create .commit folder if they do not exist", () => {
      scc.init();
      expect(fs.existsSync(`${scc.path + "/.scc/.commit"}`)).toBe(true);
    });
  });

  describe("ADD", () => {
    afterEach(() => {
      fs.rmdirSync(`${scc.path}/.scc`, { recursive: true });
      fs.unlinkSync(`${scc.path}/.sccignore`);
    });

    it("should add file checksum in .staging file", () => {
      scc.init();
      scc.add("sample1.js", {});
      const stagingContent = fs.readFileSync(
        `${scc.path}/.scc/.staging`,
        "utf-8"
      );
      expect(stagingContent).toContain("sample1.js");
    });

    it("should add all file checksum in .staging file", () => {
      scc.init();
      scc.add(".", {});
      const stagingContent = fs.readFileSync(
        `${scc.path}/.scc/.staging`,
        "utf-8"
      );
      expect(stagingContent).toContain("sample1.js");
      expect(stagingContent).toContain("sample2.js");
    });

    it("should add all file checksum in .staging file with -a option", () => {
      scc.init();
      scc.add("", { all: true });
      const stagingContent = fs.readFileSync(
        `${scc.path}/.scc/.staging`,
        "utf-8"
      );
      expect(stagingContent).toContain("sample1.js");
      expect(stagingContent).toContain("sample2.js");
    });
  });

  describe("STATUS", () => {});
});
