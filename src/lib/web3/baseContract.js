import web3 from "./web3";
import info from "./info";

const Base = require("./build/Base.json");

const assignSurveyAddress = async (baseAddress, id, surveyAddress) => {
  const sender = await info.getMyAccount();

  console.log(baseAddress, id, surveyAddress);
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

const deploy = async sender => {
  if (sender === undefined) {
    sender = await info.getMyAccount();
  }
  try {
    const contract = await new web3.eth.Contract(Base.abi)
      .deploy({
        data: "0x" + Base.evm.bytecode.object
      })
      .send({
        from: sender
      });
    console.log(contract);
    console.log(contract.options.address);

    return contract.options.address;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const _getSurvey = async (contract, id) => {
  try {
    const request = await contract.methods.getSurveyRequest(id).call();
    const surveyStruct = {
      isOpen: request["isOpen"],
      isAssignAddress: request["isAssignAddress"],
      message: hex_to_ascii(request["message"]),
      requestLength: request["requestLength"],
      approvedLength: request["approvedLength"],
      surveyAddress: request["surveyAddress"]
    };
    return surveyStruct;
  } catch (e) {
    return null;
  }
};
const getSurveyById = async (address, id) => {
  if (!address) {
    return null;
  }
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    const size = await await contract.methods.surveySize().call();
    if (id > size - 1) {
      return null;
    }
    const survey = await _getSurvey(contract, id);
    return survey;
  } catch (e) {
    console.log();
    return null;
  }
};
const getCreator = async address => {
  if (!address) {
    return null;
  }
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    return await contract.methods.creator().call();
  } catch (e) {
    console.log(e);
    return null;
  }
};
const getSurveySize = async address => {
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    return await contract.methods.surveySize().call();
  } catch (e) {
    console.log(e);
    return null;
  }
};

const regisAccountFromRequestPool = async (address, id, accounts) => {
  if (!address) {
    return false;
  }
  const account = await info.getMyAccount();
  let contract;
  try {
    contract = await new web3.eth.Contract(Base.abi, address);
  } catch (e) {
    console.log(e);
    return false;
  }
  try {
    console.log(id, accounts);
    const a = await contract.methods
      .regisAccountFromRequestPool(id, accounts)
      .send({
        from: account
      });
    console.log(a);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
const getAccountList = async (address, id, start, end) => {
  if (!address) {
    return [];
  }
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    const request = await contract.methods
      .getAccountsAddress(id, start, end)
      .call();
    console.log(request);
    const newRequest = [];
    for (let i = 0; i < request.accountList.length; i++) {
      newRequest.push({
        account: request["accountList"][i],
        hasRight: request["rightList"][i]
      });
    }
    return newRequest;
  } catch (e) {
    console.log(e);
    return [];
  }
};
const getSurveyList = async address => {
  if (!address) {
    return [];
  }
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);

    const end = await contract.methods.surveySize().call();

    const surveyList = [];
    for (let i = 0; i < end; i++) {
      const survey = await _getSurvey(contract, i);
      surveyList.push(survey);
    }
    return surveyList;
  } catch (e) {
    console.log(e);
    return [];
  }
};
const createNewSurveyRequest = async (address, message) => {
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
const closeSurvey = async (address, id) => {
  let contract;
  const account = await info.getMyAccount();
  try {
    contract = await new web3.eth.Contract(Base.abi, address);
  } catch (e) {
    console.log(e);
    return false;
  }
  try {
    await contract.methods.closeSurvey(id).send({
      from: account
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
const openSurvey = async (address, id) => {
  let contract;
  const account = await info.getMyAccount();
  try {
    contract = await new web3.eth.Contract(Base.abi, address);
  } catch (e) {
    console.log(e);
    return false;
  }
  try {
    await contract.methods.openSurvey(id).send({
      from: account
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const requestAssignToSurvey = async (address, id) => {
  let contract;
  const account = await info.getMyAccount();
  try {
    contract = await new web3.eth.Contract(Base.abi, address);
  } catch (e) {
    console.log(e);
    return false;
  }
  try {
    await contract.methods.requestAssignToSurvey(id).send({
      from: account
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
const getApprovedAccount = async (address, id) => {
  let contract;
  try {
    contract = await new web3.eth.Contract(Base.abi, address);
    const accounts = await contract.methods.getApprovedAccount(id).call({});
    return accounts;
  } catch (e) {
    console.log(e);
    return null;
  }
};
const setHashAccount = async (address, id) => {
  try {
    const account = await info.getMyAccount();
    const contract = await new web3.eth.Contract(Base.abi, address);
    await contract.methods.setHashRightAccount(id).send({
      from: account
    });
  } catch (e) {
    console.log(e);
  }
};
const getHasAccount = async (address, id) => {
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    const hash = await contract.methods.getHashAccount(id).call();
    console.log(hash);
  } catch (e) {
    console.log(e);
  }
};

//util
function ascii_to_hexa(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
}
function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}
const exportModule = {
  deploy,
  getCreator,
  getSurveyList,
  createNewSurveyRequest,
  getSurveySize,
  getAccountList,
  requestAssignToSurvey,
  regisAccountFromRequestPool,
  closeSurvey,
  getSurveyById,
  openSurvey,
  getApprovedAccount,
  setHashAccount,
  getHasAccount,
  assignSurveyAddress
};

export default exportModule;
