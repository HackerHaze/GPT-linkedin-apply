// import { testFunctions, testHtmlFunctions } from './agent/index';

import { testFunctions } from ".";

// import { testFunctions, testHtmlFunctions } from "./agent";

const url = "https://mi9retail.bamboohr.com/careers/253?source=aWQ9NA%3D%3D"; // replace with the URL you want to test

// async function main() {

// //   await testHtmlFunctions(url);
// }

// main().catch(console.error);
(async () => {
  await testFunctions(url);
})();
