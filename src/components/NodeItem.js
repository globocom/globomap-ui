import React, { Component } from 'react';
import './css/NodeItem.css';

class NodeItem extends Component {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.drawEdges = this.drawEdges.bind(this);
  }

  render() {
    let { _id, name, type, edges } = this.props.node;
    let current = _id === this.props.currentNode;

    return (
      <div className={"node-item " + (current ? " current" : "")}
           onClick={this.onItemSelect}>

        <div className="node-info">
          <span className="type">{type}</span>
          <span className="name">{name}</span>
        </div>

        {this.drawEdges(edges)}
      </div>
    );
  }

  drawEdges(edgeList=[]) {
    if(edgeList.length > 0) {
      let edge0 = edgeList[0];
      let color = this.props.graphs.filter((graph) => {
        return graph.name === edge0.graph;
      })[0].colorClass;

      return <div className={'node-edges ' + color}></div>;
    }
    return '';
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.node._id);
  }
}

export default NodeItem;
