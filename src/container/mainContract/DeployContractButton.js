import React, { Component } from "react";
import { Segment, Button } from "semantic-ui-react";
import baseContract from "../../lib/web3/mainContract";

class DeployContractButton extends Component {
  constructor(props) {
    super(props);
  }
  deployContract = async () => {
    const address = await baseContract.deploy();
    if (this.props.onClick) {
      this.props.onClick(address);
    }
  };
  render() {
    return (
      <Button primary fluid onClick={this.deployContract}>
        Deploy
      </Button>
    );
  }
}

export default DeployContractButton;
