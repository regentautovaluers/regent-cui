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

export async function decompress(buffer: ArrayBuffer, encoding: "deflate"): Promise<string> {
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
