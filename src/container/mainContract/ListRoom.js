import React, { Component } from "react";
import {
  Segment,
  Grid,
  GridColumn,
  Button,
  Header,
  GridRow,
  Label
} from "semantic-ui-react";
import baseContract from "../../lib/web3/mainContract";
import ListSurveyAccount from "../ListSurveyAccount";
import RequestSurveyInfo from "../RequestSurveyInfo";
import SurveyDeploy from "./SurveyDeploy";

class ListRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectList: [0]
    };
  }
  onSelect = selectList => {
    if (this.props.onSelect) {
      this.props.onSelect(selectList);
    }
  };

  handleClose = async id => {
    const { currentContract } = this.props;
    await baseContract.closeRoom(currentContract, id);
  };
  handleRequest = async id => {
    const { currentContract } = this.props;
    await baseContract.requestAssign(currentContract, id);
  };
  selectItemKey = key => {
    if (this.props.multiple) {
      this.setState(state => {
        let selectList;
        if (state.selectList.indexOf(key) != -1) {
          selectList = state.selectList.filter(item => item !== key);
        } else {
          selectList = [...state.selectList, key];
        }
        this.onSelect(selectList);
        return {
          selectList
        };
      });
    } else {
      this.setState(_ => {
        let selectList;
        selectList = [key];
        this.onSelect(selectList);
        return {
          selectList
        };
      });
    }
  };
  loadRoom = async (currentContract, myAccount) => {
    const items = await baseContract.getRoomList(currentContract);
    const creator = await baseContract.getCreator(currentContract);
    const isCreator = myAccount === creator;

    this.setState({
      items,
      creator,
      isCreator
    });
  };

  // async componentDidMount() {
  //   const { currentContract, myAccount } = this.props;
  //   this.loadRoom(currentContract, myAccount);
  // }
  async componentDidUpdate(prevState) {
    const { currentContract, myAccount } = this.props;
    if (prevState.currentContract !== currentContract) {
      this.loadRoom(currentContract, myAccount);
    }
  }
  createCreatorItem = (item, key) => {
    const { myAccount } = this.props;
    return (
      <li key={key}>
        <Segment>
          <Grid columns={3}>
            <Grid.Row>
              <GridColumn width={2}>
                <Button
                  fluid
                  primary={this.state.selectList.includes(key)}
                  onClick={() => this.selectItemKey(key)}
                >
                  Select
                </Button>
              </GridColumn>
              <GridColumn width={12}>
                <RoomInfo item={item} id={key} />
              </GridColumn>
              <GridColumn width={2}>
                <Button
                  fluid
                  negative
                  disabled={item.approvedLength < 3 || !item.isOpen}
                  onClick={() => this.handleClose(key)}
                >
                  Close
                </Button>
              </GridColumn>
            </Grid.Row>
          </Grid>
        </Segment>
      </li>
    );
  };
  createNotCreatorItem = (item, key) => {
    const { myAccount } = this.props;
    return (
      <li key={key}>
        <Segment>
          <Grid columns={3}>
            <Grid.Row>
              <GridColumn width={2}>
                <Button
                  fluid
                  primary={this.state.selectList.includes(key)}
                  onClick={() => this.selectItemKey(key)}
                >
                  Select
                </Button>
              </GridColumn>
              <GridColumn width={12}>
                <RoomInfo id={key} item={item} />
              </GridColumn>
              <GridColumn width={2}>
                <Button fluid positive onClick={() => this.handleRequest(key)}>
                  Request
                </Button>
              </GridColumn>
            </Grid.Row>
          </Grid>
        </Segment>
      </li>
    );
  };
  render() {
    const { items, selectList, isCreator } = this.state;
    const { currentContract, myAccount, networkType } = this.props;
    let listItems;
    if (isCreator) {
      listItems = items.map(this.createCreatorItem);
    } else {
      listItems = items.map(this.createNotCreatorItem);
    }
    return (
      <Segment>
        <Header as="h3">Room List on {currentContract}</Header>
        <pre style={{ maxHeight: 400, overflowY: "scroll" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>{listItems}</ul>
        </pre>
        <ListSurveyAccount
          address={currentContract}
          id={selectList[0]}
          account={myAccount}
        />
        {isCreator ? (
          <SurveyDeploy
            currentContract={currentContract}
            myAccount={myAccount}
            id={selectList[0]}
            networkType={networkType}
          />
        ) : null}
      </Segment>
    );
  }
}

class RoomInfo extends Component {
  render() {
    const { item, id } = this.props;
    const {
      isOpen,
      isAssignAddress,
      message,
      requestLength,
      approvedLength,
      surveyAddress
    } = item;
    return (
      <Segment>
        <Header as="h3">Name: {message}</Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <p>
                Approved: {approvedLength} Reqeust: {requestLength}
              </p>
              {isOpen ? (
                <Label color="green">Open</Label>
              ) : (
                <Label color="red">Close</Label>
              )}
            </Grid.Column>
            <Grid.Column>
              <p>Id: {id}</p>
              {isAssignAddress ? (
                <p>{surveyAddress}</p>
              ) : (
                <p>Not Assign Address Yet</p>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default ListRoom;
