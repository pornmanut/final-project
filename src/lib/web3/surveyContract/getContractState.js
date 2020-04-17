import web3 from "../web3";
import mapContractState from "../util/mapContractState";
const Survey = require("../build/Survey.json");

const getContractState = async address => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, address);
    const result = await contract.methods.currentState().call();
    return mapContractState(result);
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getContractState;
