import forge from "node-forge";

const publicKeyPemToHex = publicKeyPem => {
  return new Promise(resolve => {
    const der = forge.pki.pemToDer(publicKeyPem).toHex();
    console.log(der.length);
    resolve(der);
  });
};
export default publicKeyPemToHex;
