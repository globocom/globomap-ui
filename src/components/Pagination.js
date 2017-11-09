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
import './css/Pagination.css';

class Pagination extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 1,
      currentPage: 1,
      totalPages: 0,
      total: 0
    };

    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.doFindNodes = this.doFindNodes.bind(this);
  }

  render() {
    if (this.props.nodes.length === 0) {
      return null;
    }

    return (
      <div className="pagination">
        <button className="btn-previous topcoat-button" onClick={(e) => this.onSendSearchQuery(e, 'previous')}
          disabled={this.state.currentPage === 1}>
          <i className="fa fa-caret-left"></i> previous
        </button>

        <input className="page-number topcoat-text-input" type="text" name="pagination"
          value={this.state.pageNumber} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />

        <button className="btn-next topcoat-button" onClick={(e) => this.onSendSearchQuery(e, 'next')}
          disabled={this.state.currentPage === this.state.totalPages}>
          next <i className="fa fa-caret-right"></i>
        </button>

        <div className="pagination-info">
          {this.state.totalPages} Page{this.state.totalPages > 1 && 's'}
        </div>
      </div>
    )
  }

  doFindNodes(pageNumber) {
    if (pageNumber <= 0 || pageNumber > this.state.totalPages) {
      return;
    }

    // TODO: Remove refs to Header
    let co = this.props.header.state.checkedCollections,
        queryProps = this.props.header.state.queryProps,
        query = this.props.header.state.query;

    if (co.length === 0) {
      co = this.props.enabledCollections;
    }

    this.props.findNodes({
        query: query,
        collections: co,
        queryProps: queryProps,
        page: pageNumber
      }, (data) => {
        if (data.length === 0) {
          return;
        }
        this.setState({ pageNumber, currentPage: pageNumber });
      });
  }

  onSendSearchQuery(event, direction) {
    let pageNumber = this.state.pageNumber;
    event.preventDefault();

    if (direction === 'next') {
      pageNumber = pageNumber + 1;
    } else if (direction === 'previous') {
      pageNumber = pageNumber - 1;
    }

    this.doFindNodes(pageNumber);
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

}

export default Pagination;
