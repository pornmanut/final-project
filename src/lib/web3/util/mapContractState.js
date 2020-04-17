const mapContractState = state => {
  const stateList = ["init", "assignPublicKey", "sendData", "verfiy", "close"];
  return stateList[state];
};

export default mapContractState;
