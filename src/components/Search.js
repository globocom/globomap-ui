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
import './css/Search.css';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      loading: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
  }

  render() {
    return (
      <div className="search-box">
        <input className="search-query topcoat-text-input--large" type="search" name="query"
          value={this.state.query} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />

        <button className="btn-search-settings topcoat-button--large">
          <i className="fa fa-ellipsis-h"></i>
        </button>

        <button className="btn-search topcoat-button--large"
                onClick={this.onSendSearchQuery}
                disabled={this.state.loading}>
          Search {this.state.loading && <i className="loading-cog fa fa-cog fa-spin fa-fw"></i>}
        </button>
      </div>
    );
  }

  handleInputChange(event) {
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ [target.name]: value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSendSearchQuery(event);
    }
  }

  onSendSearchQuery(event) {
    event.preventDefault();
    this.props.clearStage();
    this.props.clearInfo(() => {
      if (this.props.checkedCollections.length > 0) {
        this.setState({ loading: true }, () => {
          this.props.findNodes(this.state.query, this.props.checkedCollections, null, 1, (data) => {
            this.setState({ loading: false });
            this.props.searchContent.pagination.setState({
              pageNumber: 1,
              totalPages: data.total_pages,
              total: data.total
            });
          });
        });
      }
    });
  }

}

export default Search;
