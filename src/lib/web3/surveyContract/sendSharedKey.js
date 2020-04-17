import web3 from "../web3";
import info from "../info";
import forge from "../../forge";
import getPublicKey from "./getPublicKey";
import publicKeyPemFromHex from "../../forge/publicKeyFromHex";
const Survey = require("../build/Survey.json");

const sendSharedKey = async (surveyAddress, account, keyAES, iv) => {
  const sender = await info.getMyAccount();
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    const publicKey = await getPublicKey(surveyAddress, account);
    const publicKeyPem = publicKeyPemFromHex(publicKey.slice(2));
    const encrpyt = forge.publicKeyPemEncryption(publicKeyPem, keyAES + iv);
    console.log(encrpyt);
    const a = await contract.methods
      .assginSharedKey(account, "0x" + encrpyt)
      .send({
        from: sender
      });
    console.log(a);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export default sendSharedKey;
