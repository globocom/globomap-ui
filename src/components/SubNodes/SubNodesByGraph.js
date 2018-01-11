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

import _ from "lodash";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addStageNode } from '../../redux/modules/stage';
import { NodeEdges } from '../';
import './SubNodesByGraph.css';

class SubNodesByGraph extends Component {

  constructor(props) {
    super(props);
    this.throttleTime = 300;
    this.regexp = /^\d+$/;
    this.state = {
      isOpen: true,
      searchIsOpen: false,
      filterIsOpen: false,
      excludedTypes: [],
      query: "",
      queryAmount: 1,
      searchIndex: [],
      graphAmount: null,
      pageNumber: 1,
      pageSize: 10
    };

    this.onAddNode = this.onAddNode.bind(this);
    this.onAddAllNodes = this.onAddAllNodes.bind(this);
    this.onOpenGraph = this.onOpenGraph.bind(this);
    this.onInputSearch = this.onInputSearch.bind(this);
    this.onInputFilter = this.onInputFilter.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  buildCollectionTypes() {
    if (!this.state.filterIsOpen) {
      return null;
    }

    let items = this.props.items;
    let collectionsByGraphs = this.props.collectionsByGraphs[items.graph].map((co) => {
          return (
            <label key={co} className="item topcoat-checkbox">
              <input type="checkbox" name={co}
                checked={!this.state.excludedTypes.includes(co)}
                onChange={this.handleCheckItem} />
              <div className="topcoat-checkbox__checkmark"></div>
              &nbsp;{co}
            </label>
          );
        });

    return (
      <div className="graph-types">
        {collectionsByGraphs}
      </div>
    );
  }

  buildSubNodes(nodesItem) {
    let queryLength = this.state.query.trim().length;
    let start = (this.state.pageNumber - 1) * this.state.pageSize;
    let end = this.state.pageNumber * this.state.pageSize;
    let subnodes = nodesItem.subnodes;

    if (queryLength > this.state.queryAmount) {
      subnodes = subnodes.filter((node, index) => {
        return this.state.searchIndex.includes(index);
      });
    }

    if (this.state.excludedTypes.length > 0) {
      subnodes = subnodes.filter((node, index) => {
        let type = node.type.toLowerCase();
        return !this.state.excludedTypes.includes(type);
      });
    }

    let subnodesSlice = subnodes.slice(start, end);
    subnodes = subnodesSlice.map((subnode, index) => {
      // let hasNode = this.props.stageHasNode(subnode._id, this.props.node.uuid);

      // return <div key={subnode._id} className={'sub-node' + (hasNode ? ' disabled': '')}>
      return (
        <div key={subnode._id} className="sub-node">
          <div className="sub-node-btn">
            <button className="btn-add-node topcoat-button"
                    // disabled={hasNode}
                    onClick={(e) => this.onAddNode(e, subnode)}>+</button>
          </div>

          <div className="sub-node-info" onClick={(e) => this.onAddNode(e, subnode, true)}>
            <span className="sub-node-type">{subnode.type}</span>
            <span className="sub-node-name" title={subnode.name}>{subnode.name}</span>
          </div>

          <NodeEdges edges={subnode.edges}
                     position={'right'}
                     hasId={this.props.hasId} />
        </div>
      );
    });

    return subnodes;
  }

  pagination() {
    let graphAmount = this.regexp.test(this.state.graphAmount)
                        ? this.state.graphAmount
                        : this.props.items.subnodes.length;
    let pageSize = this.state.pageSize;

    if (graphAmount <= pageSize) {
      return;
    }

    return (
      <div className="graph-items-pagination">
        <button onClick={(e) => this.previous(e)} className="btn-previous topcoat-button">
          <i className="icon-left fa fa-caret-left"></i>
        </button>

        <input className="items-page-number topcoat-text-input" type="text"
          readOnly value={this.state.pageNumber} />

        <button onClick={(e) => this.next(e)} className="btn-next topcoat-button">
          <i className="icon-right fa fa-caret-right"></i>
        </button>
      </div>
    );
  }

  previous(event) {
    event.preventDefault();
    let pageNumber = this.state.pageNumber;
    if (pageNumber < 2) {
      return;
    }
    this.setState({ pageNumber: pageNumber - 1 });
  }

  next(event) {
    let graphAmount = (this.regexp.test(this.state.graphAmount)
                      ? this.state.graphAmount
                      : this.props.items.subnodes.length),
        totalPages = Math.ceil(graphAmount / this.state.pageSize),
        pageNumber = this.state.pageNumber;

    event.preventDefault();
    if (pageNumber >= totalPages) {
      return;
    }
    this.setState({ pageNumber: pageNumber + 1 });
  }

  onOpenGraph(event) {
    event.stopPropagation();
    return this.setState({ isOpen: !this.state.isOpen });
  }

  onAddNode(event, node, setCurrent) {
    event.stopPropagation();
    const currentNode = this.props.currentNode;
    this.props.addStageNode(node, currentNode.uuid || currentNode._id, setCurrent);
  }

  onAddAllNodes(event) {
    event.stopPropagation();
    const currentNode = this.props.currentNode;

    this.props.items.subnodes.map((node, index) => {
      const searchIndex = this.state.searchIndex;
      const excludedTypes = this.state.excludedTypes;

      if (excludedTypes.includes(node.type.toLowerCase())) {
        return null;
      }

      if (searchIndex.length > 0 && !searchIndex.includes(index)) {
        return false;
      }

      return this.props.addStageNode(node, currentNode.uuid || currentNode._id);
    });
  }

  onInputSearch(event) {
    this.setState({ searchIsOpen: !this.state.searchIsOpen }, () => {
      if (!this.state.searchIsOpen) {
        this.clearFilter();
      }
    });
  }

  onInputFilter() {
    if (this.props.items.subnodes.length === 0) {
      return;
    }
    this.setState({ filterIsOpen: !this.state.filterIsOpen });
  }

  handleInputChange(event) {
    let value = event.target.value.trim();
    this.setState({ query: value }, () => {
      if (value.length === 0) {
        this.setState({
          query: "",
          searchIndex: [],
          graphAmount: this.props.items.subnodes.length
        });
      }
      if (value.length > this.state.queryAmount) {
        this.setState({ pageNumber: 1 }, () => {
          this.onSendSearchQuery(event);
        });
      }
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
      pageNumber: 1,
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

  clearFilter() {
    this.setState({
      filterIsOpen: false
    });
  }

  render() {
    const items = this.props.items;
    const subnodesAmount = this.props.items.subnodes.length;
    let isOpen = items.subnodes.length > 0 ? this.state.isOpen : false;
    let graphAmount = this.regexp.test(this.state.graphAmount)
                        ? this.state.graphAmount
                        : items.subnodes.length;

    const parentGraph = this.props.graphs.filter((graph) => {
      return graph.name === items.graph;
    });
    const colorCls = parentGraph.length > 0 ? parentGraph[0].colorClass : '';

    if (graphAmount === 0 &&
      this.state.excludedTypes.length === 0 &&
      this.state.query.trim() === '') {
      return <div key={items.graph}></div>;
    }

    return (
      <div key={items.graph} className={'sub-nodes-by-graph' + (isOpen ? ' open' : '')}>
        <div className={'graph-header ' + colorCls}>
          <span className="graph-name" onClick={this.onOpenGraph}>
            <i className={isOpen ? 'icon-down fa fa-caret-down' : 'icon-right fa fa-caret-right'}></i>
            &nbsp;{items.graph}
          </span>

          <span className="graph-amount">
            {graphAmount}
          </span>

          <span className="graph-buttons">
            <button className="btn btn-search" onClick={this.onInputSearch}>
              <i className="fa fa-search"></i>
            </button>
            <button className={"btn btn-filter" + (
                this.state.filterIsOpen ? " active" : "")}
              onClick={this.onInputFilter}>
              <i className="fa fa-filter"></i>
            </button>
            <button className="btn btn-add-all" onClick={this.onAddAllNodes}>
              <i className="fa fa-plus-square"></i>
            </button>
          </span>

          {(this.state.searchIsOpen && subnodesAmount > 0) &&
          <span className="graph-search">
            <input type="search" name="query" className="topcoat-text-input graph-search-input"
              autoFocus value={this.state.query} onChange={
                _.throttle(this.handleInputChange, this.throttleTime)} />
            <i className="fa fa-search" onClick={this.onInputSearch}></i>
          </span>}
        </div>

        <div className="graph-items">
          {this.buildCollectionTypes()}
          {this.buildSubNodes(items)}
          {this.pagination()}
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    graphs: state.app.graphs,
    collectionsByGraphs: state.app.collectionsByGraphs
  };
}

export default connect(
  mapStateToProps,
  { addStageNode }
)(SubNodesByGraph);
