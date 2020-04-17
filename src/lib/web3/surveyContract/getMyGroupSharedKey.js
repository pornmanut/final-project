import web3 from "../web3";
import info from "../info";
import mapAccountState from "../util/mapAccountState";

const Survey = require("../build/Survey.json");

const getMyGroupSharedKey = async address => {
  const sender = await info.getMyAccount();
  try {
    console.log(sender);
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const senderGroup = await contract.methods.getAccountInfo(sender).call();
    if (senderGroup.groupId == 0) {
      return []; //no need to assign
    }
    const request = await contract.methods
      .getGroupAccount(senderGroup.groupId - 1, 0, 100)
      .call();
    const result = [];

    for (let i = 0; i < request.accounts.length; i++) {
      const struct = {
        account: request.accounts[i],
        state: mapAccountState(request.stateList[i])
      };
      result.push(struct);
    }
    return result;
  } catch (err) {
    return null;
  }
};
export default getMyGroupSharedKey;
