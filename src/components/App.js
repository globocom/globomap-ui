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

    this.addNode = this.addNode.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
    this.findNodes = this.findNodes.bind(this);
    this.getGraphsAndCollections = this.getGraphsAndCollections.bind(this);
  }

  render() {
    return (
      <div className="main">
        <Header findNodes={this.findNodes} />

        <Stage nodes={this.state.nodes}
               setCurrent={this.setCurrent} />

        <Info currentNode={this.state.currentNode} />
      </div>
    );
  }

  componentDidMount() {
    this.getGraphsAndCollections();
  }

  getGraphsAndCollections() {
    this.setState({
      graphs: ['base'],
      collections: ['compunit', 'pool', 'vip']
    });
  }

  findNodes(query, coll) {
    let colls = this.state.collections;

    if(coll !== undefined && colls.indexOf(coll) < 0) {
      return []
    }

    this.setState({
      nodes: [{_id: "pool/napi_1",_key: "napi_1",_rev: "_VYORx9q---",name: "pool01"}],
    });
  }

  addNode(node) {
    this.state.nodes.push(node);
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
