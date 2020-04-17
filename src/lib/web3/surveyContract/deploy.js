import web3 from "../web3";
import info from "../info";
const Survey = require("../build/Survey.json");

const deploy = async () => {
  const sender = await info.getMyAccount();
  try {
    const contract = await new web3.eth.Contract(Survey.abi)
      .deploy({
        data: "0x" + Survey.evm.bytecode.object
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
