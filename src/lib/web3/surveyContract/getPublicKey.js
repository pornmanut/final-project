import web3 from "../web3";
import info from "../info";
const Survey = require("../build/Survey.json");

//makeshift

const getPublicKeyForEncryption = async (surveyAddress, account) => {
  try {
    const contract = await new web3.eth.Contract(Survey.abi, surveyAddress);
    const contractPublicKey = await contract.methods.creatorPublicKey().call();
    return {
      name: `Contract: ${surveyAddress}`,
      publicKey: contractPublicKey.slice(2),
      length: contractPublicKey.slice(2).length / 2
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default getPublicKeyForEncryption;
