import React, { Component } from "react";
import { Segment, Grid, Button } from "semantic-ui-react";
import baseContract from "../lib/web3/baseContract";
import ListLabel from "../component/ListLabel";
import SendApprovedButton from "./SendApprovedButton";
class ListSurveyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      id: 0,
      items: [],
      address: null,
      isLoading: true,
      selectItems: [],
      creator: null
    };
  }
  getAccountList = async (address, id) => {
    return await baseContract.getAccountList(address, id, 0, 10);
  };
  updateState = async (address, id, account) => {
    const items = await this.getAccountList(address, id);
    const creator = await baseContract.getCreator(address);
    this.setState({ id, address, items, isLoading: false, account, creator });
  };
  async componentDidMount() {
    const { address, id, account } = this.props;
    this.updateState(address, id, account);
  }
  async componentDidUpdate(previousProps) {
    const { address, id, account } = this.props;
    if (previousProps.id !== id || previousProps.address !== address) {
      this.updateState(address, id, account);
    }
  }
  getAccountFromSelectKey = () => {
    const { selectItems, items } = this.state;
    const account = [];
    if (items.length === 0) {
      return account;
    }
    for (let i = 0; i < selectItems.length; i++) {
      account.push(items[selectItems[i]]["account"]);
    }
    return account;
  };
  selectItem = key => {
    this.setState(prevState => {
      const index = prevState.selectItems.indexOf(key);
      let selectItems;
      if (index !== -1) {
        selectItems = prevState.selectItems.filter(item => item !== key);
      } else {
        selectItems = prevState.selectItems.concat(key);
      }
      return {
        selectItems
      };
    });
  };
  isSelectItem = key => {
    return this.state.selectItems.includes(key);
  };
  createAccountItem = (item, key) => {
    const { account, hasRight } = item;
    return (
      <li key={key}>
        <Segment>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column width={2}>
                {this.state.creator === this.state.account ? (
                  <Button
                    primary={this.isSelectItem(key)}
                    onClick={() => this.selectItem(key)}
                    size="mini"
                  >
                    Select
                  </Button>
                ) : null}
              </Grid.Column>
              <Grid.Column width={8}>
                Account {account}{" "}
                <b>
                  {this.state.account === account ? "(Your Account)" : null}
                </b>
              </Grid.Column>
              <Grid.Column>
                <b>{hasRight ? "Approved" : "Not Approved"}</b>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </li>
    );
  };
  render() {
    const { isLoading, address, items, id, account } = this.state;
    if (isLoading) {
      return <Segment>Loading</Segment>;
    }
    const listItem = items.map(this.createAccountItem);
    const accountSelect = this.getAccountFromSelectKey();
    return (
      <div>
        <b>AccountList</b>
        <ul style={{ listStyleType: "none", padding: 0 }}> {listItem}</ul>
        {items.length === 0 ? "No any account assign yet" : null}
        {items.length > 0 && this.state.creator === this.state.account ? (
          <Segment>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column width={4}>
                  <SendApprovedButton
                    account={account}
                    address={address}
                    items={accountSelect}
                    id={id}
                  />
                </Grid.Column>
                <Grid.Column width={12}>
                  <ListLabel items={accountSelect} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        ) : null}
      </div>
    );
  }
}

export default ListSurveyAccount;
