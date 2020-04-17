function hexTobase64(str1) {
  let hex = str1.toString();
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  const base64 = btoa(str);
  return base64;
}
//try don't know
const publicKeyPemFromHex = hex => {
  const der = hexTobase64(hex);
  return "-----BEGIN PUBLIC KEY-----" + der + "-----END PUBLIC KEY-----";
};
export default publicKeyPemFromHex;
