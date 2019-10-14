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
import { findNodes } from '../../redux/modules/nodes';
import './SearchContentPagination.css';

export class SearchContentPagination extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 1
    };

    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.doFindNodes = this.doFindNodes.bind(this);
  }

  doFindNodes(pageNumber) {
    if (pageNumber <= 0 || pageNumber > this.props.totalPages) {
      return;
    }

    this.props.findNodes({
      ...this.props.searchOptions,
      page: pageNumber
    });
  }

  onSendSearchQuery(event, dir) {
    event.preventDefault();
    let page = this.state.pageNumber;

    if (dir === 'next') {
      page = page + 1;
    } else if (dir === 'previous') {
      page = page - 1;
    }

    this.doFindNodes(page);
  }

  handleInputChange(event) {
    let pageNumber = event.target.value.trim();

    if (pageNumber.length === 0) {
      this.setState({ pageNumber });
      return;
    }

    pageNumber = parseInt(event.target.value, 10) || 1;
    this.setState({ pageNumber });
  }

  handleKeyPress(event) {
    let pageNumber = 0;
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    pageNumber = parseInt(event.target.value, 10) || 1;
    this.doFindNodes(pageNumber);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentPage !== this.props.currentPage) {
      this.setState({ pageNumber: this.props.currentPage });
    }
  }

  render() {
    if (this.props.nodeList === undefined || this.props.nodeList.length === 0) {
      return null;
    }

    return (
      <div className="search-content-pagination">
        <button className="btn-previous gmap-btn small" onClick={(e) => this.onSendSearchQuery(e, 'previous')}
          disabled={this.props.currentPage === 1}>
          <i className="fa fa-angle-left"></i>
        </button>

        <input className="page-number gmap-text small" type="text" name="pagination"
          value={this.state.pageNumber} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />

        <button className="btn-next gmap-btn small" onClick={(e) => this.onSendSearchQuery(e, 'next')}
          disabled={this.props.currentPage === this.props.totalPages}>
          <i className="fa fa-angle-right"></i>
        </button>

        <div className="pagination-info">
          {this.props.totalPages} Page{this.props.totalPages > 1 && 's'}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { nodeList, totalPages,
          currentPage, searchOptions } = state.nodes;
  return {
    nodeList,
    totalPages,
    currentPage,
    searchOptions
  };
}

export default connect(
  mapStateToProps,
  { findNodes }
)(SearchContentPagination);
