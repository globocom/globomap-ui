import React, { Component } from 'react';
import './css/NodeItem.css';

class NodeItem extends Component {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let { name, current } = this.props.node;

    return (
      <div className={"node-item " + (current ? " current" : "")}
           onClick={this.onItemSelect}>
        <a href={"#"+ name} className="node-name">{name}</a>
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
