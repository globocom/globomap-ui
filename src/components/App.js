import React, { Component } from 'react';
import io from 'socket.io-client';
import Header from './Header';
import Stage from './Stage';
import Info from './Info';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = io();

    this.state = {
      currentNode: null,
      graphs: [],
      collections: [],
      nodes: []
    };

    this.addSingleNode = this.addSingleNode.bind(this);
    this.addMultipleNodes = this.addMultipleNodes.bind(this);
    this.findNodes = this.findNodes.bind(this);
    this.getGraphsAndCollections = this.getGraphsAndCollections.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
  }

  render() {
    return (
      <div className="main">
        <Header findNodes={this.findNodes} />

        <Stage nodes={this.state.nodes}
               setCurrent={this.setCurrent} />

        <Info nodes={this.state.nodes}
              currentNode={this.state.currentNode} />
      </div>
    );
  }

  componentDidMount() {
    this.getGraphsAndCollections();
  }

  getGraphsAndCollections() {
    // endpoints: /v1/graphs, /v1/collections

    this.setState({
      graphs: ['base'],
      collections: ['compunit', 'pool', 'vip']
    });
  }

  findNodes(query, co) {
    let collections = this.state.collections;

    if(co !== undefined && collections.indexOf(co) < 0) {
      return;
    }

    this.socket.emit('findnodes', {query: query, co: collections }, (data) => {
      if(!data || data.length <= 0) {
        this.setState({ nodes: [] });
        return;
      }

      this.addMultipleNodes(data);
    });
  }

  addSingleNode(node) {
    this.setState(previousState => ({
        nodes: [...previousState.nodes, node]
    }));
  }

  addMultipleNodes(nodeList) {
    this.setState(previousState => ({
        nodes: [...previousState.nodes, ...nodeList]
    }));
  }

  setCurrent(nodeId) {
    let currentNodes = this.state.nodes.slice();
    currentNodes.map((node) => {
      if(node._id !== nodeId) {
        node.current = false;
      } else {
        node.current = true;
      }
      return node;
    });
    this.setState({
      currentNode: nodeId,
      nodes: currentNodes
    });
  }

  clearCurrent() {
    let currentNodes = this.state.nodes.slice();
    currentNodes.map((node) => {
      node.current = false;
      return node;
    });
    this.setState({
      currentNode: null,
      nodes: currentNodes
    });
  }

}

export default App;
