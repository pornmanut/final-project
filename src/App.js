import React, { Component } from "react";
import { Container, Grid, GridColumn, Button } from "semantic-ui-react";
import AccountInfo from "./container/AccountInfo";
import BaseInfo from "./container/BaseInfo";
import info from "./lib/web3/info";
import SurveyBlock from "./container/SurveyBlock";
import MainContractBlock from "./container/MainContractBlock";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAccount: "",
      networkType: "Unknown",
      isLoading: true
    };

    this.getAccountInfo = this.getAccountInfo.bind(this);
  }
  getAccountInfo = async () => {
    const currentAccount = await info.getMyAccount();
    const networkType = await info.getNetwork();

    this.setState({
      currentAccount,
      networkType,
      isLoading: false,
      isMainContract: false,
      isSurveyContract: false
    });
  };
  async componentDidMount() {
    this.getAccountInfo();
  }
  handleClickMainContract = () => {
    this.setState({ isMainContract: true, isSurveyContract: false });
  };
  handleClickSurvey = () => {
    this.setState({ isSurveyContract: true, isMainContract: false });
  };
  render() {
    const {
      isLoading,
      currentAccount,
      networkType,
      isMainContract,
      isSurveyContract
    } = this.state;
    if (isLoading) {
      return <Container>Is Loading</Container>;
    }
    return (
      <Container>
        <AccountInfo account={currentAccount} networkType={networkType} />
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Button
                fluid
                primary={isMainContract}
                onClick={this.handleClickMainContract}
              >
                Main Contract
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                fluid
                primary={isSurveyContract}
                onClick={this.handleClickSurvey}
              >
                Survey
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {isMainContract ? (
          <MainContractBlock
            myAccount={currentAccount}
            networkType={networkType}
          />
        ) : null}
        {isSurveyContract ? <SurveyBlock /> : null}
      </Container>
    );
  }
}

export default App;
