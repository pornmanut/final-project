import React, { Component } from "react";
import { Container, Segment, Header } from "semantic-ui-react";
class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myAccount: null
    };
  }

  render() {
    const { account, networkType } = this.props;
    return (
      <Segment>
        <Header as="h3">Account Info {account}</Header>
        <p>Network: {networkType}</p>
      </Segment>
    );
  }
}

export default AccountInfo;
