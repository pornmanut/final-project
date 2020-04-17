import React, { Component } from "react";
import { Segment } from "semantic-ui-react";
import info from "../../lib/web3/info";
class ListAccountState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myAccount: null,
      isLoading: true
    };
  }
  async componentDidMount() {
    const myAccount = await info.getMyAccount();
    this.setState({
      myAccount,
      isLoading: false
    });
  }
  createTaskItem = (item, key) => {
    return (
      <li key={key}>
        <Segment style={{ height: 50 }}>
          Accounts: {item.account} State: {item.state} Group:{item.groupId}{" "}
          <b>
            {item.account == this.state.myAccount ? "<Your Account>" : null}
          </b>
        </Segment>
      </li>
    );
  };
  render() {
    const { items } = this.props;
    const { isLoading } = this.state;
    if (isLoading) {
      return null;
    }
    const listItems = items.map(this.createTaskItem);

    return (
      <div>
        <pre style={{ maxHeight: 300, overflowY: "scroll" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>{listItems}</ul>
        </pre>
      </div>
    );
  }
}

export default ListAccountState;
