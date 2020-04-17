import forge from "node-forge";
import publicKeyPemFromHex from "./publicKeyFromHex";
const publicKeyPemListEncryption = (
  contractPublicKeyHex,
  publicKeyPemList,
  message
) => {
  const result = [message];

  const publicKeyPem = publicKeyPemFromHex(contractPublicKeyHex.publicKey);
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const buffer = forge.util.createBuffer(message, "utf8");
  const encrypt = publicKey.encrypt(buffer.getBytes(), "RSAES-PKCS1-V1_5");
  let data = encrypt;
  result.push(forge.util.bytesToHex(data));

  for (let i = 0; i < publicKeyPemList.length; i++) {
    const publicKeyPem = publicKeyPemFromHex(publicKeyPemList[i].publicKey);
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const buffer = forge.util.createBuffer(data, "raw");
    data = publicKey.encrypt(buffer.getBytes(), "RSAES-PKCS1-V1_5");
    result.push(forge.util.bytesToHex(data));
  }
  data = forge.util.bytesToHex(data);
  return {
    encrypt: data,
    length: data.length / 2,
    encryptStep: result
  };
};

export default publicKeyPemListEncryption;
