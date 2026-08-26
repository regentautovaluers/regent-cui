import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

export default class SecurityUtil {
	public static generateBase64Token = (username: string, password: string): string => {
		return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
	};

	public static encodeBase64(str: string): string {
		return btoa(encodeURIComponent(str));
	}

	public static base64Decode(base64: string): string {
		return decodeURIComponent(atob(base64));
	}

	public static compress(string: string, encoding: 'deflate') {
		const byteArray = new TextEncoder().encode(string);
		const cs = new CompressionStream(encoding);
		const writer = cs.writable.getWriter();
		writer.write(byteArray);
		writer.close();
		return new Response(cs.readable).arrayBuffer();
	}

	public static async decompress(byteArray: ArrayBuffer, encoding: 'deflate') {
		const cs = new DecompressionStream(encoding);
		const writer = cs.writable.getWriter();
		writer.write(byteArray);
		writer.close();
		return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
			return new TextDecoder().decode(arrayBuffer);
		});
	}
}

/*
async function testCompression(text, encoding = 'deflate') {
	console.log(encoding + ':');
	console.time('compress');
	const compressedData = await compress(text, encoding);
	console.timeEnd('compress');
	console.log('compressed length:', compressedData.byteLength, 'bytes');
	console.time('decompress');
	const decompressedText = await decompress(compressedData, encoding);
	console.timeEnd('decompress');
	console.log('decompressed length:', decompressedText.length, 'characters');
	console.assert(text === decompressedText);
}
*/
