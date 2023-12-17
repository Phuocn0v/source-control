const Scc = require("../src/scc");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

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
    it("should add file checksum in .staging file", () => {});
  });
});
