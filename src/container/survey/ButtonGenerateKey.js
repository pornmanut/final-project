import React, { Component } from "react";
import { Segment, Button } from "semantic-ui-react";
import forge from "../../lib/forge";
class ButtonGenerateKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isOne: false,
      message: "Generate Key Pair"
    };

    this.handleClick = this.handleClick.bind(this);
  }
  async handleClick() {
    await this.setState({ isLoading: true });
    if (this.props.isExist) {
      if (this.state.isOne) {
        const pair = await forge.generatePublicKey(this.props.keySize);
        if (this.props.onClick) {
          this.props.onClick(pair);
        }
      } else {
        this.setState({ isOne: true, message: "Really?" });
      }
    } else {
      const pair = await forge.generatePublicKey(this.props.keySize);
      if (this.props.onClick) {
        this.props.onClick(pair);
      }
    }
    this.setState({ isLoading: false });
  }
  render() {
    return (
      <Button
        negative={this.state.isOne}
        loading={this.state.isLoading}
        onClick={this.handleClick}
        disabled={this.props.disabled}
      >
        {this.state.message}
      </Button>
    );
  }
}

export default ButtonGenerateKey;
