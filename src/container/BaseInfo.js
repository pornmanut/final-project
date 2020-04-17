import React, { Component } from "react";
import { Segment, Button, Grid, Label } from "semantic-ui-react";
import InputBaseAddress from "./InputBaseAddress";
import DeployBaseContract from "../component/DeployBaseContract";
import ListBaseAddress from "./ListBaseAddress";
import info from "../lib/web3/info";
import baseContract from "../lib/web3/baseContract";
import CreateSurveyRequest from "./CreateSurveyRequest";
import ListSurveyRequest from "./ListSurveyRequest";
import ListSurveyAccount from "./ListSurveyAccount";
import RequestSurveyInfo from "./RequestSurveyInfo";
import DeploySurveyButton from "./survey/DeploySurveyButton";
import DeploySurveyBlock from "./survey/DeploySurveyBlock";
class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      baseAddressList: [],
      selectId: 0,
      isContract: false,
      selectSurveyId: 0,
      isLoading: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteBaseItem = this.deleteBaseItem.bind(this);
  }

  async componentDidMount() {
    this.setState({ account: this.props.account });
    const baseAddressList = this.getLocalStorage(
      this.props.account,
      "baseList"
    );
    if (baseAddressList && baseAddressList.length > 0) {
      const isContract = await this.isContractCreator(
        baseAddressList[this.state.selectId]
      );
      this.setState({
        baseAddressList,
        isContract,
        isLoading: false
      });
    } else {
      this.setState({
        isContract: false
      });
    }
  }
  handleSubmit = async item => {
    if (item) {
      this.setState(prevState => {
        const baseAddressList = prevState.baseAddressList.concat(item);
        this.setLocalStorage(this.state.account, "baseList", baseAddressList);
        return {
          baseAddressList
        };
      });
    }
  };
  handleDeploy = async item => {
    this.setState(prevState => {
      const baseAddressList = prevState.baseAddressList.concat(item);
      this.setLocalStorage(this.state.account, "baseList", baseAddressList);
      return {
        baseAddressList,
        isContract: true
      };
    });
  };

  deleteBaseItem = async key => {
    this.state.baseAddressList.splice(key, 1);
    const isContract = await this.isContractCreator(
      this.state.baseAddressList[key]
    );
    this.setState({
      isLoading: false,
      isContract
    });
    this.setLocalStorage(
      this.state.account,
      "baseList",
      this.state.baseAddressList
    );
  };
  selectBaseItem = async key => {
    const isContract = await this.isContractCreator(
      this.state.baseAddressList[key]
    );
    this.setState({ selectId: key, isContract, selectSurveyId: 0 });
  };
  selectSurveyRequest = key => {
    this.setState({ selectSurveyId: key });
  };
  getLocalStorage = (account, key) => {
    const itemJSON = localStorage.getItem(`${account}-${key}`);
    return JSON.parse(itemJSON);
  };
  setLocalStorage = (account, key, value) => {
    const itemJSON = JSON.stringify(value);
    localStorage.setItem(`${account}-${key}`, itemJSON);
  };
  isContractCreator = async address => {
    if (address === null) {
      return false;
    }
    const check = await info.isContractExist(address);
    if (check) {
      return this.state.account === (await baseContract.getCreator(address));
    } else {
      return false;
    }
  };
  render() {
    const {
      baseAddressList,
      isContract,
      selectId,
      selectSurveyId,
      account
    } = this.state;
    const baseAddress = baseAddressList[selectId];

    return (
      <Segment>
        Input BaseAddress
        <InputBaseAddress onSubmit={this.handleSubmit} label="BaseAddress" />
        <DeployBaseContract
          account={this.props.account}
          onSubmit={this.handleSubmit}
        />
        <ListBaseAddress
          account={this.state.account}
          items={baseAddressList}
          deleteItemFunc={this.deleteBaseItem}
          selectItemFunc={this.selectBaseItem}
        />
        {isContract ? <CreateSurveyRequest address={baseAddress} /> : null}
        <ListSurveyRequest
          address={baseAddress}
          isCreator={isContract}
          selectItemFunc={this.selectSurveyRequest}
        />
        <ListSurveyAccount
          address={baseAddress}
          id={selectSurveyId}
          account={account}
        />
        <RequestSurveyInfo id={selectSurveyId} address={baseAddress} />
        <DeploySurveyBlock baseAddress={baseAddress} id={selectId} />
      </Segment>
    );
  }
}

export default BaseInfo;
