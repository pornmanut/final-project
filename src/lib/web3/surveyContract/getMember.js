import web3 from "../web3";
import mapAccountState from "../util/mapAccountState";

const Survey = require("../build/Survey.json");

const START_CURSOR = 0;
const CURSOR_LENGTH = 100;
const getMember = async address => {
  let result = [];
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const size = await contract.methods.groupSize().call();
    for (let id = 0; id < size; id++) {
      const request = await contract.methods
        .getGroupAccount(id, START_CURSOR, CURSOR_LENGTH)
        .call();
      for (let i = 0; i < request.accounts.length; i++) {
        const struct = {
          account: request.accounts[i],
          state: mapAccountState(request.stateList[i]),
          groupId: id
        };
        result.push(struct);
      }
    }
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getMember;
