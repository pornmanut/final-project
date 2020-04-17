import React, { Component } from "react";
import { Segment } from "semantic-ui-react";
import baseContract from "../lib/web3/baseContract";
import InputSegment from "../component/InputSegment";
class CreateSurveyRequest extends Component {
  createNewRequest = async message => {
    const isSuccess = baseContract.createNewSurveyRequest(
      this.props.address,
      message
    );
    console.log(isSuccess);
  };
  handleSubmit = message => {
    this.createNewRequest(message);
  };
  render() {
    return (
      <Segment>
        <h3>Create New SurveyRequest</h3>
        <InputSegment
          onSubmit={this.handleSubmit}
          label="Input message"
          placeholder="message"
          action="Add"
        />
      </Segment>
    );
  }
}

export default CreateSurveyRequest;
