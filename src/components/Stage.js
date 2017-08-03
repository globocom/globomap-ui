import React, { Component } from 'react';
import NodeItem from './NodeItem';
import './css/Stage.css';

class Stage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let nodes = this.props.nodes;

    const allNodes = nodes.map((node) => {
      return <NodeItem key={node._id}
                       node={node}
                       setCurrent={this.props.setCurrent} />
    });

    return (
      <div className="stage">
        {allNodes}
      </div>
    );
  }

}

export default Stage;
