import { BMReader, BMWriter } from "../src";

describe("read and write", () => {
  it.each`
    value
    ${null}
    ${5}
    ${3647}
    ${4823823}
    ${67}
    ${-2343}
    ${-4534544}
    ${true}
    ${false}
    ${"Lorem ipsum dolor sit amet"}
    ${[1, 2, 3]}
    ${["sffs", true, 3848, -43]}
    ${3434359434384834348245343n}
    ${-34734724347346472347342372797647239723821738127412372132763123632173213827132642472316312n}
    ${1n}
    ${{
  id: 1042,
  name: "John",
  age: -50,
  isMarried: true
}}
    ${{
  id: 1042,
  students: [{
      id: 5
    }, {
      id: 34
    }],
  mentor: null
}}
  `("should work correctly for: $value ", ({ value }) => {
    const w = new BMWriter();
    w.write(value);

    const r = new BMReader(w.getBuffer());
    const v = r.readNext();

    expect(v).toEqual(value);
  });
});
