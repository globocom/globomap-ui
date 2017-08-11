import React, { Component } from 'react';
import io from 'socket.io-client';
import Header from './Header';
import SearchContent from './SearchContent';
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
      nodes: [],
      stageNodes: []
    };

    this.findNodes = this.findNodes.bind(this);
    this.addNodeToStage = this.addNodeToStage.bind(this);
    this.stageHasNode = this.stageHasNode.bind(this);
    this.getGraphsAndCollections = this.getGraphsAndCollections.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  render() {
    return (
      <div className="main">
        <Header graphs={this.state.graphs}
                collections={this.state.collections}
                findNodes={this.findNodes} />

        <SearchContent nodes={this.state.nodes}
                       setCurrent={this.setCurrent}
                       currentNode={this.state.currentNode} />

        <Stage stageNodes={this.state.stageNodes}
               currentNode={this.state.currentNode}
               clearCurrent={this.clearCurrent}
               setCurrent={this.setCurrent} />

        <Info nodes={this.state.nodes}
              graphs={this.state.graphs}
              addNodeToStage={this.addNodeToStage}
              currentNode={this.state.currentNode} />
      </div>
    );
  }

  getGraphsAndCollections() {
    this.socket.emit('getcollections', {}, (data) => {
      this.setState({ collections: data });
    });

    this.socket.emit('getgraphs', {}, (data) => {
      let graphs = [];
      for(let i=0, l=data.length; i<l; i++) {
        graphs.push({
          name: data[i],
          colorClass: 'graph-color' + i,
          enabled: true
        });
      }
      this.setState({ graphs: graphs });
    });
  }

  addNodeToStage(node, fn) {
    if(this.stageHasNode(node._id)) {
      this.setCurrent(node._id);
      return;
    }

    this.setState((prevState) => {
      return {stageNodes: [...prevState.stageNodes, node]}
    }, fn());
  }

  stageHasNode(nodeId) {
    let currentNodes = this.state.stageNodes.map(n => n._id);
    return !(currentNodes.indexOf(nodeId) < 0);
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

    if(query === '') {
      console.log('Enter some text to search for');
      return;
    }

    this.socket.emit('findnodes', {query: query, collections: co}, (data) => {
      if(!data || data.length <= 0) {
        this.setState({ nodes: [] });
      }
      this.setState({ nodes: data });
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

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearCurrent();
    }
  };

  componentDidMount() {
    this.getGraphsAndCollections();
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

}

export default App;
