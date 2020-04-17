import web3 from "../web3";
import mapAccountState from "../util/mapAccountState";

const Survey = require("../build/Survey.json");

const START_CURSOR = 0;
const CURSOR_LENGTH = 100;
const getDataMemberFromGroup = async (address, id) => {
  if (id <= 0) {
    return false;
  }
  const targetId = id - 1;
  let result = "";
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const request = await contract.methods
      .getGroupAccount(targetId, START_CURSOR, CURSOR_LENGTH)
      .call();
    for (let i = 0; i < request.accounts.length; i++) {
      const eachData = await contract.methods
        .getData(request.accounts[i])
        .call();
      result = result.concat(eachData.slice(2));
    }
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getDataMemberFromGroup;
