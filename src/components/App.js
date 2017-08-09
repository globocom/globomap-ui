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
        <Header graphs={this.state.graphs}
                collections={this.state.collections}
                findNodes={this.findNodes} />

        <Stage nodes={this.state.nodes}
               collections={this.state.collections}
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
      let graphs = [];
      for(let i=0, l=data.length; i<l; i++) {
        graphs.push({name: data[i], colorClass: 'graph-color' + i});
      }
      this.setState({ graphs: graphs });
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

  clearStage() {
    this.setState({ nodes: [] });
  }

  findNodes(query, co) {
    if(co !== undefined && !co instanceof Array)  {
      console.log('The 2nd argument must be an Array');
      return;
    }

    if(co.length === 0) {
      console.log('Select an item');
      return;
    }

    this.socket.emit('findnodes', {query: query, collections: co}, (data) => {
      if(!data || data.length <= 0) {
        this.setState({ nodes: [] });
      }

      data.map((coNodes) => {
        console.log(coNodes.map((node) => { return node._id; }));
        return coNodes;
      });
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
