import React, { Component } from 'react';
import './css/Search.css';

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: "",
      collections: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
  }

  render() {
    return (
      <div className="search-box">
        <input type="text" name="query" placeholder="search"
               value={this.state.query} onChange={this.handleInputChange} />

        <button className="btn-search" onClick={this.onSendSearchQuery}>Search</button>
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value});
  }

  onSendSearchQuery() {
    this.props.findNodes(this.state.query, this.state.collections);
  }

}

export default Search;
