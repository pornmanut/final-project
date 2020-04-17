import forge from "node-forge";

const publicKeyFromPem = publicKeyPem => {
  return forge.pki.publicKeyFromPem(publicKeyPem);
};
export default publicKeyFromPem;
