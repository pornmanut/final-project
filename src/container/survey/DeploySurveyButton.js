import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import surveyContract from "../../lib/web3/surveyContract";
class DeploySurveyButton extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = async () => {
    const deployAddress = await surveyContract.deploy();

    if (this.props.getAddressFunc) {
      this.props.getAddressFunc(deployAddress);
    }
  };
  render() {
    return (
      <div>
        <Button primary onClick={this.handleClick}>
          Deploy
        </Button>
      </div>
    );
  }
}

export default DeploySurveyButton;
