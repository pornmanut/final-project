import web3 from "../web3";
const Survey = require("../build/Survey.json");

const needToAssignPublicKey = async (address, account) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const result = await contract.methods
      .isNeedToAssignPublicKey(account)
      .call();
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default needToAssignPublicKey;
