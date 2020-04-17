const mapAccountState = state => {
  const stateList = [
    "init",
    "assignPublicKey",
    "readyToSend",
    "alreadySend",
    "verify",
    "problem"
  ];
  return stateList[state];
};

export default mapAccountState;
