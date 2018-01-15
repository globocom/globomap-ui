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

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { uiSocket } from '../../utils';
import { resetSubNodes, clearCurrentNode,
         traversalSearch } from '../../redux/modules/nodes';
import { Loading, InfoContentHead } from '../';
import SubNodesByGraph from './SubNodesByGraph';
import './SubNodes.css';

class SubNodes extends Component {

  constructor(props) {
    super(props);
    // this.socket = uiSocket();
    this.state = {
      // node: this.props.currentNode,
      // loading: true,
      // byGraph: []
    }

    // this.onCloseSubNodes = this.onCloseSubNodes.bind(this);

    this.onColapseSubNodes = this.onColapseSubNodes.bind(this);

    // this.composeEdges = this.composeEdges.bind(this);
    // this.onTraversalSearch = this.onTraversalSearch.bind(this);
    // this.resetByGraph = this.resetByGraph.bind(this);
  }

  // resetSubNodes() {
  //   let byGraphCopy = this.state.byGraph.slice();

  //   byGraphCopy = byGraphCopy.map((nodesItem) => {
  //     nodesItem.subnodes = [];
  //     return nodesItem;
  //   });

  //   this.setState({ byGraph: byGraphCopy });
  // }

  // traversalSearch(node) {
  //   let graphs = [];
  //   let params = {};

  //   graphs = this.props.graphs.map(g => g.name);
  //   params = { start: (node._id || ''), graphs: graphs }

  //   this.socket.emit('traversalsearch', params, (data) => {
  //     let byGraph = [];

  //     if (data.error) {
  //       console.log(data.message);

  //       byGraph = params.graphs.map((graph) => {
  //         return {
  //           "graph": graph,
  //           "edges": [],
  //           "nodes": [],
  //           "subnodes": []
  //         }
  //       });

  //       return this.setState({ byGraph: byGraph, loading: false });
  //     }

  //     byGraph = data.map((gData) => {
  //       gData.subnodes = gData.nodes.filter(n => n._id !== node._id).map((n) => {
  //         n.edges = this.composeEdges(n, gData.edges)
  //         n.edges.graph = gData.graph;
  //         return n;
  //       });
  //       return gData;
  //     });

  //     this.setState({ byGraph: byGraph, loading: false });
  //   });
  // }

  // composeEdges(node, edges) {
  //   let nEdges = { in: [], out: [] };

  //   for(let i=0, l=edges.length; i<l; ++i) {
  //     let edge = edges[i];

  //     if(node._id === edge._to) {
  //       edge.dir = 'in';
  //       nEdges.in.push(edge);
  //     }

  //     if(node._id === edge._from) {
  //       edge.dir = 'out';
  //       nEdges.out.push(edge);
  //     }
  //   }

  //   return nEdges;
  // }

  // resetByGraph(fn) {
  //   let byGraph = [];

  //   this.state.byGraph.forEach((graph, index) => {
  //     byGraph[index] = Object.assign({}, graph, { edges: [], nodes: [], subnodes: [] });
  //   });

  //   this.setState({ byGraph }, () => {
  //     fn();
  //   });
  // }

  // onTraversalSearch() {
  //   let node = this.state.node;
  //   if (node) {
  //     this.props.traversalSearch(node);
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    let current = this.props.currentNode,
        next = nextProps.currentNode;

    if (!current || !next) {
      return;
    }

    if(current._id !== next._id || current.uuid !== next.uuid) {
      // this.props.resetSubNodes();
      if(next) {
        this.props.traversalSearch({ node: next });
        // this.setState({ node: next, loading: true }, () => {
        //   this.props.traversalSearch(next);
        // });
      }
    }
  }

  onCloseSubNodes(event) {
    event.stopPropagation();
    this.props.clearCurrentNode();
    this.props.resetSubNodes();
    // this.resetByGraph(() => {});
  }

  onColapseSubNodes(event) {
    event.stopPropagation();
  }

  render() {
    const byGraph = this.props.subNodesByGraph.map((items, index) => {
      return <SubNodesByGraph key={index + '_' + items.graph + '_' + items.nodes.length}
                              // ref={(ByGraph) => {this.byGraph = ByGraph}}
                              items={items}
                              // collectionsByGraphs={this.props.collectionsByGraphs}
                              // stageHasNode={this.props.stageHasNode}
                              // node={this.state.node}
                              // addNodeToStage={this.props.addNodeToStage}
                              />
    });

    const headerTitle = this.props.currentNode ? this.props.currentNode.name : '';

    return (
      <div className="subnodes">
        <div className="subnodes-header">
          <div className="subnodes-header-title" title={headerTitle}>
            <span className="title-limit">{headerTitle}</span>
          </div>
          <button className="btn colapse-subnodes-btn" onClick={this.onColapseSubNodes}>
            <i className="fa fa-angle-right"></i>
          </button>
          <InfoContentHead
                           // hasId={this.props.hasId}
                           // node={this.state.node}
                           // showModal={this.props.showModal}
                           // closeModal={this.props.closeModal}
                           />
        </div>
        <div className="subnodes-graph-items">
          {byGraph}
        </div>
        <Loading isLoading={this.props.traversalLoading} iconSize="medium" />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    traversalLoading: state.nodes.traversalLoading,
    subNodesByGraph: state.nodes.subNodesByGraph
  };
}

export default connect(
  mapStateToProps,
  { resetSubNodes, clearCurrentNode, traversalSearch }
)(SubNodes);
