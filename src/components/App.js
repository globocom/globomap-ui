import React, { Component } from 'react';
import io from 'socket.io-client';
import Header from './Header';
import Stage from './Stage';
import Info from './Info';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = io('http://localhost:8888');  // development

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
    this.socket.emit('getcollections', {}, (data) => {
      this.setState({ collections: data });
    });

    this.socket.emit('getgraphs', {}, (data) => {
      this.setState({ graphs: data });
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

  findNodes(query, co) {
    if(co !== undefined && !co instanceof Array)  {
      console.log('The 2nd argument must be an Array');
      return;
    }

    if(co.length === 0) {
      co = this.state.collections;
    }

    this.socket.emit('findnodes', {query: query, collections: co}, (data) => {
      if(!data || data.length <= 0) {
        this.setState({ nodes: [] });
        return;
      }
    });

    this.socket.on('nodefound', (data) => {
      let {collection, nodes} = data;
      this.addMultipleNodes(nodes);
    });
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
