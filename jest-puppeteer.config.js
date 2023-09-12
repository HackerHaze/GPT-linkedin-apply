module.exports = {
  launch: {
    headless: process.env.HEADLESS !== "false", // If you want to see the browser, use `HEADLESS=false npm test`
  },
  browserContext: "default",
  
};
