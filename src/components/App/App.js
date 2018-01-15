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

import _ from "lodash";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGraphs, fetchCollections,
         toggleHasId } from '../../redux/modules/app';
import { clearCurrentNode } from '../../redux/modules/nodes';
import { Header, Modal, PopMenu, SearchContent,
         Stage, SubNodes, Tools } from '../';
import { traverseItems, sortByName, uiSocket } from '../../utils';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();

    this.state = {
      // currentNode: false,
      enabledCollections: [],
      selectedCollections: [],
      collectionsByGraphs: {},
      // nodes: [],
      // stageNodes: [],
      hasId: false,
      currentTab: 'Search Results'
    };

    // this.findNodes = this.findNodes.bind(this);
    // this.getNode = this.getNode.bind(this);
    // this.addNodeToStage = this.addNodeToStage.bind(this);
    // this.stageHasNode = this.stageHasNode.bind(this);
    // this.setStageNodes = this.setStageNodes.bind(this);
    // this.getGraphsAndCollections = this.getGraphsAndCollections.bind(this);
    this.getCollectionByGraphs = this.getCollectionByGraphs.bind(this);
    // this.setCurrent = this.setCurrent.bind(this);
    // this.clearCurrent = this.clearCurrent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    // this.clearStage = this.clearStage.bind(this);
    // this.onToggleGraph = this.onToggleGraph.bind(this);
    // this.removeNode = this.removeNode.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    // this.clearInfo = this.clearInfo.bind(this);
    this.setCurrentTab = this.setCurrentTab.bind(this);
    this.resetGraphsCollections = this.resetGraphsCollections.bind(this);
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

  // getGraphsAndCollections() {
  //   this.socket.emit('getcollections', {}, (data) => {
  //     this.setState({ collections: data });
  //   });

  //   this.socket.emit('getgraphs', {}, (items) => {
  //     let graphs = [];
  //     let enabledCollections = [];
  //     let collectionsByGraphs = {};
  //     items = sortByName(items);

  //     items.forEach((item, index) => {
  //       let collections = this.getEdgeLinks(item);

  //       graphs.push({
  //         name: item.name,
  //         colorClass: 'graph-color' + index,
  //         enabled: false
  //       });

  //       enabledCollections = enabledCollections.concat(collections);
  //       collectionsByGraphs[item.name] = _.uniq(collections);
  //     });

  //     this.setState({
  //       graphs: graphs,
  //       enabledCollections: _.uniq(enabledCollections),
  //       collectionsByGraphs: collectionsByGraphs
  //     });
  //   });
  // }

  getCollectionByGraphs(graphsCopy, fn) {
    let selectedCollections = [];

    this.socket.emit('getgraphs', {}, (items) => {
      items = sortByName(items);
      items.forEach((item, index) => {
        if (graphsCopy[index].enabled) {
          selectedCollections = selectedCollections.concat(this.getEdgeLinks(item));
        }
      });

      fn(_.uniq(selectedCollections));
    });
  }

  // addNodeToStage(node, parentUuid, makeCurrent=false) {
  //   if(this.stageHasNode(node._id, parentUuid)) {
  //     let n = this.getNode(node, parentUuid);
  //     this.setCurrent(n);
  //     return;
  //   }

  //   node.uuid = uuid();
  //   node.items = node.items || [];
  //   let currentNodes = this.state.stageNodes.slice();

  //   if(parentUuid) {
  //     traverseItems(currentNodes, (n) => {
  //       if(n.uuid === parentUuid) {
  //         n.items.push(node);
  //       }
  //     });
  //   } else {
  //     node.root = true;
  //     node.items = [];
  //     currentNodes = [node];

  //     return this.setState({ stageNodes: currentNodes }, () => {
  //       if(makeCurrent) {
  //         this.setCurrent(node);
  //       }
  //     });
  //   }

  //   return this.setState({ currentTab: 'Navigation',
  //                          stageNodes: currentNodes }, () => {
  //     if(makeCurrent) {
  //       this.setCurrent(node);
  //     }
  //   });
  // }

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

  // getNode(node, parentUuid) {
  //   let stageNodes = this.state.stageNodes.slice(),
  //       nodeFound = false;

  //   traverseItems(stageNodes, (n) => {
  //     if(n.uuid === node.uuid) {
  //       nodeFound = n;
  //     }
  //   });

  //   if(!nodeFound && parentUuid !== undefined) {
  //     traverseItems(stageNodes, (n) => {
  //       if(n.uuid === parentUuid) {
  //         for(let i in n.items) {
  //           if(node._id === n.items[i]._id) {
  //             nodeFound = n.items[i];
  //           }
  //         }
  //       }
  //     });
  //   }

  //   return nodeFound;
  // }

  // removeNode(node) {
  //   let stageNodes = this.state.stageNodes.slice();
  //   let i = stageNodes.findIndex((n) => {
  //       return n.uuid === node.uuid;
  //   });

  //   if (i >= 0) {
  //     stageNodes.splice(i, 1);
  //   } else {
  //     traverseItems(stageNodes, (n) => {
  //       let j = n.items.findIndex((n) => {
  //         return n.uuid === node.uuid;
  //       });
  //       if (j >= 0) {
  //         n.items.splice(j, 1);
  //       }
  //     });
  //   }

  //   if (stageNodes.length > 0 && stageNodes[0].items !== undefined) {
  //     if (stageNodes[0].items.length === 0) {
  //       this.setCurrentTab('Search Results');
  //     }
  //   }

  //   this.setState({ stageNodes: stageNodes }, () => {
  //     this.clearCurrent();
  //   });
  // }

  // clearStage() {
  //   return this.setState({ stageNodes: [] }, () => {
  //     this.clearCurrent();
  //   });
  // }

  // clearInfo(fn) {
  //   this.subnodes.resetByGraph(fn);
  // }

  // findNodes(opts, fn) {
  //   let options = _.merge({
  //     query: '',
  //     queryProps: [],
  //     collections: [],
  //     per_page: null,
  //     page: 1
  //   }, opts);

  //   if (typeof fn !== 'function') {
  //     fn = () => {};
  //   }

  //   this.socket.emit('findnodes', options, (data) => {
  //     this.setCurrentTab('Search Results');
  //     this.setState({ nodes: data.documents }, fn(data));
  //   });
  // }

  // setStageNodes(stageNodes, fn) {
  //   this.setCurrentTab('Navigation');
  //   this.setState({ stageNodes }, fn);
  // }

  // setCurrent(node, fn) {
  //   let currentNode = { _id: node._id, uuid: node.uuid };
  //   this.setState({ currentNode }, fn);
  // }

  // clearCurrent(fn) {
  //   this.setState({ currentNode: false }, fn);
  // }

  setCurrentTab(tabName) {
    this.setState({ currentTab: tabName });
  }

  resetGraphsCollections() {
    let graphsCopy = this.state.graphs.map((graph) => {
      graph.enabled = false;
      return graph;
    });

    this.getCollectionByGraphs(graphsCopy, (selectedCollections) => {
      this.setState({
        graphs: graphsCopy,
        selectedCollections: selectedCollections
      });
    });
  }

  // onToggleGraph(graphName, fn) {
  //   let graphsCopy = this.state.graphs.map((graph) => {
  //     if(graph.name === graphName) {
  //       graph.enabled = !graph.enabled;
  //     }
  //     return graph;
  //   });

  //   this.getCollectionByGraphs(graphsCopy, (selectedCollections) => {
  //     this.setState({
  //       graphs: graphsCopy,
  //       selectedCollections: selectedCollections
  //     }, () => {
  //       fn();
  //     });
  //   });
  // }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.clearCurrentNode();
    }
  };

  handleDoubleClick() {
    this.props.toggleHasId();
    // this.setState({
    //   hasId: !this.state.hasId
    // });
  }

  componentDidMount() {
    // this.getGraphsAndCollections();

    this.props.fetchGraphs();
    this.props.fetchCollections();
    document.addEventListener('keydown', _.throttle(this.handleKeyDown, 100));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.socket.disconnect();
  }

