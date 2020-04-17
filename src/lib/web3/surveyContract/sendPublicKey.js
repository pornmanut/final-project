import web3 from "../web3";
import info from "../info";
const Survey = require("../build/Survey.json");
const sendPublicKey = async (surveyAddress, publicKeyDER) => {
  const sender = await info.getMyAccount();
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    console.log(publicKeyDER);
    const a = await contract.methods.assignPublicKey("0x" + publicKeyDER).send({
      from: sender
    });
    console.log(a);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export default sendPublicKey;
