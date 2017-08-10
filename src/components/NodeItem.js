import React, { Component } from 'react';
import './css/NodeItem.css';

class NodeItem extends Component {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let { name, type, current } = this.props.node;

    return (
      <div className={"node-item " + (current ? " current" : "")}
           onClick={this.onItemSelect}>

        <div className="node-info">
          <span className="type">{type}</span>
          <span className="name">{name}</span>
        </div>

        <div className="node-graphs">
          <span className="label">base</span>
        </div>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    let node = this.props.node;

    this.props.setCurrent(node._id);
  }
}

export default NodeItem;
