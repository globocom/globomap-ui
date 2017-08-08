import React, { Component } from 'react';
import io from 'socket.io-client';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = io('http://localhost:8888');  // development

    this.state = {
      node: this.getNode(this.props.currentNode),
      nodeInfo: null
    }

    this.getNode = this.getNode.bind(this);
    this.traversalSearch = this.traversalSearch.bind(this);
  }

  render() {
    return (
        <div className="info">
          <div className="info-title">
            {this.props.currentNode && this.state.node.name}

          </div>
        </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.currentNode !== nextProps.currentNode) {
      let node = this.getNode(nextProps.currentNode);

      this.setState({node: node});
      this.traversalSearch(node);
    }
  }

  getNode(nodeId) {
    let nodes = this.props.nodes;
    let index = nodes.findIndex((elem, i, arr) => {
      return elem._id === nodeId;
    });

    if(index < 0) {
      return false;
    }

    return nodes[index];
  }

  traversalSearch(node) {
    let options = { start: node._id, graph: 'base', depth: 1 }

    this.socket.emit('traversalsearch', options, (data) => {
      console.log(data);

      this.setState({ nodeInfo: data });
    });
  }

}

export default Info;
