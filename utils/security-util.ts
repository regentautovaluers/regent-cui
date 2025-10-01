import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

export default class SecurityUtil {
	public static generateBase64Token = (username: string, password: string): string => {
		return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
	};

	public static generateApiKey(username: string, password: string): string {
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

	public static encodeBase64(str: string): string {
		return btoa(encodeURIComponent(str));
	}

	public static base64Decode(base64: string): string {
		return decodeURIComponent(atob(base64));
	}
}
