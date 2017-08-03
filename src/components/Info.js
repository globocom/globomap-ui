import React, { Component } from 'react';
import './css/Info.css';

class Info extends Component {
  render() {
    return (
      <div className="info">
        <div className="info-title"></div>
        {this.props.currentNode}
      </div>
    );
  }
}

export default Info;
