import web3 from "../web3";
const Base = require("../build/Base.json");
const getApprovedAccount = async (address, id) => {
  let contract;
  try {
    contract = await new web3.eth.Contract(Base.abi, address);
    const accounts = await contract.methods.getApprovedAccount(id).call({});
    return accounts;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export default getApprovedAccount;
