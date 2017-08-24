import React, { Component } from 'react';
import NodeEdges from './NodeEdges';
import './css/NodeItem.css';

class NodeItem extends Component {

  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let { _id, name, type, edges, uuid } = this.props.node;
    let cNode = this.props.currentNode,
        current = cNode && _id === cNode._id ? ' current' : '',
        thisnode = cNode && uuid === cNode.uuid ? ' this-node' : '';

    return (
      <div className={'node-item' + current + thisnode} onClick={this.onItemSelect}>
        <div className="node-info">
          <span className="type">{type}</span>
          <span className="name">{name}</span>
        </div>
        <NodeEdges edges={edges}
                   graphs={this.props.graphs}
                   position={'left'} />
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.node);
  }

}

export default NodeItem;
