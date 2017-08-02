import React, { Component } from 'react';
import './css/Search.css';

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  render() {
    return (
      <div className="search-box">
        <input type="text" name="query"
               value={this.state.query} onChange={this.handleInputChange} />
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value});
  }

}

export default Search;
