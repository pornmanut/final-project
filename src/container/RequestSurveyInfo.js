import React, { Component } from "react";
import { Segment, Button, Grid } from "semantic-ui-react";
import baseContract from "../lib/web3/baseContract";
import SurveyRequestBlock from "./SurveyRequestBlock";
class RequestSurveyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: null,
      id: null,
      isLoading: true
    };
  }
  async componentDidMount() {
    await this.update();
  }
  async componentDidUpdate(previousProps) {
    const { address, id } = this.props;

    if (previousProps.id !== id || previousProps.address !== address) {
      await this.update();
    }
  }

  update = async () => {
    const { address, id } = this.props;
    const survey = await baseContract.getSurveyById(address, id);
    let isOpen;
    if (survey) {
      isOpen = survey.isOpen;
    }
    this.setState({
      survey,
      isOpen,
      isLoading: false
    });
  };
  render() {
    const { isLoading, survey, isOpen } = this.state;
    const { address, id } = this.props;
    if (isLoading || !survey) {
      return null;
    }
    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <SurveyRequestBlock survey={survey}></SurveyRequestBlock>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <OpenSurveyButton
                        address={address}
                        id={id}
                        isOpen={isOpen}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <CloseSurveyButton
                        address={address}
                        id={id}
                        isOpen={isOpen}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <GetApprovedButton address={address} id={id} />
        <SetHashButton address={address} id={id} />
        <GetHashButton address={address} id={id} />
      </Segment>
    );
  }
}

class CloseSurveyButton extends Component {
  constructor(props) {
    super(props);
  }
  closeSurvey = async () => {
    const { address, id } = this.props;
    const check = await baseContract.closeSurvey(address, id);
    console.log(check);
  };
  render() {
    const { isOpen } = this.props;
    return (
      <Button negative disabled={!isOpen} onClick={this.closeSurvey}>
        Close Survey
      </Button>
    );
  }
}

class SetHashButton extends Component {
  constructor(props) {
    super(props);
  }
  test = async () => {
    const { address, id } = this.props;
    const a = await baseContract.setHashAccount(address, id);
    console.log(a);
  };
  render() {
    return (
      <Button secondary onClick={this.test}>
        Test
      </Button>
    );
  }
}
class GetApprovedButton extends Component {
  constructor(props) {
    super(props);
  }
  test = async () => {
    const { address, id } = this.props;
    const approvedAddress = await baseContract.getApprovedAccount(address, id);
    console.log(approvedAddress);
  };
  render() {
    return (
      <Button primary onClick={this.test}>
        GetApproved
      </Button>
    );
  }
}
class GetHashButton extends Component {
  constructor(props) {
    super(props);
  }
  test = async () => {
    const { address, id } = this.props;
    const approvedAddress = baseContract.getHasAccount(address, id);
    console.log(approvedAddress);
  };
  render() {
    return (
      <Button primary onClick={this.test}>
        GetHash
      </Button>
    );
  }
}
class OpenSurveyButton extends Component {
  constructor(props) {
    super(props);
  }
  openSurvey = async () => {
    const { address, id } = this.props;
    const check = await baseContract.openSurvey(address, id);
    console.log(check);
  };
  render() {
    const { isOpen } = this.props;
    return (
      <Button positive disabled={isOpen} onClick={this.openSurvey}>
        Open Survey
      </Button>
    );
  }
}
export default RequestSurveyInfo;
