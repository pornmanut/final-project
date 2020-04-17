import web3 from "../web3";
import info from "../info";
const Survey = require("../build/Survey.json");
const sendVerify = async surveyAddress => {
  const sender = await info.getMyAccount();
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    const a = await contract.methods.sendVerify().send({
      from: sender
    });
    console.log(a);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export default sendVerify;
