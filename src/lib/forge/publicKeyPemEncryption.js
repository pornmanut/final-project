import forge from "node-forge";
import publicKeyFromPem from "./publicKeyFromPem";

const publicKeyPemEncryption = (publicKeyPem, message) => {
  const publicKey = publicKeyFromPem(publicKeyPem);
  const buffer = forge.util.createBuffer(message, "utf8");
  const encrypt = publicKey.encrypt(buffer.getBytes(), "RSAES-PKCS1-V1_5");
  return forge.util.bytesToHex(encrypt);
};

export default publicKeyPemEncryption;
