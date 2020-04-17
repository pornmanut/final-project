const assert = require("assert");
const genache = require("ganache-cli");
const Web3 = require("web3");
const crypto = require("crypto");
const web3 = new Web3(genache.provider());
const exceptions = require("../../exceptions.js");
const Survey = require("../build/Survey.json");

const gasLimit = "3000000";

describe("[Survey]: Assign Contract", () => {
  let accounts;
  let contract;
  let creator;
  let nonOwner;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    creator = accounts[0];
    nonOwner = accounts[1];
    nonOwnerSet = accounts.slice(1, 6);
    contract = await new web3.eth.Contract(Survey.abi)
      .deploy({
        data: Survey.evm.bytecode.object
      })
      .send({
        from: creator,
        gas: gasLimit
      });
  });
  it("Successfully Deploy a Contract", () => {
    assert.ok(contract.options.address);
  });
  it("Assign Account with 5 users", async () => {
    const { gasUsed } = await contract.methods
      .assginAccounts(nonOwnerSet)
      .send({
        from: creator,
        gas: gasLimit
      });
  });
  it("Total Number Matching", async () => {
    assert.equal(await contract.methods.numOfAccounts().call(), 5);
  });
  it("Get AccountInfo", async () => {
    assert.ok(await contract.methods.getAccountInfo(nonOwner).call());
  });
  it("Can't Get no address of that accounts", async () => {
    await exceptions.catchRevert(
      contract.methods.getAccountInfo(accounts[7]).call()
    );
  });
});
