import React, { Component } from 'react';
import io from 'socket.io-client';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = io('http://localhost:8888');  // development

    this.state = {
      node: this.getNode(this.props.currentNode),
      subnodes: [],
      edges: []
    }

    this.getNode = this.getNode.bind(this);
    this.traversalSearch = this.traversalSearch.bind(this);
  }

  render() {
    let subnodes = this.state.subnodes.map((subnode) => {
      if(subnode._id === this.state.node._id) {
        return "";
      }

      return (<div key={subnode._id} className="sub-node">
                <span className="sub-node-type">{subnode.type}</span>
                <span className="sub-node-name">{subnode.name}</span>
              </div>);
    });

    return (
        <div className="info">
          <div className="info-title">
            {this.props.currentNode ? this.state.node.name : 'Info'}
          </div>
          <div className="info-content">
            {subnodes}
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
      this.setState({ subnodes: data.nodes, edges: data.edges });
    });
  }

}

export default Info;
