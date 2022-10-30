import { describe, it, expect } from "vitest";
import {
  bbool,
  bint,
  blist,
  BSchema,
  bstr,
  buint,
  createBufferReader,
  createBufferWriter
} from "../src";

describe("non-automatic read and write", () => {
  it.each([[0], [1], [123324], [324]])(
    "should work correctly for unsigned int with value: $value ",
    value => {
      const w = createBufferWriter();
      w.writeUint(value);

      const r = createBufferReader(w.getBuffer());
      const v = r.readUint();

      expect(v).toEqual(value);
    }
  );

  it.each([[0], [-3424], [1], [123324], [324]])(
    "should work correctly for int with value: $value ",
    value => {
      const w = createBufferWriter();
      w.writeInt(value);

      const r = createBufferReader(w.getBuffer());
      const v = r.readInt();

      expect(v).toEqual(value);
    }
  );

  it.each([["abcd"], [""], ["Lorem ipsum dolor sit amet"]])(
    "should work correctly for string with value: $value ",
    value => {
      const w = createBufferWriter();
      w.writeString(value);

      const r = createBufferReader(w.getBuffer());
      const v = r.readString();

      expect(v).toEqual(value);
    }
  );
});

describe("automatic read and write", () => {
  it.each([
    [null],
    [0],
    [5],
    [3647],
    [4823823],
    [67],
    [-2343],
    [-4534544],
    [true],
    [false],
    ["Lorem ipsum dolor sit amet"],
    [[1, 2, 3]],
    [["sffs", true, 3848, -43]],
    [3434359434384834348245343n],
    [
      -34734724347346472347342372797647239723821738127412372132763123632173213827132642472316312n
    ],
    [1n],
    [
      {
        id: 1042,
        name: "John",
        age: -50,
        isMarried: true
      }
    ],
    [
      {
        id: 1042,
        students: [
          {
            id: 5
          },
          {
            id: 34
          }
        ],
        mentor: null
      }
    ]
  ])("should work correctly for: $value ", value => {
    const w = createBufferWriter();
    w.write(value);

    const r = createBufferReader(w.getBuffer());
    const v = r.read();

    expect(v).toEqual(value);
  });
});

describe("with schema", () => {
  it.each([
    [5, buint()],
    [3647, buint()],
    [4823823, buint()],
    [67, bint()],
    [2343, bint()],
    [4534544, bint()],
    [true, bbool()],
    ["Lorem ipsum dolor sit amet", bstr()]
  ])("should work correctly for value $value and type $type", (value, type) => {
    const w = createBufferWriter();
    w.writeWithSchema(value, type);

    const r = createBufferReader(w.getBuffer());
    const v = r.readWithSchema(type);

    expect(v).toEqual(value);
  });

  it("should work correctly for array type", () => {
    const arr = [10, 25, 32, 1, 0, 255, 16, 33, 77, 90];
    const type = blist(buint());

    const w = createBufferWriter();
    w.writeWithSchema(arr, type);

    const r = createBufferReader(w.getBuffer());
    const v = r.readWithSchema(type);

    expect(v).toEqual(arr);
  });

  it("should work correctly for object type", () => {
    const type = {
      id: buint(),
      name: bstr(),
      age: buint(),
      isMarried: bbool(),
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

    const w = createBufferWriter();
    w.writeWithSchema(obj, type);

    const r = createBufferReader(w.getBuffer());
    const v = r.readWithSchema(type);

    expect(v).toEqual(obj);
  });

  it("should work correctly for combined type", () => {
    const type = {
      id: buint(),
      name: bstr(),
      age: buint(),
      isMarried: bbool(),
      get mentor() {
        return this;
      },
      get students(): BSchema {
        return blist(this);
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

    const w = createBufferWriter();
    w.writeWithSchema(obj, type);

    const r = createBufferReader(w.getBuffer());
    const v = r.readWithSchema(type);

    expect(v).toEqual(obj);
  });
});
