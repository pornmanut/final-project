import React, { Component } from "react";
import { Label } from "semantic-ui-react";

class SurveyRequestBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: null
    };
  }
  async componentDidMount() {
    const { survey } = this.props;
    this.setState({
      survey: survey
    });
  }
  async componentDidUpdate(previousProps) {
    const { survey } = this.props;
    if (previousProps.survey !== survey) {
      this.setState({
        survey: survey
      });
    }
  }
  render() {
    const { survey } = this.state;
    if (survey === null) {
      return null;
    }
    const {
      isOpen,
      isAssignAddress,
      message,
      requestLength,
      approvedLength,
      surveyAddress
    } = survey;
    return (
      <div>
        <h4>
          <b>
            {message}
            {"  "}
          </b>
          <Label color={isOpen ? "green" : "red"}>
            {isOpen ? "Open" : "Close"}
          </Label>
        </h4>
        <p>
          Member: <b>{approvedLength}</b>/<b>{requestLength}</b>
        </p>
        <p>
          AssignAddress: <b>{isAssignAddress ? "True" : "False"}</b>
        </p>
        <p>
          SurveyAddress: <b>{surveyAddress}</b>
        </p>
      </div>
    );
  }
}
export default SurveyRequestBlock;
