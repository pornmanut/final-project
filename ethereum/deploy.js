const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic =
  "point enough laugh next patient dutch elevator copy pretty volcano grocery purchase";
const Web3 = require("web3");
const contract = require("./build/Survey.json");

var provider = new HDWalletProvider(mnemonic, "http://localhost:8545");
const web3 = new Web3(provider);

const deploy = async () => {
  let accounts;
  try {
    accounts = await web3.eth.getAccounts();
  } catch (err) {
    console.log(err);
  }
  console.log("Attempting to deploy from account", accounts[0]);

  let result;
  try {
    result = await new web3.eth.Contract(contract.abi)
      .deploy({ data: "0x" + contract.evm.bytecode.object }) // add 0x bytecode
      .send({ from: accounts[0] }); // remove 'gas'
  } catch (err) {
    console.log(err);
  }
  console.log("Contract deploy to", result.options.address);
};

deploy();
web3.eth.getAccounts().then(console.log);
provider.engine.stop();
