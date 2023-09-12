export function checkJobDescription(
  incomingJobDescription: string,
  jobDescription: { whitelist: string[]; blacklist: string[] }
) {
  const blacklistRegexStr = jobDescription.blacklist
    .map((word) => "\\b" + word + "\\b")
    .join("|");
  const whitelistRegexStr = jobDescription.whitelist
    .map((word) => "\\b" + word + "\\b")
    .join("|");

  const blacklistRegExp = new RegExp(blacklistRegexStr, "i");
  const whitelistRegExp = new RegExp(whitelistRegexStr, "i");

  // Check if incomingJobDescription includes any blacklisted words:
  let includesBlacklisted = blacklistRegExp.test(incomingJobDescription);

  // Check if incomingJobDescription includes any whitelisted words:
  let includesWhitelisted = whitelistRegExp.test(incomingJobDescription);

  return { includesWhitelisted, includesBlacklisted };
}
