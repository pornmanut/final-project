import web3 from "../web3";
import mapRole from "../util/mapRole";
const Survey = require("../build/Survey.json");

const mappingSturct = item => {
  return {
    role: mapRole(item.role),
    next: item.next,
    from: item.from,
    sharedKeyCount: item.sharedKeyCount,
    publicKeyCount: item.publicKeyCount,
    sendDataCount: item.sendDataCount,
    verifyCount: item.verifyCount,
    size: item.size
  };
};

const getGroupInfo = async (address, id) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const result = await contract.methods.getGroupInfo(id).call();
    return mappingSturct(result);
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getGroupInfo;
