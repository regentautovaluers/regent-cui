export function generateBase64Token(
  username: string,
  password: string,
): string {
  return "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
}

export function encodeBase64(str: string): string {
  return btoa(encodeURIComponent(str));
}

export function base64Decode(base64: string): string {
  return decodeURIComponent(atob(base64));
}
