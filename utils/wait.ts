const MAX_WAIT_TIME = 2147483647;

/**
 * Wait a number of milliseconds, if the number of milliseconds to wait for is not provided it will block the program there
 *
 * @param ms - number of milliseconds to wait for
 */
const wait = (time?: number) =>
  new Promise((resolve) => {
    const defaultTime = Math.random() * (6000 - 3000) + 3000;
    setTimeout(resolve, time ?? defaultTime);
  });

export default wait;
