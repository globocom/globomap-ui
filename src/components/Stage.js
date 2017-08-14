import React, { Component } from 'react';
import NodeItem from './NodeItem';
import { traverseItems, getAllIds, uuid } from '../utils';
import './css/Stage.css';

class Stage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let groups = [[]];
    traverseItems(this.props.stageNodes, (node, level) => {
      if(groups[level] === undefined) {
        groups.push([node]);
      } else {
        groups[level].push(node);
      }
    });

    let allGroups = groups.map((group, i) => {
      return (
        <div key={i} className="stage-node-group">
          {group.map((n) => {
            return <NodeItem key={uuid()}
                       node={n}
                       currentNode={this.props.currentNode}
                       setCurrent={this.props.setCurrent} />
          })}
        </div>
      );
    });

    return (
      <div className={"stage" + (this.props.stageNodes.length > 0 ? " open" : "")}>
        {allGroups}
      </div>
    );
  }

}

export default Stage;
