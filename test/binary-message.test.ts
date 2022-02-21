import { BType, deserialize, serialize } from "../src";

describe("serialize and deserialize", () => {
  it.each`
    value                           | type
    ${5}                            | ${"u8"}
    ${3647}                         | ${"u16"}
    ${4823823}                      | ${"u32"}
    ${67}                           | ${"i8"}
    ${2343}                         | ${"i16"}
    ${4534544}                      | ${"i32"}
    ${true}                         | ${"bool"}
    ${"Lorem ipsum dolor sit amet"} | ${"str"}
  `(
    "should work correctly for value $value and type $type",
    ({ value, type }) => {
      expect(deserialize(serialize(value, type), type)).toBe(value);
    }
  );

  it.each`
    value              | type     | decimal
    ${134.24}          | ${"f32"} | ${2}
    ${5454243.5454523} | ${"f64"} | ${7}
  `(
    "should work correctly for float number when value $value and type $type",
    ({ value, type, decimal }) => {
      expect(
        (deserialize(serialize(value, type), type) as number).toFixed(decimal)
      ).toBe((value as number).toFixed(decimal));
    }
  );

  it("should work correctly for array type", () => {
    const arr = [10, 25, 32, 1, 0, 255, 16, 33, 77, 90];

    expect(deserialize(serialize(arr, [BType.u8]), [BType.u8])).toEqual(arr);
  });

  it("should work correctly for object type", () => {
    const type = {
      id: BType.u8,
      name: BType.str,
      age: BType.u8,
      isMarried: BType.bool,
      get mentor() {
        return this;
      }
    };

    const obj = {
      id: 1,
      name: "John",
      age: 27,
      isMarried: false,
      mentor: {
        id: 2,
        name: "Jane",
        age: 33,
        isMarried: true,
        mentor: {
          id: 3,
          name: "Nike",
          age: 11,
          isMarried: false,
          mentor: null
        }
      }
    };

    expect(deserialize(serialize(obj, type), type)).toEqual(obj);
  });

  it("should work correctly for combined type", () => {
    const type = {
      id: BType.u8,
      name: BType.str,
      age: BType.u8,
      isMarried: BType.bool,
      get mentor() {
        return this;
      },
      get students() {
        return [this];
      }
    };

    const obj = {
      id: 1,
      name: "John",
      age: 27,
      isMarried: false,
      mentor: {
        id: 2,
        name: "Jane",
        age: 33,
        isMarried: true,
        mentor: null,
        students: []
      },
      students: [
        {
          id: 3,
          name: "Money",
          age: 214,
          isMarried: false,
          mentor: null,
          students: []
        },
        {
          id: 4,
          name: "George",
          age: 37,
          isMarried: true,
          mentor: null,
          students: []
        }
      ]
    };

    expect(deserialize(serialize(obj, type), type)).toEqual(obj);
  });
});
