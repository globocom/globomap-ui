import React, { Component } from 'react';
import './css/Search.css';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
  }

  render() {
    return (
      <div className="search-box">
        <input className="topcoat-text-input--large" type="search" name="query"
          value={this.state.query} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
        <button className="btn-search topcoat-button--large" onClick={this.onSendSearchQuery}>Search</button>
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
  };

  onSendSearchQuery(event) {
    event.preventDefault();
    this.props.clearStage();
    this.props.clearCurrent();
    this.props.findNodes(this.state.query, this.props.enabledCollections);
  }

}

export default Search;
