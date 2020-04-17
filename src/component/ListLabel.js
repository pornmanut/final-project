import React, { Component } from "react";
import { Label, Segment } from "semantic-ui-react";
class ListLabel extends Component {
  constructor(props) {
    super(props);
  }
  createLabel = (item, key) => {
    return (
      <span key={key}>
        <Label>{item}</Label>
      </span>
    );
  };
  render() {
    const { items } = this.props;
    const listItems = items.map(this.createLabel);
    return (
      <Segment>
        {this.props.message}
        <ul style={{ listStyleType: "none", padding: 0 }}>{listItems}</ul>
      </Segment>
    );
  }
}

export default ListLabel;
