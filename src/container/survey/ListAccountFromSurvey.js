import React, { Component } from "react";
import surveyContract from "../../lib/web3/surveyContract";
import { Segment, Header } from "semantic-ui-react";
import ListAccountState from "./ListAccountState";
import contractState from "../../lib/web3/util/contractState";
class ListAccountFromSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: null,
      isLoading: true,
      currentState: null
    };
  }
  loadMemberInfo = async surveyAddress => {
    let currentState = null,
      accounts = [];

    this.setState({ isLoading: true });
    currentState = await surveyContract.getContractState(surveyAddress);
    if (currentState !== contractState.init) {
      const fetchAccounts = await surveyContract.getMember(surveyAddress);
      accounts = fetchAccounts;
    }

    this.setState({ accounts, currentState, isLoading: false });
  };
  async componentDidMount() {
    const { surveyAddress, myAccount } = this.props;
    this.loadMemberInfo(surveyAddress);
  }
  async componentDidUpdate(prevState) {
    const { surveyAddress, myAccount } = this.props;

    if (prevState.surveyAddress != surveyAddress) {
      this.loadMemberInfo(surveyAddress);
    }
  }

  render() {
    const { isLoading, accounts, currentState } = this.state;
    const { surveyAddress, myAccount } = this.props;
    if (isLoading) {
      return (
        <Segment loading style={{ height: 100 }}>
          loading
        </Segment>
      );
    }
    return (
      <div>
        <ShowContractState
          surveyAddress={surveyAddress}
          currentState={currentState}
        />
        {currentState !== contractState.init ? (
          <ListAccountState items={accounts} />
        ) : null}
      </div>
    );
  }
}
class ShowContractState extends Component {
  render() {
    const { surveyAddress, currentState } = this.props;
    return (
      <Segment>
        <Header as="h2">SurveyState: {currentState}</Header>
        <p>SurveyAddress: {surveyAddress}</p>
      </Segment>
    );
  }
}

export default ListAccountFromSurvey;
