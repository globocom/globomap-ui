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
import { setCurrentNode, traversalSearch } from '../../redux/modules/nodes';
import { addStageNode } from '../../redux/modules/stage';
import SearchContentPagination from './SearchContentPagination';
import './SearchContent.css';

class SearchContent extends Component {

  constructor(props) {
    super(props);
    this.onNodeSelect = this.onNodeSelect.bind(this);
  }

  render() {
    let index = this.props.perPage * (this.props.currentPage - 1);
    index = (index === 0 ? 1 : index + 1);

    let allNodes = [];
    if (this.props.nodeList !== undefined) {
      allNodes = this.props.nodeList.map((node, i) => {
        let current = (this.props.currentNode &&
                       node._id === this.props.currentNode._id);
        return (
          <tr key={node._id} className={current ? 'current' : ''}
              onClick={(e) => this.onNodeSelect(e, node)}>
            <td>{i + index}</td>
            <td>{node.type}</td>
            <td>{node.name}</td>
          </tr>
        );
      });
    }

    return (
      <div className={'search-content' + (this.props.currentNode ? ' with-info' : '')}>
        <table className="search-content-results">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{allNodes.length > 0 && allNodes}</tbody>
        </table>
        <div className="search-content-base">
          <SearchContentPagination
            // ref={(pagination) => {this.pagination = pagination}}
            // nodes={this.props.nodes}
            // findNodes={this.props.findNodes}
            // enabledCollections={this.props.enabledCollections}
            // header={this.props.header}
            />
        </div>
      </div>
    );
  }

  onNodeSelect(event, node) {
    event.stopPropagation();
    // this.props.addNodeToStage(node, false, true);
    this.props.addStageNode(node, null, true);
    this.props.traversalSearch({ node });
  }

}

function mapStateToProps(state) {
  return {
    nodeList: state.nodes.nodeList,
    currentNode: state.nodes.currentNode,
    perPage: state.nodes.perPage,
    currentPage: state.nodes.currentPage
  };
}

export default connect(
  mapStateToProps,
  { setCurrentNode, traversalSearch, addStageNode }
)(SearchContent);