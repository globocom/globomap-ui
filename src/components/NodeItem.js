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

/* global Stickyfill */

import React, { Component } from 'react';
import NodeEdges from './NodeEdges';
import './css/NodeItem.css';

class NodeItem extends Component {

  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onSelfRemove = this.onSelfRemove.bind(this);
  }

  componentDidMount() {
    let element = document.getElementsByClassName('sticky');
    Stickyfill.add(element);
  }

  render() {
    let { _id, name, type, edges, uuid, id } = this.props.node;
    let cNode = this.props.currentNode,
        current = cNode && _id === cNode._id ? ' current' : '',
        thisnode = cNode && uuid === cNode.uuid ? ' this-node' : '',
        exist = this.props.node.exist === undefined ? true : this.props.node.exist,
        disabled = this.props.node.exist !== undefined && !this.props.node.exist ? ' disabled' : '';

    return <div key={this.props.node.id} className={'node-item' + disabled + current + thisnode} onClick={exist && this.onItemSelect}>
            {!this.props.node.root &&
              <button className="close-node-btn" onClick={this.onSelfRemove}>
                <i className="fa fa-close"></i>
              </button>}
            <div className="node-info sticky">
              <span className="type">{type}</span>
              <span className="name">{name}</span>
              {this.props.hasId && <span>{id}</span>}
            </div>
            <NodeEdges edges={edges}
                       graphs={this.props.graphs}
                       position={'left'}
                       hasId={this.props.hasId} />
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
