import React, { Component } from "react";
import InputSegment from "../component/InputSegment";
class BaseAddressInput extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.props.onSubmit;
  }
  render() {
    return (
      <InputSegment
        onSubmit={this.handleSubmit}
        label="BaseAddress"
        placeholder="address"
        action="Add"
      />
    );
  }
}

export default BaseAddressInput;
