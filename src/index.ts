const chars =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup = new Uint8Array([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62, 0, 0, 0, 63, 52, 53,
	54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7,
	8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 0, 0,
	0, 0, 0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
	43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

export function encode(bytes: Uint8Array): string {
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
		base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += chars[bytes[i + 2] & 63];
	}

	if (fillZeros === 1) {
		base64 += chars[bytes[byteSize] >> 2];
		base64 += chars[((bytes[byteSize] & 3) << 4) | (bytes[byteSize + 1] >> 4)];
		base64 +=
			chars[((bytes[byteSize + 1] & 15) << 2) | (bytes[byteSize + 2] >> 6)];
		base64 += "=";
	} else if (fillZeros === 2) {
		base64 += chars[bytes[byteSize] >> 2];
		base64 += chars[((bytes[byteSize] & 3) << 4) | (bytes[byteSize + 1] >> 4)];
		base64 += "==";
	}

	return base64;
}

export function decode(base64: string): Uint8Array {
	const len = base64.length;
	let bufferLength = (len >> 2) * 3;
	let p = 0;

	let fillZeros = 0;
	if (base64[len - 1] === "=") {
		bufferLength--;
		fillZeros = 1;
		if (base64[len - 2] === "=") {
			bufferLength--;
			fillZeros = 2;
		}
	}

	const bytes = new Uint8Array(bufferLength);

	const strLen = fillZeros ? len - 4 : len;

	for (let i = 0; i < strLen; i += 4) {
		const encoded1 = lookup[base64.charCodeAt(i)];
		const encoded2 = lookup[base64.charCodeAt(i + 1)];
		const encoded3 = lookup[base64.charCodeAt(i + 2)];
		const encoded4 = lookup[base64.charCodeAt(i + 3)];

		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
		bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
		bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	}

	if (fillZeros === 1) {
		const encoded1 = lookup[base64.charCodeAt(strLen)];
		const encoded2 = lookup[base64.charCodeAt(strLen + 1)];
		const encoded3 = lookup[base64.charCodeAt(strLen + 2)];
		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
		bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	} else if (fillZeros === 2) {
		const encoded1 = lookup[base64.charCodeAt(strLen)];
		const encoded2 = lookup[base64.charCodeAt(strLen + 1)];
		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	}
	return bytes;
}
