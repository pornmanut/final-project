import web3 from "../web3";
import info from "../info";
const Base = require("../build/Base.json");
const requestAssign = async (address, id) => {
  try {
    const account = await info.getMyAccount();
    const contract = await new web3.eth.Contract(Base.abi, address);
    await contract.methods.requestAssignToSurvey(id).send({
      from: account
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default requestAssign;
