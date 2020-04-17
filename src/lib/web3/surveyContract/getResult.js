import web3 from "../web3";
const Survey = require("../build/Survey.json");

const START_CURSOR = 0;
const CURSOR_LENGTH = 100;
const KEY_SIZE = 256;
function publicKeySizeToKeyHex(size) {
  return (size - 34) * 2;
}

const getResult = async surveyAddress => {
  const result = [];
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    const size = await contract.methods.groupSize().call();
    const request = await contract.methods
      .getGroupAccount(parseInt(size) - 1, START_CURSOR, CURSOR_LENGTH)
      .call();
    const data = (
      await contract.methods.getData(request.accounts[0]).call()
    ).slice(2);
    for (let i = 0; i < data.length; i += KEY_SIZE) {
      result.push(data.slice(i, i + KEY_SIZE));
    }
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getResult;
