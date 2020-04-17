import web3 from "../web3";
import info from "../info";
const Base = require("../build/Base.json");

const deploy = async () => {
  try {
    const sender = await info.getMyAccount();
    const contract = await new web3.eth.Contract(Base.abi)
      .deploy({
        data: "0x" + Base.evm.bytecode.object
      })
      .send({
        from: sender
      });
    return contract.options.address;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default deploy;
