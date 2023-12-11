const fs = require("fs");
const path = require("path");
const Scc = require("../src/scc");

describe("Scc class", () => {
  const dir = ".scc";
  const file = "HEAD";

  let scc;

  beforeEach(() => {
    // Cleanup before each test
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true });
    }

    // Initialize Scc instance before each test
    scc = new Scc();
  });

  it("should create a hidden folder named .scc", () => {
    scc.init();
    expect(fs.existsSync(dir)).toBeTruthy();
  });

  it("should create a text file named HEAD with no extension in the .scc folder", () => {
    scc.init();
    expect(fs.existsSync(path.join(dir, file))).toBeTruthy();
  });
});
