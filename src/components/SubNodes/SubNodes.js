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
import { resetSubNodes, clearCurrentNode,
         traversalSearch } from '../../redux/modules/nodes';
import { Loading, InfoContentHead } from '../';
import SubNodesByGraph from './SubNodesByGraph';
import './SubNodes.css';

class SubNodes extends Component {

  constructor(props) {
    super(props);
    this.onColapseSubNodes = this.onColapseSubNodes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let current = this.props.currentNode,
        next = nextProps.currentNode;

    if (!current || !next) {
      console.log(current, next);
      return;
    }

    if(current._id !== next._id || current.uuid !== next.uuid) {
      this.props.resetSubNodes();
      if(next) {
        this.props.traversalSearch({ node: next });
      }
    }
  }

  onCloseSubNodes(event) {
    event.stopPropagation();
    this.props.clearCurrentNode();
    this.props.resetSubNodes();
  }

  onColapseSubNodes(event) {
    event.stopPropagation();
    console.log('Colapse SubNodes...');
  }

  render() {
    const headerTitle = this.props.currentNode ? this.props.currentNode.name : '';
    const byGraph = this.props.subNodesByGraph.map((items, index) => {
      return <SubNodesByGraph key={`index_${items.graph}_${items.nodes.length}`}
                              items={items}/>
    });

    return (
      <div className="subnodes">
        <div className="subnodes-header">
          <div className="subnodes-header-title" title={headerTitle}>
            <span className="title-limit">{headerTitle}</span>
          </div>
          <button className="btn colapse-subnodes-btn" onClick={this.onColapseSubNodes}>
            <i className="fa fa-angle-right"></i>
          </button>
          <InfoContentHead />
        </div>
        <div className="subnodes-graph-items">
          {byGraph}
        </div>
        <Loading isLoading={this.props.traversalLoading} iconSize="big" />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    traversalLoading: state.nodes.traversalLoading,
    subNodesByGraph: state.nodes.subNodesByGraph
  };
}

export default connect(
  mapStateToProps,
  { resetSubNodes, clearCurrentNode, traversalSearch }
)(SubNodes);
