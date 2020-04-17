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

const getRoomList = async address => {
  if (!address) {
    return [];
  }
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    const end = await contract.methods.surveySize().call();
    const surveyList = [];
    for (let id = 0; id < end; id++) {
      const request = await contract.methods.getSurveyRequest(id).call();
      surveyList.push(mapRoom(request));
    }
    return surveyList;
  } catch (e) {
    console.log(e);
    return [];
  }
};
export default getRoomList;
