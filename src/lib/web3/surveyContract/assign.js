import web3 from "../web3";
import info from "../info";
import forge from "../../forge";

const Survey = require("../build/Survey.json");
const assign = async (
  surveyAddress,
  baseAddress,
  id,
  accounts,
  publicKeyPem
) => {
  const sender = await info.getMyAccount();
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    const hex = await forge.publicKeyPemToHex(publicKeyPem);
    console.log(hex, hex.length);
    const a = await contract.methods
      .assignContract(baseAddress, id, accounts, hex.length / 2, "0x" + hex)
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
export default assign;
