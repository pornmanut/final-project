import React, { Component } from "react";
import { Segment, Button, Grid, Label } from "semantic-ui-react";
import baseContract from "../lib/web3/baseContract";
class ListSurveyRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: null,
      isCreator: false,
      isLoading: true,
      items: [],
      select: 0
    };
  }
  async componentDidMount() {
    const { address, isCreator } = this.props;
    this.updateState(address, isCreator);
  }
  updateState = async (address, isCreator) => {
    const items = await this.getSurveyRequestList(address);
    this.setState({ address, isCreator, isLoading: false, items, select: 0 });
  };
  async componentDidUpdate(previousProps) {
    const { address, isCreator } = this.props;
    if (previousProps.address !== address) {
      this.updateState(address, isCreator);
    }
  }
  getSurveyRequestList = async address => {
    return await baseContract.getSurveyList(address);
  };
  selectItem = key => {
    this.props.selectItemFunc(key);
    this.setState({ select: key });
  };
  requestAssignToSurvey = async id => {
    const { address } = this.state;
    const check = baseContract.requestAssignToSurvey(address, id);
    console.log(check);
  };
  createSurveyRequestItem = (item, key) => {
    const {
      isOpen,
      isAssignAddress,
      message,
      requestLength,
      approvedLength,
      surveyAddress
    } = item;
    const { isCreator } = this.state;
    return (
      <li key={key}>
        <Segment>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column width={2}>
                <Button
                  onClick={() => this.selectItem(key)}
                  primary={key === this.state.select}
                  size="mini"
                >
                  Select
                </Button>
              </Grid.Column>
              <Grid.Column width={6}>
                Name: <b>{message}</b>
              </Grid.Column>
              <Grid.Column>
                <span>
                  {isAssignAddress
                    ? "Already AssignAddress"
                    : "Not AssignAddress Yet"}
                </span>
                <p>{isAssignAddress ? surveyAddress : null}</p>
              </Grid.Column>
              <Grid.Column>
                <span>
                  Member: {approvedLength}/ {requestLength}
                </span>{" "}
                <span>
                  <Label color={isOpen ? "green" : "red"}>
                    <b>{isOpen ? "Open" : "Close"}</b>
                  </Label>
                </span>{" "}
                <span>
                  {!isCreator ? (
                    <Button
                      positive
                      onClick={() => this.requestAssignToSurvey(key)}
                      floated="right"
                      size="mini"
                    >
                      AssignTo
                    </Button>
                  ) : null}
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </li>
    );
  };
  render() {
    const { isLoading, items, address } = this.state;

    if (isLoading) {
      return <Segment>Is Loading</Segment>;
    }

    const listItem = items.map(this.createSurveyRequestItem);
    return (
      <Segment>
        <b>SurveyRequestList</b> from Contract at {address}
        <ul style={{ listStyleType: "none", padding: 0 }}>{listItem}</ul>
        {items.length === 0 ? "Not Found any Survey Request" : null}
      </Segment>
    );
  }
}
export default ListSurveyRequest;
