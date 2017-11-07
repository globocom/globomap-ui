/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* global _ */

import React, { Component } from 'react';
import io from 'socket.io-client';
import Header from './Header';
import Tools from './Tools';
import SearchContent from './SearchContent';
import Stage from './Stage';
import Info from './Info';
import PopMenu from './PopMenu';
import { traverseItems, uuid, sortByName } from '../utils';
import './css/App.css';

function uiSocket() {
  var uiSocket = io();
  uiSocket.on('error', function(err){
    window.location.reload();
  });
  return uiSocket;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();

    this.state = {
      currentNode: false,
      graphs: [],
      enabledCollections: [],
      collectionsByGraphs: {},
      collections: [],
      nodes: [],
      stageNodes: [],
      hasId: false
    };

    this.findNodes = this.findNodes.bind(this);
    this.getNode = this.getNode.bind(this);
    this.addNodeToStage = this.addNodeToStage.bind(this);
    this.stageHasNode = this.stageHasNode.bind(this);
    this.getGraphsAndCollections = this.getGraphsAndCollections.bind(this);
    this.getCollectionByGraphs = this.getCollectionByGraphs.bind(this);
    this.setStageNodes = this.setStageNodes.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearStage = this.clearStage.bind(this);
    this.onToggleGraph = this.onToggleGraph.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.clearInfo = this.clearInfo.bind(this);
  }

  render() {
    return (
      <div className="main">
        <span className="main-xxxx"
              onDoubleClick={this.handleDoubleClick}>&nbsp;</span>
        <Header ref={(header) => {this.header = header}}
                graphs={this.state.graphs}
                enabledCollections={this.state.enabledCollections}
                clearStage={this.clearStage}
                clearCurrent={this.clearCurrent}
                collections={this.state.collections}
                findNodes={this.findNodes}
                onToggleGraph={this.onToggleGraph}
                clearInfo={this.clearInfo}
                searchContent={this.searchContent} />

        <Tools currentNode={this.state.currentNode}
               stageNodes={this.state.stageNodes}
               setStageNodes={this.setStageNodes}
               popMenu={this.popMenu} />

        <SearchContent ref={(searchContent) => {this.searchContent = searchContent}}
                       nodes={this.state.nodes}
                       findNodes={this.findNodes}
                       addNodeToStage={this.addNodeToStage}
                       currentNode={this.state.currentNode}
                       enabledCollections={this.state.enabledCollections}
                       header={this.header} />

        <Stage graphs={this.state.graphs}
               stageNodes={this.state.stageNodes}
               currentNode={this.state.currentNode}
               clearCurrent={this.clearCurrent}
               removeNode={this.removeNode}
               setCurrent={this.setCurrent}
               hasId={this.state.hasId} />

        <Info ref={(Info) => {this.info = Info}}
              getNode={this.getNode}
              stageNodes={this.state.stageNodes}
              graphs={this.state.graphs}
              collectionsByGraphs={this.state.collectionsByGraphs}
              stageHasNode={this.stageHasNode}
              addNodeToStage={this.addNodeToStage}
              clearCurrent={this.clearCurrent}
              currentNode={this.state.currentNode}
              hasId={this.state.hasId} />

        <PopMenu ref={(popMenu) => {this.popMenu = popMenu}}
                 currentNode={this.state.currentNode} />
      </div>
    );
  }

  getEdgeLinks(graph) {
    let collections = [];

    graph.links.forEach((edge) => {
      edge.from_collections.forEach((key) => {
        collections.push(key);
      })
      edge.to_collections.forEach((key) => {
        collections.push(key);
      })
    });

    return collections;
  }

  getGraphsAndCollections() {
    this.socket.emit('getcollections', {}, (data) => {
      this.setState({ collections: data });
    });

    this.socket.emit('getgraphs', {}, (items) => {
      let graphs = [];
      let enabledCollections = [];
      let collectionsByGraphs = {};
      let collections = [];
      items = sortByName(items);

      items.forEach((item, index) => {
        collections = this.getEdgeLinks(item);

        graphs.push({
          name: item.name,
          colorClass: 'graph-color' + index,
          enabled: true
        });

        enabledCollections = enabledCollections.concat(collections);
        collectionsByGraphs[item.name] = _.uniq(collections);
      });

      this.setState({
        graphs: graphs,
        enabledCollections: _.uniq(enabledCollections),
        collectionsByGraphs: collectionsByGraphs
      });
    });
  }

  getCollectionByGraphs(graphsCopy, fn) {
    let enabledCollections = [];

    this.socket.emit('getgraphs', {}, (items) => {
      items = sortByName(items);

      items.forEach((item, index) => {
        if (!graphsCopy[index].enabled) {
          return;
        }
        enabledCollections = enabledCollections.concat(
          this.getEdgeLinks(item));
      });

      fn(_.uniq(enabledCollections));
    });
  }

  addNodeToStage(node, parentUuid, makeCurrent=false) {
    if(this.stageHasNode(node._id, parentUuid)) {
      let n = this.getNode(node, parentUuid);
      this.setCurrent(n);
      return;
    }

    node.uuid = uuid();
    node.items = node.items || [];
    let currentNodes = this.state.stageNodes.slice();

    if(parentUuid) {
      traverseItems(currentNodes, (n) => {
        if(n.uuid === parentUuid) {
          n.items.push(node);
        }
      });
    } else {
      node.root = true;
      currentNodes = [node];
    }

    return this.setState({ stageNodes: currentNodes }, () => {
      if(makeCurrent) {
        this.setCurrent(node);
      }
    });
  }

  stageHasNode(nodeId, parentUuid) {
    let stageNodes = this.state.stageNodes,
        ids = stageNodes.map(n => n._id);

    if(parentUuid !== undefined) {
      traverseItems(stageNodes, (n) => {
        if(n.uuid === parentUuid) {
          ids = n.items.map(n => n._id);
        }
      });
    }

    return !(ids.indexOf(nodeId) < 0);
  }

  getNode(node, parentUuid) {
    let stageNodes = this.state.stageNodes.slice(),
        nodeFound = false;

    traverseItems(stageNodes, (n) => {
      if(n.uuid === node.uuid) {
        nodeFound = n;
      }
    });

    if(!nodeFound && parentUuid !== undefined) {
      traverseItems(stageNodes, (n) => {
        if(n.uuid === parentUuid) {
          for(let i in n.items) {
            if(node._id === n.items[i]._id) {
              nodeFound = n.items[i];
            }
          }
        }
      });
    }

    return nodeFound;
  }

  removeNode(node) {
    let stageNodes = this.state.stageNodes.slice();
    let i = stageNodes.findIndex((n) => {
        return n.uuid === node.uuid;
    });

    if (i >= 0) {
      stageNodes.splice(i, 1);
    } else {
      traverseItems(stageNodes, (n) => {
        let j = n.items.findIndex((n) => {
          return n.uuid === node.uuid;
        });
        if (j >= 0) {
          n.items.splice(j, 1);
        }
      });
    }

    this.setState({ stageNodes: stageNodes }, () => {
      this.clearCurrent();
    });
  }

  clearStage() {
    return this.setState({ stageNodes: [] }, () => {
      this.clearCurrent();
    });
  }

  clearInfo(fn) {
    this.info.resetByGraph(fn);
  }

  findNodes(query, co, per_page, page, fn) {
    if (co !== undefined && !co instanceof Array)  {
      console.log('The 2nd argument must be an Array');
      return;
    }

    this.socket.emit('findnodes', { query: query, collections: co, per_page: per_page, page: page }, (data) => {
      if (fn === undefined) {
        fn = () => {};
      }

      this.setState({ nodes: data.documents}, fn(data));
    });
  }

  setStageNodes(stageNodes, fn) {
    this.setState({ stageNodes }, fn);
  }

  setCurrent(node, fn) {
    this.setState({ currentNode: { _id: node._id, uuid: node.uuid } }, fn);
  }

  clearCurrent(fn) {
    this.setState({ currentNode: false }, fn);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearCurrent();
    }
  };

  onToggleGraph(event, graphName) {
    event.stopPropagation();
    let graphsCopy = this.state.graphs.map((graph) => {
      if(graph.name === graphName) {
        graph.enabled = !graph.enabled;
      }
      return graph;
    });

    this.getCollectionByGraphs(graphsCopy, (enabledCollections) => {
      this.setState({
        graphs: graphsCopy,
        enabledCollections: enabledCollections
      }, () => {
        this.info.onTraversalSearch();
      });
    });
  }

  handleDoubleClick() {
    this.setState({
      hasId: !this.state.hasId
    });
  }

  componentDidMount() {
    this.getGraphsAndCollections();
    document.addEventListener('keydown', _.throttle(this.handleKeyDown, 100))
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    this.socket.disconnect();
  }

}

export { App as default, uiSocket };
