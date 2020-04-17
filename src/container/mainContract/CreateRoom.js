import React, { Component } from "react";
import { Segment, Grid, GridColumn, Button, Header } from "semantic-ui-react";
import baseContract from "../../lib/web3/mainContract";
import InputButton from "../../component/InputButton";

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: null
    };
  }
  async componentDidMount() {
    const { currentContract, myAccount } = this.props;
    this.loadCreator(currentContract, myAccount);
  }
  async componentDidUpdate(prevState) {
    const { currentContract, myAccount } = this.props;
    if (prevState.currentContract !== currentContract) {
      this.loadCreator(currentContract, myAccount);
    }
  }
  loadCreator = async (currentContract, myAccount) => {
    const creator = await baseContract.getCreator(currentContract);
    const isCreator = creator === myAccount;

    this.setState({
      creator,
      isCreator
    });
  };
  handleCreate = async message => {
    const { currentContract } = this.props;
    const a = await baseContract.createRoom(currentContract, message);
  };
  render() {
    const { creator, isCreator } = this.state;
    const { currentContract } = this.props;
    if (!isCreator) {
      return null;
    }
    return (
      <Segment>
        <Header>Create Room on {currentContract}</Header>
        <InputButton
          buttonName="Create"
          placeholder="Room Message"
          onSubmit={this.handleCreate}
        />
      </Segment>
    );
  }
}

export default CreateRoom;
