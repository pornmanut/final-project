const assert = require("assert");
const genache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(genache.provider());
const exceptions = require("../util/exceptions.js");
const Base = require("../build/Base.json");
process.setMaxListeners(0);
const gasLimit = "3000000";

describe("[Base]: Create Base Contract", () => {
  let accounts;
  let contract;
  let creator;
  let nonOwner;

  const convert = (from, to) => str => Buffer.from(str, from).toString(to);
  const utf8ToHex = convert("utf8", "hex");
  const hexToUtf8 = convert("hex", "utf8");

  const message = ["Math and Sicence"];

  it("Assing varaible from web3.eth.getAccounts", async () => {
    accounts = await web3.eth.getAccounts();
    creator = accounts[0];
    nonOwner = accounts[1];
    nonOwnerSet = accounts.slice(1, 6);
  });

  it("Deploy baseContract with creator", async () => {
    const gasEstimate = await web3.eth.estimateGas({
      data: Base.evm.bytecode.object
    });
    console.log("Deploy Cost: " + gasEstimate);

    contract = await new web3.eth.Contract(Base.abi)
      .deploy({
        data: Base.evm.bytecode.object
      })
      .send({
        from: creator,
        gas: gasLimit
      });
  });
  it("CreateSurveyRequest with creator", async () => {
    const messageBytes = utf8ToHex(message[0]);
    await contract.methods.createSurveyRequest("0x" + messageBytes).send({
      from: creator,
      gas: gasLimit
    });
  });
  it("Get SurveyRequest and Message is Match?", async () => {
    const result = await contract.methods.getSurveyRequest(0).call({});
    assert.equal(result["isOpen"], true);
    assert.equal(result["isAssignAddress"], false);
    assert.equal(result["regisAccountLength"], 0);
    assert.equal(result["requestAccountLength"], 0);
    assert.equal(hexToUtf8(result.message.slice(2)), message[0]);
  });

  it("User request Assgin to Survey", async () => {
    const what = await contract.methods.requestAssignToSurvey(0).send({
      from: nonOwner,
      gas: gasLimit
    });
    const result = await contract.methods.getRequestAccounts(0, 0, 5).call({});
    assert.equal(result["requestAccount"].includes(nonOwner), true);
  });
});
