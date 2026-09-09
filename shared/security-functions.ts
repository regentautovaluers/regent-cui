import CryptoJS from 'crypto-js';

export function generateBase64Token(username: string, password: string): string {
	return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

export function generateApiKey(username: string, password: string): string {
	const SECRET_KEY = 'a7F9#kL3$pQ8!zR2@xY5%vU6&wT1*bN4';
	const text = `${username}:${password}`;
	const iv = CryptoJS.lib.WordArray.random(16);

	// Use the RAW key (not hashed) to match Express middleware
	const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);

	const encrypted = CryptoJS.AES.encrypt(text, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});

	const ivHex = CryptoJS.enc.Hex.stringify(iv);
	const encryptedHex = CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
	return `${ivHex}:${encryptedHex}`;
}

export function generateApiKeySingle(username: string): string {
	const key = '7x!A%D*G-KaPdSgVkYp3s6v9y$B?E(H+';
	const clientId = 'CLIENT001';

	return CryptoJS.AES.encrypt(clientId, key).toString();
}

export function encodeBase64(str: string): string {
	return btoa(encodeURIComponent(str));
}

export function base64Decode(base64: string): string {
	return decodeURIComponent(atob(base64));
}

export function compress(string: string, encoding: 'deflate') {
	const byteArray = new TextEncoder().encode(string);
	const cs = new CompressionStream(encoding);
	const writer = cs.writable.getWriter();
	writer.write(byteArray);
	writer.close();
	return new Response(cs.readable).arrayBuffer();
}

export async function decompress(byteArray: ArrayBuffer, encoding: 'deflate') {
	const cs = new DecompressionStream(encoding);
	const writer = cs.writable.getWriter();
	writer.write(byteArray);
	writer.close();
	return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
		return new TextDecoder().decode(arrayBuffer);
	});
}
