import web3 from "../web3";
import info from "../info";
const Base = require("../build/Base.json");

const assignSurveyAddress = async (baseAddress, id, surveyAddress) => {
  const sender = await info.getMyAccount();
  try {
    const contract = await new web3.eth.Contract(Base.abi, baseAddress);
    await contract.methods.assginSurveyAddress(id, surveyAddress).send({
      from: sender
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default assignSurveyAddress;
