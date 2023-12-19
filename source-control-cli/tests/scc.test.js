const Scc = require("../src/scc");
const fs = require("fs");
const path = require("path");

describe("Scc class", () => {
  let scc;
  beforeEach(() => {
    scc = new Scc();
  });

  describe("INIT", () => {
    beforeEach(() => {
      scc.init();
    });
    afterEach(() => {
      fs.rmdirSync(`${scc.path}/.scc`, { recursive: true });
      fs.unlinkSync(`${scc.path}/.sccignore`);
    });

    it("should create hidden folder .scc if they do not exist", () => {
      expect(fs.existsSync(`${scc.path + "/.scc/"}`)).toBe(true);
    });
    it("should create HEAD file if they do not exist", () => {
      expect(fs.existsSync(`${scc.path + "/.scc/HEAD"}`)).toBe(true);
    });
    it("should create .sccignore file if they do not exist", () => {
      expect(fs.existsSync(`${scc.path + "/.sccignore"}`)).toBe(true);
    });

    it("should create .staging folder if they do not exist", () => {
      expect(fs.existsSync(`${scc.path + "/.scc/.staging"}`)).toBe(true);
    });

    it("should create .commit folder if they do not exist", () => {
      expect(fs.existsSync(`${scc.path + "/.scc/.commit"}`)).toBe(true);
    });
  });

  describe("ADD", () => {
    beforeEach(() => {
      scc.init();
    });

    afterEach(() => {
      fs.rmdirSync(`${scc.path}/.scc`, { recursive: true });
      fs.unlinkSync(`${scc.path}/.sccignore`);
    });

    it("should add file checksum in .staging file", () => {
      scc.add("sample1.js", {});
      const stagingContent = fs.readFileSync(
        `${scc.path}/.scc/.staging`,
        "utf-8"
      );
      expect(stagingContent).toContain("sample1.js");
    });

    it("should add all file checksum in .staging file", () => {
      scc.add(".", {});
      const stagingContent = fs.readFileSync(
        `${scc.path}/.scc/.staging`,
        "utf-8"
      );

      expect(stagingContent).toContain("sample1.js");
      expect(stagingContent).toContain("sample2.js");
      expect(stagingContent).toContain(path.join("src", "index.js"));
    });
  });
  describe("_GET ALL FILES", () => {
    beforeEach(() => {
      scc.init();
    });

    afterEach(() => {
      fs.rmdirSync(`${scc.path}/.scc`, { recursive: true });
      fs.unlinkSync(`${scc.path}/.sccignore`);
    });

    it("should return all files in directory", () => {
      const files = scc._getAllFiles();
      expect(files).toContain("sample1.js");
      expect(files).toContain("sample2.js");
      expect(files).toContain(path.join("src", "index.js"));
    });

    it("should not include files in .scc folder", () => {
      const files = scc._getAllFiles();
      expect(files).not.toContain(".sccignore");
      expect(files).not.toContain(".scc");
    });

    it("should not include files in sccignore", () => {
      fs.writeFileSync(`${scc.path}/.sccignore`, "/ignoredTest");
      const files = scc._getAllFiles();
      expect(files).not.toContain("ignoredTest");
    });
  });
});
