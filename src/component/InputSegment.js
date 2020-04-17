import React, { Component } from "react";
import { Form } from "semantic-ui-react";
class InputSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit() {
    this.props.onSubmit(this.state.value);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          label={this.props.label}
          placeholder={this.props.placeholder}
          name="value"
          action={this.props.action}
          onChange={this.handleChange}
        ></Form.Input>
      </Form>
    );
  }
}
export default InputSegment;
