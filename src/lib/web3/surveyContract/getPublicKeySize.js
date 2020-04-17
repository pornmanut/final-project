import web3 from "../web3";
const Survey = require("../build/Survey.json");

const getPublicKeySize = async (surveyAddress, sender) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    return await contract.methods.getPublicKeySize(sender).call();
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getPublicKeySize;
