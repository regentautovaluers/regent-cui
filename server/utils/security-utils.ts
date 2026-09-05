import CryptoJS from "crypto-js";

export function generateCollateralVerificationCIDHeader() {
  const { COLV_CID } = useRuntimeConfig();
  const key = COLV_CID;
  const clientId = "CLIENT001";

  return CryptoJS.AES.encrypt(clientId, key).toString();
}

export function generateCollateralVerificationXApiKey(
  username: string,
  password: string,
): string {
  const { COLV_API_KEY_SECRET } = useRuntimeConfig();

  const SECRET_KEY = COLV_API_KEY_SECRET;
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
