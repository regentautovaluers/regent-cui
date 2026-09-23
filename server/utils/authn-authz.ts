export async function inflatePrincipal(
  cookies: Record<string, string>,
): Promise<LoginResponse> {
  const data: LoginResponse = JSON.parse(
    await decompress(base64ToArrayBuffer(cookies.app_principal!), "deflate"),
  );

  return data;
}
