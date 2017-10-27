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
      totalPages: 0,
      total: 0
    };

    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  onSendSearchQuery(event, direction) {
    let pageNumber = this.state.pageNumber;
    event.preventDefault();

    if (direction === 'next') {
      pageNumber = pageNumber + 1
    } else if (direction === 'previous') {
      pageNumber = pageNumber - 1
    }

    this.findNodes(pageNumber);
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

    this.findNodes(pageNumber);
  }

  findNodes(pageNumber) {
    if (pageNumber <= 0 || pageNumber > this.state.totalPages) {
      return;
    }

    this.props.findNodes(this.props.header.state.query, this.props.header.state.checkedCollections, null, pageNumber, (data) => {
      if (data.length === 0) {
        return;
      }
      this.setState({
        pageNumber
      })
    });
  }

  render() {
    if (this.props.nodes.length === 0) {
      return null;
    }

    return (
      <div className="pagination">
        <span onClick={(e) => this.onSendSearchQuery(e, 'previous')}>
          <i className="icon-left fa fa-caret-left"></i>
        </span>
        <input className="input topcoat-text-input--large"
          type="text"
          name="pagination"
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
          value={this.state.pageNumber} />
        <span onClick={(e) => this.onSendSearchQuery(e, 'next')}>
          <i className="icon-right fa fa-caret-right"></i>
        </span>
      </div>
    )
  }

}

export default Pagination;
