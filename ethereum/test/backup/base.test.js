const assert = require("assert");
const genache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(genache.provider());
const crypto = require("crypto");

const exceptions = require("../../exceptions.js");
const Survey = require("../build/Survey.json");
const Base = require("../build/Base.json");

const gasLimit = "3000000";

describe("[Base] create Survey", () => {
  let accounts;
  let baseContract;
  let baseAddress;
  let surveyContract;
  let surveyAddress;
  let creator;
  let nonOwner;

  it("Successfully Deploy a Basecontract", async () => {
    accounts = await web3.eth.getAccounts();
    creator = accounts[0];
    nonOwner = accounts[1];
    baseContract = await new web3.eth.Contract(Base.abi)
      .deploy({
        data: Base.evm.bytecode.object
      })
      .send({
        from: creator,
        gas: gasLimit
      });
    baseAddress = baseContract.options.address;
    assert.ok(baseAddress);
  });
  it("Successfully Deploy a surveyContract", async () => {
    surveyContract = await new web3.eth.Contract(Survey.abi)
      .deploy({
        data: Survey.evm.bytecode.object
      })
      .send({
        from: creator,
        gas: gasLimit
      });
    surveyAddress = surveyContract.options.address;
    assert.ok(surveyAddress);
  });
  it("Add survey address to Base", async () => {
    await baseContract.methods.addSurvey(surveyAddress).send({
      from: creator
    });
    const survey = await baseContract.methods
      .surveyAddress(surveyAddress)
      .call();
    assert.equal(survey.isExist, true);
  });
  it("Cliam address for base", async () => {
    const show = await surveyContract.methods
      .assignMainContract(baseAddress)
      .send({
        from: creator
      });
    const survey = await baseContract.methods
      .surveyAddress(surveyAddress)
      .call();
    console.log(show);
    assert.equal(survey.isVerify, true);
  });
});
