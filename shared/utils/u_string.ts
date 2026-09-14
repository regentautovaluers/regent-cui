export async function compress(string: string, encoding: "deflate") {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

// Helper to convert ArrayBuffer to Base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export async function decompress(
  buffer: ArrayBuffer,
  encoding: "deflate",
): Promise<string> {
  const cs = new DecompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(new Uint8Array(buffer));
  writer.close();

  const response = new Response(cs.readable);
  const decompressedBuffer = await response.arrayBuffer();

  return new TextDecoder().decode(decompressedBuffer);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function censorString(
  input: string | null,
  direction: "START" | "CENTER" | "END",
): string {
  if (!input) return "";

  const length = input.length;
  const censorLength = Math.max(1, Math.floor(length / 3));

  switch (direction) {
    case "START":
      return "*".repeat(censorLength) + input.slice(censorLength);

    case "CENTER":
      const start = Math.floor((length - censorLength) / 2);
      return (
        input.slice(0, start) +
        "*".repeat(censorLength) +
        input.slice(start + censorLength)
      );

    case "END":
      return input.slice(0, length - censorLength) + "*".repeat(censorLength);

    default:
      return input;
  }
}

export function generateRandomString(
  inputString: string,
  length: number = 10,
): string {
  let result = "";
  const characters = inputString;
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function getInitials(str: string): string {
  const words = str.trim().split(/\s+/);

  if (words.length >= 2) {
    // Return first char of first two words
    return (words[0]![0]! + words[1]![0]!).toUpperCase();
  } else if (words.length === 1 && words[0]!.length >= 2) {
    // Return first two chars of the single word
    return words[0]!.slice(0, 2).toUpperCase();
  } else {
    // Fallback for empty strings or single character words
    return str.trim().slice(0, 2).toUpperCase();
  }
}
