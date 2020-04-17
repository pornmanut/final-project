import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import baseContract from "../../lib/web3/baseContract";
import surveyContract from "../../lib/web3/surveyContract";
import DeploySurveyButton from "./DeploySurveyButton";
import info from "../../lib/web3/info";

class DeploySurveyBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyAddress: null
    };
  }
  async componentDidMount() {
    let surveyAddress = [];
    const { id } = this.props;
    const baseAddress = "0x0e0D28D0F48bDF7970D505453C4f3BbD9248bAa2";
    const networkType = await info.getNetwork();

    const localSurveyAddress = this.getLocalStorage(
      [networkType, baseAddress, id, "SurveyAddress"].join("-")
    );

    if (localSurveyAddress) {
      surveyAddress = localSurveyAddress;
    }
    this.setState({
      surveyAddress,
      networkType,
      baseAddress,
      id
    });
  }

  setLocalStorage = (id, value) => {
    localStorage.setItem(id, JSON.stringify(value));
  };
  getLocalStorage = id => {
    return JSON.parse(localStorage.getItem(id));
  };
  handleClick = surveyAddress => {
    this.setState(state => {
      this.setLocalStorage(
        [state.networkType, state.baseAddress, state.id, "SurveyAddress"].join(
          "-"
        ),
        surveyAddress
      );
      return { surveyAddress };
    });
  };
  render() {
    const { surveyAddress, baseAddress, id } = this.state;
    return (
      <div>
        {surveyAddress}
        <DeploySurveyButton getAddressFunc={this.handleClick} />
        <BaseAssignSurveyButton
          baseAddress={baseAddress}
          id={id}
          surveyAddress={surveyAddress}
        />
        <AssignAccountSurveyButton
          baseAddress={baseAddress}
          id={id}
          surveyAddress={surveyAddress}
        />
        <GroupInfoButton surveyAddress={surveyAddress} id={0} />
      </div>
    );
  }
}

class AssignAccountSurveyButton extends Component {
  handleClick = async () => {
    const { baseAddress, id, surveyAddress } = this.props;
    const accounts = await baseContract.getApprovedAccount(baseAddress, id);
    const a = await surveyContract.assign(
      surveyAddress,
      baseAddress,
      id,
      accounts,
      256
    );
    console.log(a);
  };
  render() {
    return (
      <div>
        <Button onClick={this.handleClick}>Assign Account</Button>
      </div>
    );
  }
}
class BaseAssignSurveyButton extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = async () => {
    const { baseAddress, id, surveyAddress } = this.props;
    const a = await baseContract.assignSurveyAddress(
      baseAddress,
      id,
      surveyAddress
    );
    console.log(a);
  };
  render() {
    return (
      <Button primary onClick={this.handleClick}>
        Assign Survey
      </Button>
    );
  }
}
class GroupInfoButton extends Component {
  handleClick = async () => {
    const { surveyAddress, id } = this.props;
    const a = await surveyContract.getGroupInfo(surveyAddress, id);
    const b = await surveyContract.getGroupAccount(surveyAddress, id);
    const c = await surveyContract.getAccountInfo(
      surveyAddress,
      "0xdc30FD90b9f7211587beBC7b15BC7071F0e6de94"
    );
    console.log(a);
    console.log(b);
    console.log(c);
  };
  render() {
    return <Button onClick={this.handleClick}>GroupInfo</Button>;
  }
}

export default DeploySurveyBlock;
