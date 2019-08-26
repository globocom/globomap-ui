/*
Copyright 2019 Globo.com

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

import tippy from 'tippy.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  clearNodes,
  setCurrentNode,
  clearCurrentNode,
  traversalSearch } from '../../redux/modules/nodes';
import { addStageNode } from '../../redux/modules/stage';
import { setFullTab } from '../../redux/modules/tabs';
import SearchContentPagination from './SearchContentPagination';
import { NodeInfo } from '../';
import './SearchContent.css';

export class SearchContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNodeInfo: false,
      nodeInfoNode: null
    };

    this.onCloseNodeInfo = this.onCloseNodeInfo.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress, false);
    tippy('.row-tools button', { arrow: true, animation: "fade" });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onCloseSearchContent(event)
    }
  }

  onOpenMap(event, node) {
    event.stopPropagation();
    this.props.addStageNode(node, null, true);

    // change to map screen and do traversal search
    this.props.setFullTab('map');
    this.props.traversalSearch({ node: node });
  }

  onToggleNodeInfo(event, node) {
    event.stopPropagation();
    this.setState({
      showNodeInfo: true,
      nodeInfoNode: node
    });
  }

  onCloseNodeInfo() {
    this.setState({ showNodeInfo: false });
  }

  onCloseSearchContent(event) {
    event.stopPropagation();
    this.props.clearNodes();
    this.props.clearCurrentNode();
  }

  render() {
    let allNodes = [];
    if (this.props.nodeList !== undefined) {
      allNodes = this.props.nodeList.map((node, i) => {
        // let current = (this.props.currentNode &&
        //                node._id === this.props.currentNode._id);
        return (
          <React.Fragment key={node._id}>
            <tr onClick={e => this.onOpenMap(e, node)}>
              <th className="row-tools-body">
                <div className="row-tools">
                  <button onClick={e => this.onToggleNodeInfo(e, node)}
                          className={this.state.showNodeInfo ? 'active' : ''}
                          data-tippy-content="Show Info">
                    <i className="icon fa fa-info" />
                  </button>
                  <button onClick={e => this.onOpenMap(e, node)}
                          data-tippy-content="Build Map">
                    <i className="icon fa fa-sitemap" />
                  </button>
                </div>
              </th>
              <td className="type-body">{this.props.namedCollections[node.type].alias}</td>
              <td className="name-body">{node.name}</td>
            </tr>
          </React.Fragment>
        );
      });
    }

    return (
      <div className={`search-content base-content${allNodes.length > 0 ? ' active' : ''}`}>
        <button className="search-content-btn-close"
                onClick={e => this.onCloseSearchContent(e)}>
          <i className="fa fa-times"></i>
        </button>
        {allNodes.length > 0 &&
          <table className="search-content-results">
            <thead>
              <tr>
                <th className="row-tools-head"></th>
                <th className="type-head">Type</th>
                <th className="name-head">Name</th>
              </tr>
            </thead>
            <tbody>{allNodes}</tbody>
            <tfoot className="search-content-base">
              <tr>
                <th><SearchContentPagination /></th>
              </tr>
            </tfoot>
          </table>}
        {this.state.showNodeInfo &&
          <NodeInfo node={this.state.nodeInfoNode}
                    onClose={this.onCloseNodeInfo} />}
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
  {
    addStageNode,
    setCurrentNode,
    clearNodes,
    clearCurrentNode,
    traversalSearch,
    setFullTab
  }
)(SearchContent);
