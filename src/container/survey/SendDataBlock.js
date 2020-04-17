import React, { Component } from "react";
import {
  Segment,
  Header,
  TextArea,
  Form,
  Button,
  Label,
  Grid
} from "semantic-ui-react";

import forge from "../../lib/forge";
import surveyContract from "../../lib/web3/surveyContract";
import _forge from "node-forge";

import ShowEncryptedList from "./ShowEncryptedList";
const setLocalStorage = (id, value) => {
  localStorage.setItem(id, JSON.stringify(value));
};
const getLocalStorage = id => {
  return JSON.parse(localStorage.getItem(id));
};
function publicKeySizeToKeySize(size) {
  const padder = 34;
  return size - padder;
}
function publicKeySizeToKeyHex(size) {
  return (size - 34) * 2;
}
class SendDataBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  loadKeyInfo = async (surveyAddress, myAccount, networkType) => {
    let encryptStep = null;

    const accountInfo = await surveyContract.getAccountInfo(
      surveyAddress,
      myAccount
    );
    const isCanSend = await surveyContract.isMemberAlreadySendData(
      surveyAddress,
      accountInfo.groupId
    );
    const contractPublicKey = await surveyContract.getPublicKey(surveyAddress);
    const encryptedPublicKeyList = await surveyContract.getPublicKeyForEncryption(
      surveyAddress,
      myAccount
    );
    const maxMessageSize =
      publicKeySizeToKeySize(contractPublicKey.length) - 11; //PKCS-1;
    const publicKeyList = [contractPublicKey, ...encryptedPublicKeyList];

    if (accountInfo.state === "alreadySend") {
      encryptStep = await getLocalStorage(
        [networkType, myAccount, surveyAddress, "EncrpytedDataHex"].join("-")
      );
    }

    this.setState({
      myAccount,
      networkType,
      contractPublicKey,
      encryptedPublicKeyList,
      publicKeyList,
      maxMessageSize,
      accountInfo,
      isCanSend,
      encryptStep,
      isLoading: false
    });
  };
  async componentDidMount() {
    const { surveyAddress, myAccount, networkType } = this.props;
    this.loadKeyInfo(surveyAddress, myAccount, networkType);
  }
  handleSendData = async message => {
    const { surveyAddress } = this.props;
    const {
      contractPublicKey,
      encryptedPublicKeyList,
      myAccount,
      networkType,
      accountInfo
    } = this.state;

    const sendEncrpytedHex = await forge.publicKeyPemListEncryption(
      contractPublicKey,
      encryptedPublicKeyList,
      message
    );
    await setLocalStorage(
      [networkType, myAccount, surveyAddress, "EncrpytedDataHex"].join("-"),
      sendEncrpytedHex.encryptStep
    );
    let decryptedList = [];

    if (accountInfo.groupId > 0) {
      //change group id plz
      const groupData = await surveyContract.getDataMemberFromGroup(
        surveyAddress,
        accountInfo.groupId
      );
      const myPrivateKey = getLocalStorage(
        [networkType, myAccount, surveyAddress, "PrivateKeyPem"].join("-")
      );
      decryptedList = forge.privateKeyPemDecryptionBlock(
        myPrivateKey,
        groupData,
        publicKeySizeToKeyHex(accountInfo.publicKeySize)
      );
    }
    decryptedList.push(sendEncrpytedHex.encrypt);
    const shuffleEncryptedHex = blockShuffle(decryptedList);

    const sendDataHex = shuffleEncryptedHex.join("");
    console.log(sendDataHex);
    console.log(sendDataHex.length);
    const a = await surveyContract.sendData(surveyAddress, sendDataHex);
    console.log(a);
  };
  render() {
    const { surveyAddress } = this.props;
    const {
      contractPublicKey,
      publicKeyList,
      maxMessageSize,
      isLoading,
      isCanSend,
      encryptStep,
      accountInfo
    } = this.state;

    if (isLoading) {
      return null;
    }
    if (accountInfo.state === "readyToSend") {
      return (
        <div>
          <ShowContractPublicKey publicKeyList={publicKeyList} />

          {isCanSend ? (
            <TextAreaBlock
              label="Message"
              placeholder="What message do you want to send?"
              maxMessageSize={maxMessageSize}
              onClick={this.handleSendData}
            />
          ) : (
            <ShowWaitAccount />
          )}
        </div>
      );
    } else {
      return (
        <div>
          <ShowEncryptedList list={encryptStep} />
        </div>
      );
    }
  }
}
class ShowWaitAccount extends Component {
  render() {
    return (
      <Segment>
        <h2>Wait another group SendData</h2>
      </Segment>
    );
  }
}
function miniText(message, min) {
  if (message.length > min) {
    return message.slice(0, min) + "...";
  }
  return message;
}
class ShowContractPublicKey extends Component {
  createTaskPublicKey = (item, key) => {
    return (
      <li key={key}>
        <Segment style={{ height: 80 }}>
          <Header as="h5">{item.name}</Header>
          <Label>{miniText("0x" + item.publicKey, 80)}</Label>
          <Label color="black">{item.length} bytes</Label>
        </Segment>
      </li>
    );
  };
  render() {
    const { publicKeyList } = this.props;
    const ListPublicKey = publicKeyList.map(this.createTaskPublicKey);

    return (
      <div>
        <ul style={{ listStyleType: "none", padding: 0 }}>{ListPublicKey}</ul>
      </div>
    );
  }
}

class TextAreaBlock extends Component {
  state = {
    isCanChange: true,
    messageLength: 0,
    value: ""
  };
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.state.value);
    }
    this.setState({ isCanChange: false });
  };
  handleChange = (e, { value }) => {
    if (value.length < this.props.maxMessageSize) {
      this.setState({ value, messageLength: value.length });
    }
  };
  render() {
    const { label, placeholder, maxMessageSize } = this.props;
    const { value, messageLength, isCanChange } = this.state;
    return (
      <Form onSubmit={this.handleClick}>
        <span>{messageLength}/</span>
        <span>{maxMessageSize} Bytes</span>
        <Form.TextArea
          label={label}
          value={value}
          onChange={this.handleChange}
          placeholder={placeholder}
          style={{ minHeight: 100 }}
          disabled={!isCanChange}
        />
        <Form.Button primary disabled={!isCanChange || !value.length}>
          Submit
        </Form.Button>
      </Form>
    );
  }
}

function blockShuffle(blockList) {
  const result = [];
  let size = blockList.length - 1;
  while (size >= 0) {
    const random = Math.floor(Math.random() * size);
    // console.log(random, size, blockList, result);
    result.push(blockList[random]);
    blockList[random] = blockList[size];
    size--;
  }
  return result;
}
export default SendDataBlock;
