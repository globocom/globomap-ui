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
import InfoContentHead from './InfoContentHead';
import NodeEdges from './NodeEdges';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();

    this.state = {
      node: this.props.getNode(this.props.currentNode),
      byGraph: []
    }

    this.onAddNode = this.onAddNode.bind(this);
    this.onCloseInfo = this.onCloseInfo.bind(this);
    this.composeEdges = this.composeEdges.bind(this);
  }

  render() {
    let byGraph = this.state.byGraph.map((nodesItem) => {

      let colorCls = this.props.graphs.filter((graph) => {
        return graph.name === nodesItem.graph;
      })[0].colorClass;

      return <div key={nodesItem.graph} className="sub-nodes-by-graph">
               <div className={'graph-name ' + colorCls}>
                 {nodesItem.graph}
                 <span className="qtd-nodes">
                   {nodesItem.subnodes.length}
                 </span>
               </div>
               {this.buildSubNodes(nodesItem)}
             </div>;
    });

    return <div className={'info ' + (this.props.currentNode ? 'open' : '')}>
             <div className="info-title">
               {this.state.node.name}
               <button className="close-info-btn topcoat-button--quiet"
                 onClick={this.onCloseInfo}>
                 <i className="fa fa-close"></i>
               </button>
             </div>

             <div className="info-content">
               <InfoContentHead node={this.state.node} />
               <div className="info-graph-items">
                 {byGraph}
               </div>
             </div>
          </div>
  }

  buildSubNodes(nodesItem) {
    let subnodes = nodesItem.subnodes.map((subnode) => {
      let hasNode = this.props.stageHasNode(subnode._id, this.state.node.uuid);

      return <div key={subnode._id} className={'sub-node' + (hasNode ? ' disabled': '')}>
               <div className="sub-node-btn">
                 <button className="btn-add-node topcoat-button"
                   onClick={(e) => this.onAddNode(e, subnode)} disabled={hasNode}>+</button>
               </div>

               <div className="sub-node-info" onClick={(e) => this.onAddNode(e, subnode, true)}>
                 <span className="sub-node-type">{subnode.type}</span>
                 <span className="sub-node-name" title={subnode.name}>{subnode.name}</span>
               </div>

               <NodeEdges edges={subnode.edges}
                          graphs={this.props.graphs}
                          position={'right'} />
             </div>;
    });

    return subnodes;
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
        params = { start: node._id, graphs: graphs }

    this.socket.emit('traversalsearch', params, (data) => {
      if(data.errors !== undefined) {
        console.log(data.errors);
        return;
      }

      let byGraph = data.map((gData) => {
        gData.subnodes = gData.nodes.filter(n => n._id !== node._id).map((n) => {
          n.edges = this.composeEdges(n, gData.edges)
          n.edges.graph = gData.graph;
          return n;
        });
        return gData;
      });

      this.setState({ byGraph: byGraph });
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
  }

  onAddNode(event, node, makeCurrent) {
    event.stopPropagation();
    this.props.addNodeToStage(node, this.state.node.uuid || this.state.node._id, makeCurrent);
  }

  componentWillReceiveProps(nextProps) {
    let current = this.props.currentNode,
        next = nextProps.currentNode;

    if(current._id !== next._id || current.uuid !== next.uuid) {
      this.resetSubNodes();
      let node = this.props.getNode(next);

      if(node) {
        this.setState({ node: node });
        this.traversalSearch(node);
      }
    }
  }

}

export default Info;
