import web3 from "../web3";
import info from "../info";
const Base = require("../build/Base.json");

const ascii_to_hexa = str => {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
};
const createRoom = async (address, message) => {
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    const account = await info.getMyAccount();

    await contract.methods
      .createSurveyRequest("0x" + ascii_to_hexa(message))
      .send({
        from: account
      });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export default createRoom;
