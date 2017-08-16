import React, { Component } from 'react';
import './css/NodeItem.css';

class NodeItem extends Component {

  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.drawEdges = this.drawEdges.bind(this);
  }

  render() {
    let { _id, name, type, edges, uuid } = this.props.node;
    let cNode = this.props.currentNode,
        current = cNode && _id === cNode._id ? ' current' : '',
        thisnode = cNode && uuid === cNode.uuid ? ' thisnode' : '';

    return (
      <div className={'node-item' + current + thisnode} onClick={this.onItemSelect}>
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

      let arrow = <i className="fa fa-arrow-right"></i>;
      if(edge0.dir === 'out') {
        arrow = <i className="fa fa-arrow-left"></i>;
      }

      return (<div className={'node-edges ' + edge0.dir + ' ' + color}>
              {arrow}
             </div>);
    }
    return '';
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.node);
  }

}

export default NodeItem;
