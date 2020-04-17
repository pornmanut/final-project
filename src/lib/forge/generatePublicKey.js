import forge from "node-forge";

const generateKeyPem = keySize => {
  return new Promise(resolve => {
    const pair = forge.pki.rsa.generateKeyPair(keySize);
    const privateKeyPem = forge.pki.privateKeyToPem(pair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(pair.publicKey);
    resolve({ publicKeyPem, privateKeyPem });
  });
};
export default generateKeyPem;
