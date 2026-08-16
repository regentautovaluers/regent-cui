export default defineEventHandler((event) => {
  const cookies: Record<string, string> = parseCookies(event);
  const eventPath = event.path;

  // add header for valuation
  if(eventPath.includes("/vehicle-valuation")) {
    event.headers.append("Authorization", `Bearer: ${cookies.v_auth_token}`)
  }

  console.log("New request: " + event.path);
});
