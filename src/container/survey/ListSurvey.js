import React, { Component } from "react";
import { Segment, Grid, GridColumn, Button } from "semantic-ui-react";
import SurveyInfoItem from "./SurveyInfoItem";
class ListSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: [0]
    };
  }
  onSelect = selectList => {
    if (this.props.onSelect) {
      this.props.onSelect(selectList);
    }
  };
  onDelete = key => {
    if (this.props.onDelete) {
      this.props.onDelete(key);
    }
    this.setState(state => {
      if (state.selectList.indexOf(key) != -1) {
        const selectList = state.selectList.filter(item => item !== key);
        return { selectList };
      }
    });
  };
  selectItemKey = key => {
    if (this.props.multiple) {
      this.setState(state => {
        let selectList;
        if (state.selectList.indexOf(key) != -1) {
          selectList = state.selectList.filter(item => item !== key);
        } else {
          selectList = [...state.selectList, key];
        }
        this.onSelect(selectList);
        return {
          selectList
        };
      });
    } else {
      this.setState(_ => {
        let selectList;
        selectList = [key];
        this.onSelect(selectList);
        return {
          selectList
        };
      });
    }
  };

  createTaskItem = (item, key) => {
    const { myAccount } = this.props;
    return (
      <li key={key}>
        <Segment>
          <Grid columns={3}>
            <Grid.Row>
              <GridColumn width={2}>
                <Button
                  fluid
                  primary={this.state.selectList.includes(key)}
                  onClick={() => this.selectItemKey(key)}
                >
                  Select
                </Button>
              </GridColumn>
              <GridColumn width={12}>
                <SurveyInfoItem address={item} myAccount={myAccount} />
              </GridColumn>
              <GridColumn width={2}>
                <Button fluid onClick={() => this.onDelete(key)}>
                  Delete
                </Button>
              </GridColumn>
            </Grid.Row>
          </Grid>
        </Segment>
      </li>
    );
  };
  render() {
    const { items } = this.props;
    const listItems = items.map(this.createTaskItem);
    return (
      <div>
        <pre style={{ maxHeight: 400, overflowY: "scroll" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>{listItems}</ul>
        </pre>
      </div>
    );
  }
}

export default ListSurvey;
