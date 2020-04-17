import web3 from "../web3";
const Survey = require("../build/Survey.json");

const isMemberAlreadySendData = async (address, id) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const result = await contract.methods.isMemberAlreadySendData(id).call();
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default isMemberAlreadySendData;
