import React, { Component } from "react";
import {
  Segment,
  Button,
  Form,
  Header,
  Grid,
  TextArea,
  GridColumn
} from "semantic-ui-react";
import baseContract from "../../lib/web3/mainContract";
import surveyContract from "../../lib/web3/surveyContract";
import InputButton from "../../component/InputButton";
import ButtonGenerateKey from "../survey/ButtonGenerateKey";
import forge from "../../lib/forge";
import contractState from "../../lib/web3/util/contractState";

const setLocalStorage = (id, value) => {
  localStorage.setItem(id, JSON.stringify(value));
};
const getLocalStorage = id => {
  return JSON.parse(localStorage.getItem(id));
};
class SurveyDeploy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSurveyClose: false
    };
  }
  async componentDidMount() {
    const { currentContract, id } = this.props;
    const room = await baseContract.getSurveyRequest(currentContract, id);

    if (room && room.isAssignAddress) {
      const state = await surveyContract.getContractState(room.surveyAddress);
      this.setState({ isSurveyClose: state === contractState.close });
    }
    this.setState({ room });
  }

  handleAssignSurvey = async surveyAddress => {
    const { myAccount, currentContract, networkType, id } = this.props;
    await baseContract.assignSurveyAddress(currentContract, id, surveyAddress);
  };

  render() {
    const { myAccount, networkType, id, currentContract } = this.props;
    const { room, isSurveyClose } = this.state;
    if (!room) {
      return null;
    }
    return (
      <div>
        {room.isAssignAddress ? (
          <KeyBox
            surveyAddress={room.surveyAddress}
            myAccount={myAccount}
            currentContract={currentContract}
            networkType={networkType}
            id={id}
          />
        ) : (
          <Segment>
            <InputButton
              buttonName="Assign"
              placeholder="Survey Address"
              onSubmit={this.handleAssignSurvey}
            />
          </Segment>
        )}
        {isSurveyClose ? (
          <ShowData
            myAccount={myAccount}
            currentContract={currentContract}
            networkType={networkType}
            id={id}
          />
        ) : null}
      </div>
    );
  }
}

class KeyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publicKeyPem: "",
      privateKeyPem: "",
      keySize: 1024
    };
  }
  handleAssignAccount = async () => {
    const { currentContract, id } = this.props;
    const { publicKeyPem } = this.state;
    const room = await baseContract.getSurveyRequest(currentContract, id);
    const accounts = await baseContract.getApprovedAccount(currentContract, id);
    console.log(
      room.surveyAddress,
      currentContract,
      id,
      accounts,
      publicKeyPem
    );
    const a = await surveyContract.assign(
      room.surveyAddress,
      currentContract,
      id,
      accounts,
      publicKeyPem
    );
    console.log(a);
  };
  loadKey = async (surveyAddress, myAccount, networkType) => {
    let publicKeyPem = "";
    let privateKeyPem = "";
    let keySize = 1024;

    const localPublicKeyPem = await getLocalStorage(
      [networkType, myAccount, surveyAddress, "PublicKeyPem"].join("-")
    );
    const localPrivateKeyPem = await getLocalStorage(
      [networkType, myAccount, surveyAddress, "PrivateKeyPem"].join("-")
    );

    const localPrivateKeySize = await getLocalStorage(
      [networkType, myAccount, surveyAddress, "KeySize"].join("-")
    );
    console.log(networkType, myAccount, surveyAddress);
    if (localPrivateKeyPem) {
      privateKeyPem = localPrivateKeyPem;
    }
    if (localPublicKeyPem) {
      publicKeyPem = localPublicKeyPem;
    }
    if (localPrivateKeySize) {
      keySize = localPrivateKeySize;
    }
    this.setState({
      publicKeyPem,
      privateKeyPem,
      keySize
    });
  };
  async componentDidMount() {
    const { surveyAddress, myAccount, networkType } = this.props;
    this.loadKey(surveyAddress, myAccount, networkType);
  }
  async componentDidUpdate(prevState) {
    const { surveyAddress, myAccount, networkType } = this.props;

    if (prevState.surveyAddress !== surveyAddress) {
      this.loadKey(surveyAddress, myAccount, networkType);
    }
  }
  handleKeySize = keySize => {
    this.setState({ keySize });
  };
  handleClick = pair => {
    const publicKeyPem = pair.publicKeyPem;
    const privateKeyPem = pair.privateKeyPem;
    const { surveyAddress, myAccount, networkType } = this.props;

    setLocalStorage(
      [networkType, myAccount, surveyAddress, "PublicKeyPem"].join("-"),
      pair.publicKeyPem
    );
    setLocalStorage(
      [networkType, myAccount, surveyAddress, "PrivateKeyPem"].join("-"),
      pair.privateKeyPem
    );
    setLocalStorage(
      [networkType, myAccount, surveyAddress, "KeySize"].join("-"),
      this.state.keySize
    );
    this.setState({ publicKeyPem, privateKeyPem });
  };
  render() {
    const { publicKeyPem, privateKeyPem, keySize } = this.state;

    return (
      <div>
        <Segment>
          <Segment>
            <Header as="h4">
              {" "}
              Key: {keySize} bit Message Size: {keySize / 8 - 11}
            </Header>
          </Segment>
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
          <Grid columns={2}>
            <Grid.Column>
              <InputButton
                buttonName="Submit"
                placeholder="Key Size"
                onSubmit={this.handleKeySize}
              />
            </Grid.Column>
            <Grid.Column>
              <ButtonGenerateKey onClick={this.handleClick} keySize={keySize} />
            </Grid.Column>
          </Grid>
          <p></p>
          <Button primary fluid onClick={this.handleAssignAccount}>
            Assign
          </Button>
        </Segment>
      </div>
    );
  }
}

class ShowData extends Component {
  constructor(props) {
    super(props);
    this.state = { decrpytedList: [] };
  }
  load = async () => {
    const { currentContract, id, myAccount, networkType } = this.props;
    const surveyRequest = await baseContract.getSurveyRequest(
      currentContract,
      id
    );
    const surveyAddress = surveyRequest.surveyAddress;
    const result = await surveyContract.getResult(surveyAddress);
    const privateKey = await getLocalStorage(
      [networkType, myAccount, surveyAddress, "PrivateKeyPem"].join("-")
    );
    const decrpytedList = [];
    for (let i = 0; i < result.length; i++) {
      const decypted = forge.privateKeyPemDecryption(privateKey, result[i]);
      decrpytedList.push(hex_to_ascii(decypted));
    }
    this.setState({
      decrpytedList
    });
  };
  async componentDidUpdate() {
    this.load();
  }
  async componentDidMount() {
    this.load();
  }
  createMessageItem = (item, key) => {
    return (
      <li key={key}>
        <Segment>
          <p>Message: {item}</p>
        </Segment>
      </li>
    );
  };
  render() {
    const { decrpytedList } = this.state;
    const ListMessage = decrpytedList.map(this.createMessageItem);
    return (
      <Segment>
        <Header as="h4">Message</Header>
        <pre style={{ maxHeight: 400, overflowY: "scroll" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>{ListMessage}</ul>
        </pre>
      </Segment>
    );
  }
}
const hex_to_ascii = str1 => {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

export default SurveyDeploy;
