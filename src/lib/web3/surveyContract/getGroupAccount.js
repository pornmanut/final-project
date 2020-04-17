import web3 from "../web3";
const Survey = require("../build/Survey.json");

const getGroupAccount = async (address, id) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const result = await contract.methods.getGroupAccount(id, 0, 10).call();
    return result.accounts;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getGroupAccount;
