export function compress(string: string, encoding: "deflate") {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

export async function decompress(byteArray: ArrayBuffer, encoding: "deflate") {
  const cs = new DecompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
    return new TextDecoder().decode(arrayBuffer);
  });
}
