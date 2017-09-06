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
import NodeEdges from './NodeEdges';
import './css/ByGraph.css';

class ByGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };

    this.onAddNode = this.onAddNode.bind(this);
    this.onOpenGraph = this.onOpenGraph.bind(this);
  }

  render() {
    let items = this.props.items,
        isOpen = items.subnodes.length > 0
                 ? this.state.isOpen
                 : false;

    let colorCls = this.props.graphs.filter((graph) => {
      return graph.name === items.graph;
    })[0].colorClass;

    return <div key={items.graph} className={'sub-nodes-by-graph' + (isOpen ? ' open' : '')}>
             <div className={'graph-header ' + colorCls}>
               <span className="graph-name" onClick={this.onOpenGraph}>
                 <i className={isOpen ? 'icon-down fa fa-caret-down' : 'icon-right fa fa-caret-right'}></i>
                 &nbsp;{items.graph}
               </span>

               <span className="graph-amount">
                 {items.subnodes.length}
               </span>

               <span className="graph-buttons">
                 <button className="btn btn-filter"><i className="fa fa-filter"></i></button>
                 <button className="btn btn-add-all"><i className="fa fa-plus-square"></i></button>
               </span>
             </div>
             <div className="graph-items">
             {this.buildSubNodes(items)}
             </div>
           </div>;
  }

  buildSubNodes(nodesItem) {
    let subnodes = nodesItem.subnodes.map((subnode) => {
      let hasNode = this.props.stageHasNode(subnode._id, this.props.node.uuid);

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

  onOpenGraph(event) {
    event.stopPropagation();
    return this.setState({ isOpen: !this.state.isOpen });
  }

  onAddNode(event, node, makeCurrent) {
    event.stopPropagation();
    this.props.addNodeToStage(node, this.props.node.uuid || this.props.node._id, makeCurrent);
  }

}

export default ByGraph;
