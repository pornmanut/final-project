import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Grid,
  GridRow,
  GridColumn
} from "semantic-ui-react";
class InputButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.value);
    }
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    const { label, placeholder, buttonName } = this.props;
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={12}>
            <Input
              fluid
              label={label}
              placeholder={placeholder}
              name="value"
              onChange={this.handleChange}
            ></Input>
          </Grid.Column>
          <GridColumn width={4}>
            <Button
              fluid
              disabled={!this.state.value}
              onClick={this.handleSubmit}
              primary
            >
              {buttonName}
            </Button>
          </GridColumn>
        </Grid.Row>
      </Grid>
    );
  }
}
export default InputButton;
