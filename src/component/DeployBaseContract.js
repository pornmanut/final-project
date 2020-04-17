import React, { Component } from "react";
import { Segment, Button } from "semantic-ui-react";
import baseContract from "../lib/web3/baseContract";
class DeployBaseContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: this.props.account
    };
    this.deployContract = this.deployContract.bind(this);
  }
  deployContract = async () => {
    const address = await baseContract.deploy(this.state.account);
    this.props.onSubmit(address);
  };
  render() {
    return (
      <Segment>
        Deploy new Contract
        <Button
          primary
          floated="right"
          size="mini"
          onClick={this.deployContract}
        >
          Deploy
        </Button>
      </Segment>
    );
  }
}

export default DeployBaseContract;
