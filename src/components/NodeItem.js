import React, { Component } from 'react';
import './css/NodeItem.css';

class NodeItem extends Component {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
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
        <div className="node-graphs">
          {/* <span className="label">base</span> */}
        </div>
        <div className="node-edges">
          {/* edges.map((e) => { return <span>{e]</span>}) */}
        </div>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.node._id);
  }
}

export default NodeItem;