render() {
    return (
      <div className="main">
        <span className="has-id"
              onDoubleClick={this.handleDoubleClick}>&nbsp;</span>

        <Header ref={(header) => {this.header = header}}
                collectionsByGraphs={this.state.collectionsByGraphs}
                // findNodes={this.findNodes}
                // onToggleGraph={this.onToggleGraph}
                // clearInfo={this.clearInfo}
                // searchContent={this.searchContent}
                // clearStage={this.clearStage}
                selectedCollections={this.state.selectedCollections} />

        <Tools popMenu={this.popMenu}
               // currentNode={this.state.currentNode}
               // stageNodes={this.state.stageNodes}
               // setStageNodes={this.setStageNodes}
               currentTab={this.state.currentTab}
               setCurrentTab={this.setCurrentTab}
               resetGraphsCollections={this.resetGraphsCollections}
               info={this.subnodes} />

        <div className="tabs-container">
          <div className={'tab-content' + (this.state.currentTab === 'Search Results' ? ' active' : '')}>
            <SearchContent
                           // ref={(searchContent) => {this.searchContent = searchContent}}
                           // nodes={this.state.nodes}
                           // findNodes={this.findNodes}
                           // addNodeToStage={this.addNodeToStage}
                           // currentNode={this.state.currentNode}
                           // enabledCollections={this.state.enabledCollections}
                           // header={this.header}
                           />
          </div>
          <div className={'tab-content' + (this.state.currentTab === 'Navigation' ? ' active' : '')}>
            <Stage
                   // hasId={this.state.hasId}
                   // stageNodes={this.state.stageNodes}
                   // setStageNodes={this.setStageNodes}
                   // setCurrent={this.setCurrent}
                   // currentNode={this.state.currentNode}
                   // removeNode={this.removeNode}
                   />
          </div>
        </div>

        <SubNodes ref={(SubNodes) => {this.subnodes = SubNodes}}
              // getNode={this.getNode}
              // graphs={this.state.graphs}
              // collectionsByGraphs={this.state.collectionsByGraphs}
              // stageHasNode={this.stageHasNode}
              // addNodeToStage={this.addNodeToStage}
              // clearCurrent={this.clearCurrent}
              // currentNode={this.state.currentNode}
              // hasId={this.state.hasId}
              // showModal={this.showModal}
              // closeModal={this.closeModal}
              />

        <PopMenu ref={(popMenu) => {this.popMenu = popMenu}}
                 currentNode={this.state.currentNode} />

        <Modal />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { graphs, collections, hasId } = state.app;
  return { graphs, collections, hasId };
}

let app = connect(
  mapStateToProps,
  { fetchGraphs, fetchCollections, clearCurrentNode,
    toggleHasId }
)(App);

export { app as default, uiSocket };
