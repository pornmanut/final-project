import web3 from "../web3";
const Base = require("../build/Base.json");
const hex_to_ascii = str1 => {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

const mapRoom = item => {
  return {
    isOpen: item["isOpen"],
    isAssignAddress: item["isAssignAddress"],
    message: hex_to_ascii(item["message"]),
    requestLength: item["requestLength"],
    approvedLength: item["approvedLength"],
    surveyAddress: item["surveyAddress"]
  };
};

const getSurveyRequest = async (address, id) => {
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    const request = await contract.methods.getSurveyRequest(id).call();
    return mapRoom(request);
  } catch (e) {
    console.log(e);
    return null;
  }
};
export default getSurveyRequest;
