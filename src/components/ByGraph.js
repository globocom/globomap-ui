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

/* global _ */

import React, { Component } from 'react';
import NodeEdges from './NodeEdges';
import './css/ByGraph.css';

class ByGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      searchIsOpen: false,
      filterIsOpen: false,
      excludedTypes: [],
      query: "",
      searchIndex: [],
      graphAmount: this.props.items.subnodes.length
    };

    this.onAddNode = this.onAddNode.bind(this);
    this.onAddAllNodes = this.onAddAllNodes.bind(this);
    this.onOpenGraph = this.onOpenGraph.bind(this);
    this.onInputSearch = this.onInputSearch.bind(this);
    this.onInputFilter = this.onInputFilter.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.clearSearchIndex = this.clearSearchIndex.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  render() {
    let items = this.props.items,
        isOpen = items.subnodes.length > 0
                 ? this.state.isOpen
                 : false;

    let colorCls = this.props.graphs.filter((graph) => {
      return graph.name === items.graph;
    })[0].colorClass;

    return <div key={items.graph} className={'sub-nodes-by-graph' + (isOpen ? ' open' : '')}>
            <div className={'graph-header ' + colorCls}>
                <span className="graph-name" onClick={this.onOpenGraph}>
                  <i className={isOpen ? 'icon-down fa fa-caret-down' : 'icon-right fa fa-caret-right'}></i>
                  &nbsp;{items.graph}
                </span>

                <span className="graph-amount">
                  {this.state.graphAmount}
                </span>

                <span className="graph-buttons">
                  <button className="btn btn-search" onClick={this.onInputSearch}>
                    <i className="fa fa-search"></i>
                  </button>
                  <button className="btn btn-filter" onClick={this.onInputFilter}>
                    <i className="fa fa-filter"></i>
                  </button>
                  <button className="btn btn-add-all" onClick={this.onAddAllNodes}>
                    <i className="fa fa-plus-square"></i>
                  </button>
                </span>

                {(this.state.searchIsOpen && this.state.graphAmount > 0) &&
                <span className="graph-search">
                  <input type="search" name="query" className="topcoat-text-input graph-search-input"
                    autoFocus value={this.state.query} onChange={this.handleInputChange} />
                  <i className="fa fa-search" onClick={this.onInputSearch}></i>
                </span>}
              </div>
              <div className="graph-items">
              {this.buildCollectionTypes()}
              {this.buildSubNodes(items)}
              </div>
            </div>;
  }

  buildCollectionTypes() {
    let collectionsByGraphs = this.props.collectionsByGraphs;
    let items = this.props.items;

    if (!this.state.filterIsOpen) {
      return null;
    }

    return (
      <div className="graph-types">
        {collectionsByGraphs[items.graph].map((co) => {
          return <label key={co} className="item topcoat-checkbox">
            <input type="checkbox" name={co}
              checked={!this.state.excludedTypes.includes(co)}
              onChange={this.handleCheckItem} />
            <div className="topcoat-checkbox__checkmark"></div>
            &nbsp;{co}
           </label>
        })}
      </div>
    )
  }

  buildSubNodes(nodesItem) {
    let hasQuery = this.state.query.trim().length > 0;
    let hasSearchIndex = this.state.searchIndex.length > 0;
    let subnodes;

    if (this.state.filterIsOpen) {
      return null;
    }

    subnodes = nodesItem.subnodes.map((subnode, index) => {
      let type = subnode.type.toLowerCase();
      let hasNode = false;

      if (this.state.excludedTypes.includes(type)) {
        return null;
      }

      if (hasQuery) {
        if (!hasSearchIndex) {
          return null;
        } else if (!this.state.searchIndex.includes(index)) {
          return null;
        }
      }
      hasNode = this.props.stageHasNode(subnode._id, this.props.node.uuid);

      return <div key={subnode._id} className={'sub-node' + (hasNode ? ' disabled': '')}>
               <div className="sub-node-btn">
                 <button className="btn-add-node topcoat-button"
                   onClick={(e) => this.onAddNode(e, subnode)} disabled={hasNode}>+</button>
               </div>

               <div className="sub-node-info" onClick={(e) => this.onAddNode(e, subnode, true)}>
                 <span className="sub-node-type">{subnode.type}</span>
                 <span className="sub-node-name" title={subnode.name}>{subnode.name}</span>
               </div>

               <NodeEdges edges={subnode.edges}
                          graphs={this.props.graphs}
                          position={'right'}
                          hasId={this.props.hasId} />
             </div>;
    });

    return subnodes;
  }

  onOpenGraph(event) {
    event.stopPropagation();
    return this.setState({ isOpen: !this.state.isOpen });
  }

  onAddNode(event, node, makeCurrent) {
    event.stopPropagation();
    this.clearSearchIndex();
    this.props.addNodeToStage(node, this.props.node.uuid || this.props.node._id, makeCurrent);
  }

  onAddAllNodes(event, makeCurrent) {
    event.stopPropagation();
    this.clearSearchIndex();
    this.props.items.subnodes.map((node, index) => {
      let searchIndex = this.state.searchIndex;
      let excludedTypes = this.state.excludedTypes;
      let type = node.type.toLowerCase();
      if (excludedTypes.includes(type)) {
        return null;
      }
      if (searchIndex.length > 0 &&
        !searchIndex.includes(index)) {
        return false;
      }
      return this.props.addNodeToStage(node, this.props.node.uuid || this.props.node._id, makeCurrent);
    });
  }

  onInputSearch(event) {
    this.setState({
      searchIsOpen: !this.state.searchIsOpen
    }, () => {
      if (!this.state.searchIsOpen) {
        this.clearFilter();
      }
    });
  }

  onInputFilter() {
    this.setState({
      filterIsOpen: !this.state.filterIsOpen
    });
  }

  handleInputChange(event) {
    let value = event.target.value;
    this.setState({ query: value }, () => {
      this.onSendSearchQuery(event);
    });
  }

  handleCheckItem(event) {
    let target = event.target;
    let excludedTypes = _.uniq(this.state.excludedTypes);
    let query = this.state.query.trim().toLowerCase();
    let hasQuery = query.length > 0;
    let graphAmount = 0;
    let index;

    if (target.checked) {
      index = excludedTypes.indexOf(target.name);

      if (index > -1) {
        excludedTypes.splice(index, 1);
      }
    } else {
      excludedTypes.push(target.name);
    }

    this.props.items.subnodes.forEach((subnode) => {
      let name = subnode.name.toLowerCase();

      if (excludedTypes.includes(subnode.type)) {
        return;
      }
      if (!hasQuery) {
        graphAmount++;
      }
      if (hasQuery && name.includes(query)) {
        graphAmount++;
      }
    });

    this.setState({
      excludedTypes: excludedTypes,
      graphAmount: graphAmount
    });
  }

  onSendSearchQuery(event) {
    let searchIndex = [];
    this.props.items.subnodes.map((subnode, index) => {
      let query = this.state.query.toLowerCase();
      let item = subnode.name.toLowerCase();
      let type = subnode.type.toLowerCase();

      if (this.state.excludedTypes.includes(type)) {
        return false;
      }
      if (item.includes(query)) {
        searchIndex.push(index);
      }
      return false;
    });
    this.setState({
      searchIndex: searchIndex,
      graphAmount: searchIndex.length
    });
  }

  clearSearchIndex() {
    this.setState({
      searchIsOpen: false,
      query: "",
      searchIndex: []
    });
  }

  clearFilter() {
    this.setState({
      filterIsOpen: false
    });
  }

}

export default ByGraph;
