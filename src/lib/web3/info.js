import web3 from "./web3";
const getMyAccount = async () => {
  const account = await web3.eth.getAccounts();
  return account[0];
};
const getAddressBalance = async (address, valueType) => {
  const balance = await web3.eth.getBalance(address);
  if (valueType === "ether") {
    return await web3.utils.fromWei(balance, "ether");
  }
  return balance;
};
const getNetwork = async () => {
  const network = await web3.eth.net.getNetworkType();
  return network;
};
const isContractExist = async address => {
  //+0x 2 byte
  if (!address) {
    return false;
  }
  if (address.length !== 42) {
    console.log("You address wrong");
    return false;
  }

  try {
    const result = await web3.eth.getCode(address);
    if (result.length > 2) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false; //0x
  }
};

const exportModule = {
  getMyAccount,
  getAddressBalance,
  isContractExist,
  getNetwork
};
export default exportModule;
