import React from 'react';
import { connect } from 'react-redux';
import { registerTab, setTab } from '../../redux/modules/tabs';

class TabContent extends React.Component {

  componentDidMount() {
    this.props.registerTab(this.props.tabKey);
  }

  render() {
    return this.props.currentTab === this.props.tabKey
      ? this.props.children
      : null;
  }

}

function mapStateToProps(state) {
  return {
    currentTab: state.tabs.currentTab
  };
}

export default connect(
  mapStateToProps,
  { registerTab, setTab }
)(TabContent);
