import React, { Component } from 'react';
import './css/Search.css';

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
  }

  render() {
    return (
      <div className="search-box">
        <input className="topcoat-text-input--large" type="search" name="query"
          value={this.state.query} onChange={this.handleInputChange} />
        <button className="btn-search topcoat-button--large" onClick={this.onSendSearchQuery}>Search</button>
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value});
  }

  onSendSearchQuery() {
    if(this.state.query === "") {

    }
    this.props.findNodes(this.state.query, this.props.enabledCollections);
  }

}

export default Search;
