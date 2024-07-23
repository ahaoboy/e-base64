import { test, expect } from "vitest";
import { encode, decode } from "../src";

test("base", () => {
  const cases: [number[], string][] = [
    [[], ""],
    [[1], "AQ=="],
    [[1, 2], "AQI="],
    [[1, 2, 3], "AQID"],
  ];

  for (const [a, b] of cases) {
    expect(encode(new Uint8Array(a))).toEqual(b);
    expect(decode(b)).toEqual(new Uint8Array(a));
  }
});


test("toString", () => {
  expect(encode.toString().trim()).toEqual(`
function encode(bytes, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/") {
  const len = bytes.length;
  let base64 = "";
  let fillZeros = 0;
  switch (len % 3) {
    case 1: {
      fillZeros = 2;
      break;
    }
    case 2: {
      fillZeros = 1;
      break;
    }
  }
  const byteSize = fillZeros ? len - (3 - fillZeros) : len;
  for (let i = 0; i < byteSize; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    base64 += chars[bytes[i + 2] & 63];
  }
  if (fillZeros === 1) {
    base64 += chars[bytes[byteSize] >> 2];
    base64 += chars[(bytes[byteSize] & 3) << 4 | bytes[byteSize + 1] >> 4];
    base64 += chars[(bytes[byteSize + 1] & 15) << 2 | bytes[byteSize + 2] >> 6];
    base64 += "=";
  } else if (fillZeros === 2) {
    base64 += chars[bytes[byteSize] >> 2];
    base64 += chars[(bytes[byteSize] & 3) << 4 | bytes[byteSize + 1] >> 4];
    base64 += "==";
  }
  return base64;
}`.trim())
});
