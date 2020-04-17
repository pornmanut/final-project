import React, { Component } from "react";
import { Segment, Button, Grid, GridColumn } from "semantic-ui-react";
import info from "../lib/web3/info";
import baseContract from "../lib/web3/baseContract";
class ListBaseAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      select: 0,
      items: [],
      isContractExitsList: [],
      isLoading: true
    };
    this.selectItem = this.selectItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.isSelect = this.isSelect.bind(this);
  }

  selectItem(key) {
    if (this.props.selectItemFunc) {
      this.props.selectItemFunc(key);
    }
    this.setState({
      select: key
    });
  }
  async deleteItem(key) {
    if (this.props.deleteItemFunc) {
      this.props.deleteItemFunc(key);
    }
    this.reloadContractExitsList();
  }
  reloadContractExitsList = async () => {
    this.setState({ isLoading: true });
    const isContractExistList = await this.getContractExistList(
      this.props.items
    );
    this.setState({
      items: this.props.items,
      isContractExistList,
      isLoading: false
    });
  };
  isSelect = key => {
    if (key === this.state.select) {
      return true;
    } else {
      return false;
    }
  };
  async componentDidMount() {
    this.reloadContractExitsList();
  }
  async componentDidUpdate(previousProps) {
    if (previousProps.items !== this.props.items) {
      this.reloadContractExitsList();
    }
  }
  getContractExistList = async items => {
    const result = [];
    for (let i = 0; i < items.length; i++) {
      const check = await info.isContractExist(items[i]);
      let creator;

      if (check) {
        creator = await baseContract.getCreator(items[i]);
      } else {
        creator = null;
      }

      result.push(creator);
    }
    return result;
  };

  createListItem = (item, key) => {
    const contractInfo = this.state.isContractExistList[key];
    return (
      <li key={key}>
        <Segment>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column width={2}>
                <Button
                  onClick={() => this.selectItem(key)}
                  primary={this.isSelect(key)}
                  size="mini"
                >
                  Select
                </Button>
              </Grid.Column>
              <Grid.Column width={8}>
                {item}
                <p>
                  {contractInfo ? (
                    <b>
                      Creator: {contractInfo}
                      {contractInfo === this.props.account
                        ? " (Your Address)"
                        : null}
                    </b>
                  ) : (
                    <b>Not Exist</b>
                  )}
                </p>
              </Grid.Column>
              <Grid.Column>
                <Button
                  floated="right"
                  negative
                  size="mini"
                  onClick={() => this.deleteItem(key)}
                >
                  Delete
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </li>
    );
  };
  render() {
    let items = this.state.items;
    if (this.state.isLoading) {
      return (
        <Segment>
          <h2>Is Loading</h2>
        </Segment>
      );
    } else {
      return (
        <Segment>
          <b>BaseAddressList</b>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {items.map(this.createListItem)}
          </ul>
          {items.length === 0 ? "You doesn't assign any baseAddress" : null}
        </Segment>
      );
    }
  }
}
export default ListBaseAddress;
