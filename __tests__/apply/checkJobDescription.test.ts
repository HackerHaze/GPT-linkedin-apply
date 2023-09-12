import { checkJobDescription } from "../../fetch/checkJobDescription";

describe("Job Description Check", () => {
  it("should correctly whitelist and blacklist words", () => {
    const incomingJobDescription =
      "This is a job for a senior developer with experience in JavaScript and React";
    const whitelist = ["senior", "developer", "JavaScript", "React"];
    const blacklist = ["junior", "intern", "Python"];

    const result = checkJobDescription(incomingJobDescription, {
      blacklist,
      whitelist,
    });

    expect(result.includesWhitelisted).toBe(true);
    expect(result.includesBlacklisted).toBe(false);
  });

  it("should detect blacklisted words", () => {
    const incomingJobDescription =
      "This is a job for a junior developer with experience in JavaScript";
    const whitelist = ["JavaScript", "React"];
    const blacklist = ["junior", "intern", "Python"];

    const result = checkJobDescription(incomingJobDescription, {
      blacklist,
      whitelist,
    });

    expect(result.includesWhitelisted).toBe(true);
    expect(result.includesBlacklisted).toBe(true);
  });
  it("should detect words disregarding casing", () => {
    const incomingJobDescription =
      "This is a job for a Junior developer with experience in JavaScript";
    const whitelist = ["javascript", "React"];
    const blacklist = ["junior", "intern", "Python"];

    const result = checkJobDescription(incomingJobDescription, {
      blacklist,
      whitelist,
    });

    expect(result.includesWhitelisted).toBe(true);
    expect(result.includesBlacklisted).toBe(true);
  });
  it("should not detect substrings in words", () => {
    const incomingJobDescription =
      "This is a job for a junior developer with experience in JavaScript";
    const whitelist = ["Java", "React"];
    const blacklist = ["junior", "intern", "Python"];

    const result = checkJobDescription(incomingJobDescription, {
      blacklist,
      whitelist,
    });

    expect(result.includesWhitelisted).toBe(false);
    expect(result.includesBlacklisted).toBe(true);
  });

  it("should detect absence of both whitelisted and blacklisted words", () => {
    const incomingJobDescription =
      "This is a job for a system analyst with experience in C#";
    const whitelist = ["senior", "developer", "JavaScript", "React"];
    const blacklist = ["junior", "intern", "Python"];

    const result = checkJobDescription(incomingJobDescription, {
      blacklist,
      whitelist,
    });

    expect(result.includesWhitelisted).toBe(false);
    expect(result.includesBlacklisted).toBe(false);
  });
});
