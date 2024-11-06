import { Buffer } from 'buffer';

export default class SecurityUtil {
	public static generateBase64Token = (username: string, password: string): string => {
		return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
	}
}
