import forge from "node-forge";
const privateKeyDecryption = (privateKeyPem, cipper) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const message = forge.util.hexToBytes(cipper);
  const decrypted = privateKey.decrypt(message, "RSAES-PKCS1-V1_5");
  return forge.util.bytesToHex(decrypted);
};

export default privateKeyDecryption;
