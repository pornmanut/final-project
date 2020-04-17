import React, { Component } from "react";
import { Segment } from "semantic-ui-react";
import surveyContract from "../../lib/web3/surveyContract";
import info from "../../lib/web3/info";

class SurveyInfoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }
  async componentDidMount() {
    const { address, myAccount } = this.props;
    this.loadSurveyInfo(address, myAccount);
  }

  loadSurveyInfo = async (address, myAccount) => {
    this.setState({
      isLoading: true
    });
    let creator;
    const isExist = await info.isContractExist(address);
    if (isExist) {
      const fetchCreator = await surveyContract.getCreator(address);
      creator = fetchCreator;
    }
    this.setState({
      address: address,
      creator: creator,
      isCreator: creator === myAccount,
      isExist: isExist,
      isLoading: false
    });
  };
  async componentDidUpdate(prevState) {
    const { address, myAccount } = this.props;

    if (prevState.address != address) {
      this.loadSurveyInfo(address, myAccount);
    }
  }
  render() {
    const { isLoading, address, creator, isCreator, isExist } = this.state;
    if (isLoading) {
      return (
        <Segment loading>
          <h5>Loading</h5>
        </Segment>
      );
    }
    if (!isExist) {
      return (
        <Segment>
          <h5>Survey Address: {address}</h5>
          <p>Not found contract at address!!!</p>
        </Segment>
      );
    }
    return (
      <Segment>
        <h5>Survey Address: {address}</h5>
        <p>
          Creator: {creator} <b>{isCreator ? "<Your Address>" : null}</b>
        </p>
      </Segment>
    );
  }
}
export default SurveyInfoItem;
