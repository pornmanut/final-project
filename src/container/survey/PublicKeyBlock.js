import React, { Component } from "react";
import { Segment, Header, TextArea, Form, Button } from "semantic-ui-react";
import ButtonGenerateKey from "./ButtonGenerateKey";
import info from "../../lib/web3/info";
import forge from "../../lib/forge";
import surveyContract from "../../lib/web3/surveyContract";
import contractState from "../../lib/web3/util/contractState";
const setLocalStorage = (id, value) => {
  localStorage.setItem(id, JSON.stringify(value));
};
const getLocalStorage = id => {
  return JSON.parse(localStorage.getItem(id));
};

class PublicKeyBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myAccount: null,
      networkType: null,
      publicKeyPem: "",
      privateKeyPem: "",
      accountState: null,
      accountIsExist: false
    };
  }
  loadPublicKeyInfo = async (surveyAddress, myAccount, networkType) => {
    let privateKeyPem,
      publicKeyPem,
      accountState,
      accountGroupId,
      accountPublicKeySize,
      isFindKey = false;

    const needToAssignPublicKey = await surveyContract.needToAssignPublicKey(
      surveyAddress,
      myAccount
    );
    if (needToAssignPublicKey) {
      const accountInfo = await surveyContract.getAccountInfo(
        surveyAddress,
        myAccount
      );
      console.log(accountInfo);
      accountState = accountInfo.state;
      accountGroupId = accountInfo.groupId;
      accountPublicKeySize = accountInfo.publicKeySize;

      const localPublicKeyPem = await getLocalStorage(
        [networkType, myAccount, surveyAddress, "PublicKeyPem"].join("-")
      );
      const localPrivateKeyPem = await getLocalStorage(
        [networkType, myAccount, surveyAddress, "PrivateKeyPem"].join("-")
      );

      if (localPrivateKeyPem) {
        privateKeyPem = localPrivateKeyPem;
      }
      if (localPublicKeyPem) {
        publicKeyPem = localPublicKeyPem;
        isFindKey = true;
      }

      this.setState({
        myAccount,
        networkType,
        publicKeyPem,
        privateKeyPem,
        accountState,
        accountGroupId,
        accountPublicKeySize,
        needToAssignPublicKey,
        isFindKey,
        keySize: (accountPublicKeySize - 34) * 8
      });
    }
  };
  async componentDidMount() {
    const { surveyAddress, myAccount, networkType } = this.props;
    this.loadPublicKeyInfo(surveyAddress, myAccount, networkType);
  }
  async componentDidUpdate(prevState) {
    const { surveyAddress, myAccount, networkType } = this.props;
    if (prevState.surveyAddress !== surveyAddress) {
      this.loadPublicKeyInfo(surveyAddress, myAccount, networkType);
    }
  }
  handleClick = pair => {
    const publicKeyPem = pair.publicKeyPem;
    const privateKeyPem = pair.privateKeyPem;
    const { surveyAddress } = this.props;
    const { myAccount, networkType } = this.state;

    setLocalStorage(
      [networkType, myAccount, surveyAddress, "PublicKeyPem"].join("-"),
      pair.publicKeyPem
    );
    setLocalStorage(
      [networkType, myAccount, surveyAddress, "PrivateKeyPem"].join("-"),
      pair.privateKeyPem
    );
    this.setState({ publicKeyPem, privateKeyPem });
  };
  sendPublicKey = async () => {
    const { surveyAddress } = this.props;
    const { publicKeyPem } = this.state;
    const der = await forge.publicKeyPemToHex(publicKeyPem);
    const check = surveyContract.sendPublicKey(surveyAddress, der);
    console.log(check);
  };

  render() {
    const {
      needToAssignPublicKey,
      publicKeyPem,
      privateKeyPem,
      keySize,
      accountState,
      accountGroupId,
      accountPublicKeySize,
      myAccount,
      isFindKey
    } = this.state;
    if (!needToAssignPublicKey) return null;
    return (
      <Segment>
        <ShowSurveyAccountInfo
          accountState={accountState}
          accountGroupId={accountGroupId}
          accountPublicKeySize={accountPublicKeySize}
          myAccount={myAccount}
        />
        <div style={{ height: 150 }}>
          <Form>
            <Header as="h3">PublicKey</Header>
            <TextArea style={{ minHeight: 100 }} value={publicKeyPem} />
          </Form>
        </div>
        <div style={{ height: 150 }}>
          <Form>
            <Header as="h3">PrivateKey</Header>
            <TextArea style={{ minHeight: 100 }} value={privateKeyPem} />
          </Form>
        </div>
        {accountState === contractState.assignPublicKey ? (
          <ButtonGenerateKey
            onClick={this.handleClick}
            keySize={keySize}
            isKeyExist={isFindKey}
          />
        ) : null}
        {accountState === contractState.assignPublicKey ? (
          <Button primary onClick={this.sendPublicKey}>
            Send PublicKey
          </Button>
        ) : null}
      </Segment>
    );
  }
}
function publicKeySizeToKeySize(size) {
  const padder = 34;
  return (size - padder) * 8;
}
class ShowSurveyAccountInfo extends Component {
  render() {
    const {
      accountState,
      accountGroupId,
      accountPublicKeySize,
      myAccount
    } = this.props;
    return (
      <Segment>
        <Header as="h3">
          Account: {myAccount} AccountState: {accountState}
        </Header>
        <Header as="h4">
          Group: {accountGroupId} KeySize:{" "}
          {publicKeySizeToKeySize(accountPublicKeySize)}
        </Header>
      </Segment>
    );
  }
}

export default PublicKeyBlock;
