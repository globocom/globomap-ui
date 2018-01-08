/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cleanStageNodes } from '../../redux/modules/stage';
import { NodeItem } from '../';
import './Stage.css';

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
           </div>;
  }

  renderNodes(nodeList) {
    return nodeList.map((node, i) => {
      return <div key={'n' + i} className="node-item-group">
               <NodeItem node={node}
                         stageNodes={this.props.stageNodes}
                         setStageNodes={this.props.setStageNodes}
                         currentNode={this.props.currentNode}
                         removeNode={this.props.removeNode}
                         setCurrent={this.props.setCurrent}
                         hasId={this.props.hasId} />
               <div className="node-item-content">
                 {node.items.length > 0 ? this.renderNodes(node.items) : ''}
               </div>
             </div>;
    });
  }

}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode
  };
}

export default connect(mapStateToProps, { cleanStageNodes })(Stage);
