import React, { Component } from "react";
import { Segment, Header } from "semantic-ui-react";
class ShowEncryptedList extends Component {
  createTask = (item, key) => {
    return (
      <li key={key}>
        <Segment>
          <Header as="h4">
            Message Encrypt Step {key}: {miniText(item, 80)}{" "}
            {key != 0 ? item.length / 2 : null}
          </Header>
        </Segment>
      </li>
    );
  };
  render() {
    const { list } = this.props;
    const ListItem = list.map(this.createTask);

    return (
      <div>
        <Header as="h3">Message On Local</Header>
        <ul style={{ listStyleType: "none", padding: 0 }}>{ListItem}</ul>
      </div>
    );
  }
}

function miniText(message, min) {
  if (message.length > min) {
    return message.slice(0, min) + "...";
  }
  return message;
}
export default ShowEncryptedList;
