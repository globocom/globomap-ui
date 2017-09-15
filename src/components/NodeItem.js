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
import './css/NodeItem.css';

class NodeItem extends Component {

  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onSelfRemove = this.onSelfRemove.bind(this);
  }

  render() {
    let { _id, name, type, edges, uuid, timestamp, id } = this.props.node;
    let cNode = this.props.currentNode,
        current = cNode && _id === cNode._id ? ' current' : '',
        thisnode = cNode && uuid === cNode.uuid ? ' this-node' : '';
    let convertedDate = new Date(parseInt(timestamp, 10) * 1000);
    let formattedDate = convertedDate.toLocaleString('pt-BR');

    return <div className={'node-item' + current + thisnode} onClick={this.onItemSelect}>
            {!this.props.node.root &&
              <button className="close-node-btn" onClick={this.onSelfRemove}>
                <i className="fa fa-close"></i>
              </button>}
            <div className="node-info">
              <span className="type">{type}</span>
              <span className="name">{name}</span>
              <span className="timestamp">{formattedDate}</span>
              {this.props.hasId && <span>{id}</span>}
            </div>
            <NodeEdges edges={edges}
                       graphs={this.props.graphs}
                       position={'left'} />
           </div>;
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.node);
  }

  onSelfRemove(event) {
    event.stopPropagation();
    this.props.removeNode(this.props.node);
  }

}

export default NodeItem;
