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
import info from "../../lib/web3/info";
import forge from "../../lib/forge";
import surveyContract from "../../lib/web3/surveyContract";
import contractState from "../../lib/web3/util/contractState";
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
class VerifyBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  loadInfo = async (surveyAddress, myAccount, networkType) => {
    const totalMessage = await surveyContract.getResult(surveyAddress);

    const myMessage = getLocalStorage(
      [networkType, myAccount, surveyAddress, "EncrpytedDataHex"].join("-")
    );
    let isFound = totalMessage.includes(myMessage[1]);
    this.setState({ isLoading: false, totalMessage, myMessage, isFound });
  };
  async componentDidMount() {
    const { surveyAddress, myAccount, networkType } = this.props;
    this.loadInfo(surveyAddress, myAccount, networkType);
  }

  async componentDidUpdate(prevState) {
    const { surveyAddress, myAccount, networkType } = this.props;
    if (prevState.surveyAddress != surveyAddress) {
      this.loadInfo(surveyAddress, myAccount, networkType);
    }
  }
  handleVerify = async () => {
    const { surveyAddress } = this.props;
    const check = await surveyContract.sendVerify(surveyAddress);
    console.log(check);
  };
  render() {
    const { isLoading, totalMessage, myMessage, isFound } = this.state;

    if (isLoading) {
      return (
        <Segment loading>
          <h2>Loading</h2>
        </Segment>
      );
    }
    return (
      <Segment>
        <ShowEncryptedList list={myMessage} />
        <ShowDataList list={totalMessage} target={myMessage[1]} />
        <Header as="h3">
          {isFound ? "Found Your Message" : "Not Found Your Message"}
        </Header>
        <Button positive disabled={!isFound} onClick={this.handleVerify}>
          Send Verfiy
        </Button>
      </Segment>
    );
  }
}
class ShowDataList extends Component {
  createTask = (item, key) => {
    const { target } = this.props;
    return (
      <li key={key}>
        <Segment>
          <Header as="h4">
            {key + 1}: {miniText(item, 80)}
            {target === item ? "<Your Message>" : null}
          </Header>
        </Segment>
      </li>
    );
  };
  render() {
    const { list } = this.props;
    const ListItem = list.map(this.createTask);

    return (
      <div>
        <Header as="h3">Message On Contract</Header>
        <ul style={{ listStyleType: "none", padding: 0 }}>{ListItem}</ul>
      </div>
    );
  }
}
function miniText(message, min) {
  if (message.length > min) {
    return message.slice(0, min) + "...";
  }
  return message;
}
export default VerifyBlock;
