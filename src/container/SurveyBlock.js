import React, { Component } from "react";
import { Segment, Button, Grid } from "semantic-ui-react";
import InputButton from "../component/InputButton";
import ListSurvey from "./survey/ListSurvey";
import ListAccountFromSurvey from "./survey/ListAccountFromSurvey";
import PublicKeyBlock from "./survey/PublicKeyBlock";
import SendDataBlock from "./survey/SendDataBlock";
import info from "../lib/web3/info";
import surveyContract from "../lib/web3/surveyContract";
import contractState from "../lib/web3/util/contractState";
import VerifyBlock from "./survey/VerifyBlock";
import DeploySurveyButton from "./survey/DeploySurveyButton";
class SurveyBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyList: [],
      isLoading: true,
      myAccount: null,
      networkType: null,
      selectItem: 0,
      currentSurvey: null,
      currentState: null
    };
  }
  async componentDidMount() {
    let surveyList = [];
    let currentSurvey = null;
    let currentSurveyIsExist = null;
    let surveyAccountIsExist = false;
    let currentState = null;
    const myAccount = await info.getMyAccount();
    const networkType = await info.getNetwork();

    const localSurveyList = this.getLocalStorage(
      [networkType, myAccount, "surveyList"].join("-")
    );
    if (localSurveyList) {
      surveyList = localSurveyList;
      currentSurvey = localSurveyList[0];
      currentSurveyIsExist = await info.isContractExist(currentSurvey);
      surveyAccountIsExist = await surveyContract.getAccountIsExist(
        currentSurvey,
        myAccount
      );
      currentState = await surveyContract.getContractState(currentSurvey);
    }

    this.setState({
      surveyList,
      myAccount,
      networkType,
      currentSurvey,
      currentSurveyIsExist,
      surveyAccountIsExist,
      currentState
    });
  }
  setLocalStorage = (id, value) => {
    localStorage.setItem(id, JSON.stringify(value));
  };
  getLocalStorage = id => {
    return JSON.parse(localStorage.getItem(id));
  };

  addSurveyOnFront = address => {
    this.setState(state => {
      const surveyList = [address, ...state.surveyList];
      this.setLocalStorage(
        [state.networkType, state.myAccount, "surveyList"].join("-"),
        surveyList
      );
      return {
        surveyList
      };
    });
  };

  addSurveyOnBack = address => {
    this.setState(state => {
      const surveyList = [...state.surveyList, address];
      this.setLocalStorage(
        [state.networkType, state.myAccount, "surveyList"].join("-"),
        surveyList
      );
      return {
        surveyList
      };
    });
  };

  handleDeleteSurvey = id => {
    this.setState(state => {
      const surveyList = state.surveyList.filter((_, key) => {
        return key !== id;
      });
      const currentSurvey = surveyList[this.state.selectItem];
      console.log(currentSurvey);
      this.setLocalStorage(
        [state.networkType, state.myAccount, "surveyList"].join("-"),
        surveyList
      );
      return {
        surveyList,
        currentSurvey
      };
    });
  };

  handleSelectItem = async selectItem => {
    const { myAccount } = this.state;
    const currentSurvey = this.state.surveyList[selectItem];
    const currentSurveyIsExist = await info.isContractExist(currentSurvey);
    const surveyAccountIsExist = await surveyContract.getAccountIsExist(
      currentSurvey,
      myAccount
    );
    const currentState = await surveyContract.getContractState(currentSurvey);

    this.setState({
      selectItem,
      currentSurvey,
      currentSurveyIsExist,
      surveyAccountIsExist,
      currentState
    });
  };

  render() {
    const {
      surveyList,
      myAccount,
      surveyAccountIsExist,
      currentSurvey,
      networkType,
      currentSurveyIsExist,
      currentState
    } = this.state;
    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={14}>
              <InputButton
                buttonName="Push"
                placeholder="address of survey"
                onSubmit={this.addSurveyOnBack}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <DeploySurveyButton getAddressFunc={this.addSurveyOnFront} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ListSurvey
          items={surveyList}
          onSelect={this.handleSelectItem}
          onDelete={this.handleDeleteSurvey}
          multiple={false}
          myAccount={myAccount}
        />
        {currentSurvey && currentSurveyIsExist ? (
          <ListAccountFromSurvey
            surveyAddress={currentSurvey}
            myAccount={myAccount}
          />
        ) : null}
        {currentSurvey && currentSurveyIsExist && surveyAccountIsExist ? (
          <PublicKeyBlock
            surveyAddress={currentSurvey}
            myAccount={myAccount}
            networkType={networkType}
          />
        ) : null}
        {currentSurvey &&
        currentSurveyIsExist &&
        surveyAccountIsExist &&
        currentState === contractState.sendData ? (
          <SendDataBlock
            surveyAddress={currentSurvey}
            myAccount={myAccount}
            networkType={networkType}
          />
        ) : null}
        {currentSurvey &&
        currentSurveyIsExist &&
        surveyAccountIsExist &&
        currentState === contractState.verfiy ? (
          <VerifyBlock
            surveyAddress={currentSurvey}
            myAccount={myAccount}
            networkType={networkType}
          />
        ) : null}
      </Segment>
    );
  }
}

export default SurveyBlock;
