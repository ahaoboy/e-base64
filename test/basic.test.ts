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
