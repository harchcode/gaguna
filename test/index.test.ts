import { getRandomArbitrary } from "../src";

describe("blah", () => {
  it("works", () => {
    expect(getRandomArbitrary(1, 5)).toBeGreaterThan(0);
  });
});
