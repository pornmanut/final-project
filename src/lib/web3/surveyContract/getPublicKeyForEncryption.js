import web3 from "../web3";
import info from "../info";
const Survey = require("../build/Survey.json");

//makeshift

const getPublicKeyForEncryption = async (surveyAddress, account) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    const { groupId } = await contract.methods.getAccountInfo(account).call();
    const groupSize = await contract.methods.groupSize().call();
    const result = [];

    for (let i = groupSize - 1; i >= parseInt(groupId) + 1; i--) {
      const publicKey = await contract.methods.getPublicKey(i).call();
      result.push({
        name: `Group ${i}`,
        publicKey: publicKey.slice(2),
        length: publicKey.slice(2).length / 2
      });
    }
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getPublicKeyForEncryption;
