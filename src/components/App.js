import React, { Component } from 'react';
import io from 'socket.io-client';
import Header from './Header';
import SearchContent from './SearchContent';
import Stage from './Stage';
import Info from './Info';
import { traverseItems, uuid } from '../utils';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = io();

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
    this.clearStage = this.clearStage.bind(this);
  }

  render() {
    return (
      <div className="main">
        <Header graphs={this.state.graphs}
                clearStage={this.clearStage}
                collections={this.state.collections}
                findNodes={this.findNodes} />

        <SearchContent nodes={this.state.nodes}
                      setCurrent={this.setCurrent}
                      addNodeToStage={this.addNodeToStage}
                      currentNode={this.state.currentNode} />

        <Stage graphs={this.state.graphs}
              stageNodes={this.state.stageNodes}
               currentNode={this.state.currentNode}
               clearCurrent={this.clearCurrent}
               setCurrent={this.setCurrent} />

        <Info nodes={this.state.nodes}
              stageNodes={this.state.stageNodes}
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

  addNodeToStage(node, parentId) {
    if(this.stageHasNode(node._id, parentId)) {
      this.setCurrent(node._id);
      return;
    }

    node.items = node.items || [];
    let currentNodes = this.state.stageNodes.slice();

    if(parentId !== undefined) {
      traverseItems(currentNodes, (n, lvl) => {
        if(n._id === parentId) {
          node.level = lvl;
          n.items.push(node);
        }
      });
    } else {
      node.root = true;
      currentNodes.push(node);
    }

    return this.setState({ stageNodes: currentNodes });
  }

  stageHasNode(nodeId, parentId) {
    let stageNodes = this.state.stageNodes,
        ids = [];

    if(parentId !== undefined) {
      traverseItems(stageNodes, (n) => {
        if(n._id === parentId) {
          ids = n.items.map(n => n._id);
        }
      });
    }

    return !(ids.indexOf(nodeId) < 0);
  }

  clearStage() {
    return this.setState({ stageNodes: [] });
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
    this.setState({ currentNode: nodeId });
  }

  clearCurrent() {
    this.setState({ currentNode: null });
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
