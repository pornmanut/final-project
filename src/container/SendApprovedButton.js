import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import baseContract from "../lib/web3/baseContract";
class SendApprovedButton extends Component {
  approvedAccount = async () => {
    const { address, id, items } = this.props;

    const check = await baseContract.regisAccountFromRequestPool(
      address,
      id,
      items
    );
    console.log(check);
  };
  isHasItems = () => {
    const { items } = this.props;
    return items.length === 0;
  };
  render() {
    return (
      <Button
        positive
        disabled={this.isHasItems()}
        onClick={this.approvedAccount}
      >
        Approved Accounts
      </Button>
    );
  }
}
export default SendApprovedButton;
