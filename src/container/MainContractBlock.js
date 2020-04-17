import React, { Component } from "react";
import { Segment, Button, Placeholder, Grid, Header } from "semantic-ui-react";
import InputButton from "../component/InputButton";
import DeployContractButton from "./mainContract/DeployContractButton";
import ListSurvey from "./survey/ListSurvey";
import ListRoom from "./mainContract/ListRoom";
import CreateRoom from "./mainContract/CreateRoom";
import baseContract from "../lib/web3/mainContract";

const setLocalStorage = (id, value) => {
  localStorage.setItem(id, JSON.stringify(value));
};
const getLocalStorage = id => {
  return JSON.parse(localStorage.getItem(id));
};
class MainContractBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractList: [],
      isLoading: true,
      myAccount: null,
      networkType: null,
      selectItem: 0,
      currentContract: null
    };
  }
  async componentDidMount() {
    const { networkType, myAccount } = this.props;
    const { selectItem } = this.state;
    let contractList = [];
    let currentContract = null;
    const localContractList = getLocalStorage(
      [networkType, myAccount, "contractList"].join("-")
    );
    if (localContractList) {
      contractList = localContractList;
      currentContract = localContractList[selectItem];
    }
    this.setState({
      networkType,
      myAccount,
      contractList,
      currentContract
    });
  }

  addContractOnFront = address => {
    this.setState(state => {
      const contractList = [address, ...state.contractList];
      setLocalStorage(
        [state.networkType, state.myAccount, "contractList"].join("-"),
        contractList
      );
      return {
        contractList
      };
    });
  };

  addContractOnBack = address => {
    this.setState(state => {
      const contractList = [...state.contractList, address];
      setLocalStorage(
        [state.networkType, state.myAccount, "contractList"].join("-"),
        contractList
      );
      return {
        contractList
      };
    });
  };

  handleDeleteSurvey = id => {
    this.setState(state => {
      const contractList = state.contractList.filter((_, key) => {
        return key !== id;
      });
      const currentContract = contractList[state.selectItem];
      setLocalStorage(
        [state.networkType, state.myAccount, "contractList"].join("-"),
        contractList
      );
      return {
        contractList,
        currentContract
      };
    });
  };

  handleSelectItem = async selectItem => {
    const currentContract = this.state.contractList[selectItem];

    this.setState({
      selectItem,
      currentContract
    });
  };
  render() {
    const { myAccount } = this.props;
    const { contractList, currentContract, networkType } = this.state;
    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={14}>
              <InputButton
                buttonName="Push"
                placeholder="address of contract"
                onSubmit={this.addContractOnBack}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <DeployContractButton onClick={this.addContractOnFront} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ListSurvey
          items={contractList}
          onSelect={this.handleSelectItem}
          onDelete={this.handleDeleteSurvey}
          multiple={false}
          myAccount={myAccount}
        />
        <CreateRoom currentContract={currentContract} myAccount={myAccount} />
        <ListRoom
          myAccount={myAccount}
          networkType={networkType}
          currentContract={currentContract}
        />
      </Segment>
    );
  }
}
export default MainContractBlock;
