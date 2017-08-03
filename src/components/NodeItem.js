import React, { Component } from 'react';
import './css/NodeItem.css';

class NodeItem extends Component {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let node = this.props.node,
        { name, current } = node;

    return (
      <div className={"node-item " + (current ? " current" : "")}
           onClick={this.onItemSelect}>
        <a href={"#"+ name} className="node-name">{name}</a>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.node._id);
  }
}

export default NodeItem;
