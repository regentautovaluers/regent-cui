import CryptoJS from "crypto-js";
import { RuntimeConfig } from "nuxt/schema";

export function generateCollateralVerificationCIDHeader(corpId: string) {
  const { COLV_CID } = useRuntimeConfig();
  const key = COLV_CID;
  const clientId = corpId;

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

export function generateCookieConfig(config: RuntimeConfig) {
  const AUTHS_COOKIE_CONFIG = {
    maxAge: 60 * 60 * 24 * 3,
    path: "/",
    httpOnly: false, // config.public.RUN_ENV === "dev" ? false : true,
    secure: config.public.RUN_ENV === "dev" ? false : true,
    sameSite:
      config.public.RUN_ENV === "dev"
        ? "lax"
        : ("none" as boolean | "lax" | "none" | "strict" | undefined),
    domain: config.public.RUN_ENV === "dev" ? undefined : config.RUN_URL,
  };

  return AUTHS_COOKIE_CONFIG;
}

export async function inflatePrincipal(
  cookies: Record<string, string>,
): Promise<LoginResponse> {
  const data: LoginResponse = JSON.parse(
    await decompress(base64ToArrayBuffer(cookies.app_principal!), "deflate"),
  );

  return data;
}
