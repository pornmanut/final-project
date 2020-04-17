import web3 from "../web3";
const Survey = require("../build/Survey.json");

const getCreator = async address => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    return await contract.methods.creator().call();
  } catch (err) {
    return null;
  }
};
export default getCreator;
