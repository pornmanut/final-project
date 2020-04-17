import web3 from "../web3";
import mapAccountState from "../util/mapAccountState";
import mapRole from "../util/mapRole";
const Survey = require("../build/Survey.json");

const mappingSturct = item => {
  return {
    groupId: item.groupId,
    state: mapAccountState(item.state),
    publicKeySize: item.publicKeySize,
    role: mapRole(item.role)
  };
};

const getAccountInfo = async (address, account) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const result = await contract.methods.getAccountInfo(account).call();
    console.log(result);
    return mappingSturct(result);
  } catch (err) {
    return null;
  }
};
export default getAccountInfo;
