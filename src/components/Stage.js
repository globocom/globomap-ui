import React, { Component } from 'react';
import NodeItem from './NodeItem';
import './css/Stage.css';

class Stage extends Component {

  constructor(props) {
    super(props);
    this.renderNodes = this.renderNodes.bind(this);
  }

  render() {
    let sNodes = this.props.stageNodes,
        sItems = [];

    if(sNodes.length > 0) {
      sItems = sNodes[0].items;
    }

    let open = sItems.length > 0 ? ' open' : '',
        withInfo = this.props.currentNode ? ' with-info' : '';

    return <div className={"stage" + open + withInfo}>
             <div className="stage-container">
               {this.renderNodes(this.props.stageNodes)}
             </div>
           </div>
  }

  renderNodes(nodeList) {
    return nodeList.map((node, i) => {
      return <div key={'n' + i} className="node-item-group">
               <NodeItem node={node}
                         graphs={this.props.graphs}
                         currentNode={this.props.currentNode}
                         setCurrent={this.props.setCurrent} />
               <div className="node-item-content">
                 {node.items.length > 0 ? this.renderNodes(node.items) : ''}
               </div>
             </div>
    });
  }

}

export default Stage;
