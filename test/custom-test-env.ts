const Environment = require("jest-environment-jsdom"); // eslint-disable-line

/**
 * A custom environment to set the TextEncoder and TextDecoder.
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === "undefined") {
      const { TextEncoder, TextDecoder } = require("util"); // eslint-disable-line
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};
