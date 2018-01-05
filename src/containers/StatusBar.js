import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchGraphs } from '../redux/actions';

class StatusBar extends Component {
  componentDidMount() {
    // this.props.fetchGraphs();
  }

  render() {
    return (<div className="status-bar"></div>);
  }
}

function mapStateToProps({ graphs }) {
  return { graphs };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchGraphs }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
