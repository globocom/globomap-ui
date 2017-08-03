import React, { Component } from 'react';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.state = {}

    this.getNode = this.getNode.bind(this);
  }

  render() {
    let node = this.getNode(this.props.currentNode);

    return (
        <div className="info">
          <div className="info-title">{node && node.name}</div>
        </div>
    );
  }

  getNode(nodeId) {
    let nodes = this.props.nodes.slice();
    let index = nodes.findIndex((elem, i, arr) => {
      return elem._id === nodeId;
    });

    if(index < 0) {
      return false;
    }

    return nodes[index];
  }
}

export default Info;
