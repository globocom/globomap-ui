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
import { cleanStageNodes, setStageNodes } from '../../redux/modules/stage';
import { setMainTab } from '../../redux/modules/tabs';
import { NodeItem } from '../';
import './Stage.css';

class Stage extends Component {

  constructor(props) {
    super(props);
    this.renderNodes = this.renderNodes.bind(this);
  }

  renderNodes(nodeList) {
    return nodeList.map((node, i) => {
      return (
        <div key={`n${i}`} className="node-item-group">
          <NodeItem node={node} />
          <div className="node-item-content">
            {node.items.length > 0 ? this.renderNodes(node.items) : ''}
          </div>
        </div>
      );
    });
  }

  hasMinimumStageNodes(sNodes) {
    let sItems = [];
    if(sNodes.length > 0) {
      sItems = sNodes[0].items;
    }
    return sItems.length > 0;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.hasMinimumStageNodes(nextProps.stageNodes)) {
      this.props.setMainTab('Search Results');
    } else {
      this.props.setMainTab('Navigation');
    }
  }

  render() {
    const open = this.hasMinimumStageNodes(this.props.stageNodes);
    return (
      <div className={`stage ${open ? 'open' : ''}`}>
        <div className="stage-container">
          {this.renderNodes(this.props.stageNodes)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stageNodes: state.stage.stageNodes,
    currentNode: state.nodes.currentNode
  };
}

export default connect(
  mapStateToProps,
  { cleanStageNodes, setStageNodes, setMainTab }
)(Stage);
