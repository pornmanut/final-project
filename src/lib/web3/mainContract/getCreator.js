import web3 from "../web3";
const Base = require("../build/Base.json");

const getCreator = async address => {
  try {
    const contract = await new web3.eth.Contract(Base.abi, address);
    return await contract.methods.creator().call();
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default getCreator;
