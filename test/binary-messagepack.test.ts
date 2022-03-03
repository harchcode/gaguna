import { BMReader, BMWriter } from "../src";

// function testing() {
//   const w = new BMWriter();

//   w.write("SDFSFWEFRW");

//   const b = w.getBuffer();
//   const tmp = new Uint8Array(b);

//   console.log(b);

//   const abc: string[] = [];

//   tmp.forEach(x => {
//     abc.push(x.toString(2).padStart(8, "0"));
//   });

//   const xyz = abc.join("-");

//   console.log(xyz);

//   const r = new BMReader(b);

//   const c = r.readNext();
//   console.log(c);
// }

// testing();

describe("read and write", () => {
  it.each`
    value
    ${5}
    ${3647}
    ${4823823}
    ${67}
    ${-2343}
    ${-4534544}
    ${true}
    ${false}
    ${"Lorem ipsum dolor sit amet"}
  `("should work correctly for: $value ", ({ value }) => {
    const w = new BMWriter();
    w.write(value);

    const r = new BMReader(w.getBuffer());
    const v = r.readNext();

    expect(v).toEqual(value);
  });
});
