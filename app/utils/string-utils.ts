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
