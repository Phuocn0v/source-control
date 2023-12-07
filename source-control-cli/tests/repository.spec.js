const Repository = require("../src/repository");
const os = require("os");
const process = require("process");

describe("Repository", () => {
  let repository;

  beforeEach(() => {
    repository = new Repository();
  });

  it("should have the correct path", () => {
    expect(repository.path).toEqual(process.cwd());
  });

  it("should have the correct name", () => {
    const expectedName = process.cwd().split("\\").pop();
    expect(repository.name).toEqual(expectedName);
  });

  it("should have the correct author", () => {
    expect(repository.author).toEqual(os.userInfo().username);
  });

  it("should print the correct messages when init is called", () => {
    console.log = jest.fn();

    repository.init();

    expect(console.log).toHaveBeenCalledWith(
      "Init repository at current directory: ",
      process.cwd()
    );
    expect(console.log).toHaveBeenCalledWith(
      "Repository name: ",
      repository.name
    );
    expect(console.log).toHaveBeenCalledWith("Author: ", repository.author);
  });
});
