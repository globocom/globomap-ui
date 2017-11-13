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
import { uiSocket } from './App';
import ByGraph from './ByGraph';
import InfoContentHead from './InfoContentHead';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();
    this.state = {
      node: this.props.getNode(this.props.currentNode),
      loading: true,
      byGraph: []
    }

    this.onCloseInfo = this.onCloseInfo.bind(this);
    this.composeEdges = this.composeEdges.bind(this);
    this.onTraversalSearch = this.onTraversalSearch.bind(this);
    this.resetByGraph = this.resetByGraph.bind(this);
  }

  render() {
    let byGraph = this.state.byGraph.map((items, index) => {
      return <ByGraph ref={(ByGraph) => {this.byGraph = ByGraph}}
                      key={index + '_' + this.state.node.id + '_' + items.nodes.length}
                      items={items}
                      graphs={this.props.graphs}
                      collectionsByGraphs={this.props.collectionsByGraphs}
                      stageHasNode={this.props.stageHasNode}
                      node={this.state.node}
                      addNodeToStage={this.props.addNodeToStage}
                      hasId={this.props.hasId} />
    });

    return (
      <div className={'info ' + (this.props.currentNode ? 'open' : '')}>
        <div className="info-header">
          <div className="info-header-title" title={this.state.node.name}>
            <span className="title-limit">{this.state.node.name}</span>
          </div>
          <button className="close-info-btn topcoat-icon-button--quiet"
            onClick={this.onCloseInfo}>
            <i className="fa fa-close"></i>
          </button>
          <InfoContentHead node={this.state.node}
                           hasId={this.props.hasId} />
        </div>
        <div className="info-graph-items">
          {this.state.loading &&
            <div className="items-loading">
              <i className="loading-cog fa fa-cog fa-spin fa-2x fa-fw"></i>
            </div>}
          {byGraph}
        </div>
      </div>
    );
  }

  resetSubNodes() {
    let byGraphCopy = this.state.byGraph.slice();

    byGraphCopy = byGraphCopy.map((nodesItem) => {
      nodesItem.subnodes = [];
      return nodesItem;
    });

    this.setState({ byGraph: byGraphCopy });
  }

  traversalSearch(node) {
    let graphs = this.props.graphs.filter(g => g.enabled).map(g => g.name),
        params = { start: (node._id || ''), graphs: graphs }

    this.socket.emit('traversalsearch', params, (data) => {
      let byGraph = [];

      if (data.error) {
        console.log(data.message);

        byGraph = params.graphs.map((graph) => {
          return {
            "graph": graph,
            "edges": [],
            "nodes": [],
            "subnodes": []
          }
        });

        return this.setState({ byGraph: byGraph, loading: false });
      }

      byGraph = data.map((gData) => {
        gData.subnodes = gData.nodes.filter(n => n._id !== node._id).map((n) => {
          n.edges = this.composeEdges(n, gData.edges)
          n.edges.graph = gData.graph;
          return n;
        });
        return gData;
      });

      this.setState({ byGraph: byGraph, loading: false });
    });
  }

  composeEdges(node, edges) {
    let nEdges = { in: [], out: [] };

    for(let i=0, l=edges.length; i<l; ++i) {
      let edge = edges[i];

      if(node._id === edge._to) {
        edge.dir = 'in';
        nEdges.in.push(edge);
      }

      if(node._id === edge._from) {
        edge.dir = 'out';
        nEdges.out.push(edge);
      }
    }

    return nEdges;
  }

  onCloseInfo(event) {
    event.stopPropagation();
    this.props.clearCurrent();
    this.resetByGraph(() => {});
  }

  resetByGraph(fn) {
    let byGraph = [];

    this.state.byGraph.forEach((graph, index) => {
      byGraph[index] = Object.assign({}, graph, { edges: [], nodes: [], subnodes: [] });
    });

    this.setState({ byGraph }, () => {
      fn();
    });
  }

  onTraversalSearch() {
    let node = this.state.node;
    if (node) {
      this.traversalSearch(node);
    }
  }

  componentWillReceiveProps(nextProps) {
    let current = this.props.currentNode,
        next = nextProps.currentNode;

    if(current._id !== next._id || current.uuid !== next.uuid) {
      this.resetSubNodes();
      let node = this.props.getNode(next);

      if(node) {
        let byGraphInitial = this.props.graphs.map((graph) => {
          return { graph: graph.name, edges: [], nodes: [], subnodes: [] };
        });

        this.setState({ node: node, loading: true, byGraph: byGraphInitial }, () => {
          this.traversalSearch(node);
        });
      }
    }
  }
}

export default Info;
