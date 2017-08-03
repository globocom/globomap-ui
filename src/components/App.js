import React, { Component } from 'react';
import Header from './Header';
import Stage from './Stage';
import Info from './Info';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
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

  findNodes(query, coll) {
    let colls = this.state.collections;
    let nodes = []

    if(coll !== undefined && colls.indexOf(coll) < 0) {
      return;
    }

    // search for mached nodes
    nodes = [{"_id":"compunit/napi_2","_key":"napi_2","_rev":"_VYOPfAa---","name":"compunit02"},
             {"_id":"compunit/napi_5","_key":"napi_5","_rev":"_VYmsfwq---","name":"compunit05"},
             {"_id":"compunit/napi_1","_key":"napi_1","_rev":"_VYOPIJe---","name":"compunit01"},
             {"_id":"compunit/napi_3","_key":"napi_3","_rev":"_VYmsv6m---","name":"compunit03"},
             {"_id":"compunit/napi_4","_key":"napi_4","_rev":"_VYms7Vm---","name":"compunit04"}];

    if(nodes.length > 0) {
      this.setState({ nodes: [] });
    }

    this.addMultipleNodes(nodes);
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
