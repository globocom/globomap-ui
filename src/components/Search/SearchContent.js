/*
Copyright 2018 Globo.com

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
import {
  clearNodes,
  setCurrentNode,
  clearCurrentNode
} from '../../redux/modules/nodes';
import { addStageNode } from '../../redux/modules/stage';
import { setTab } from '../../redux/modules/tabs';
import SearchContentPagination from './SearchContentPagination';
import { Properties } from '../';
import './SearchContent.css';

class SearchContent extends Component {

  constructor(props) {
    super(props);
    this.onNodeSelect = this.onNodeSelect.bind(this);
  }

  onNodeSelect(event, node) {
    event.stopPropagation();
    if (this.props.currentNode !== null &&
        this.props.currentNode._id === node._id) {
      return this.props.clearCurrentNode();
    }
    return this.props.setCurrentNode(node);
  }

  onOpenMap(event, node) {
    event.stopPropagation();
    this.props.addStageNode(node, null, true);
    // change to map screen
    this.props.setTab('map');
  }

  onOpenProperties(event, node) {
    event.stopPropagation();
  }

  onCloseSearchContent(event) {
    event.stopPropagation();
    this.props.clearNodes();
    this.props.clearCurrentNode();
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
          <React.Fragment key={node._id}>
            <tr className={current ? 'current' : ''}
                onClick={e => this.onNodeSelect(e, node)}>
              <td>{i + index}</td>
              <td>{this.props.namedCollections[node.type].alias}</td>
              <td>{node.name}</td>
            </tr>
            <tr className={`node-options${current ? ' open' : ''}`}>
              <td colSpan="3">
                <button onClick={e => this.onOpenProperties(e, node)}>
                  <i className="icon fa fa-info" /> Properties
                </button>
                <button onClick={e => this.onOpenMap(e, node)}>
                  <i className="icon fa fa-sitemap" /> View Map
                </button>
                {/* <div className="node-properties">
                  <Properties item={node} />
                </div> */}
              </td>
            </tr>
          </React.Fragment>
        );
      });
    }

    return (
      <div className={`search-content${allNodes.length > 0 ? ' active' : ''}`}>
        <button className="search-content-btn-close"
                onClick={e => this.onCloseSearchContent(e)}>
          <i className="fa fa-times"></i>
        </button>
        {allNodes.length > 0 &&
          <table className="search-content-results">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>{allNodes}</tbody>
            <tfoot className="search-content-base">
              <tr>
                <th><SearchContentPagination /></th>
              </tr>
            </tfoot>
          </table>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nodeList: state.nodes.nodeList,
    currentNode: state.nodes.currentNode,
    perPage: state.nodes.perPage,
    currentPage: state.nodes.currentPage,
    namedCollections: state.app.namedCollections
  };
}

export default connect(
  mapStateToProps,
  { addStageNode, setCurrentNode, clearNodes,
    clearCurrentNode, setTab }
)(SearchContent);
