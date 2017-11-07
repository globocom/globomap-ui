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
import './css/Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedCollections: [],
      query: '',
      loading: false,
      showOptions: false,
      queryProps: [{'name': '', 'value': '', 'op': ''}],
      propsOperators: ["LIKE", "==", "!=", ">", ">=", "<", "<="]
    };

    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.onToggleSearchOptions = this.onToggleSearchOptions.bind(this);
    this.closeSearchOptions = this.closeSearchOptions.bind(this);
  }

  render() {
    let graphButtons = this.props.graphs.map((graph) => {
      let disabledCls = graph.enabled ? '' : ' disabled';

      return <label key={"graph-" + graph.name} className={'item topcoat-checkbox' + disabledCls}>
              <input type="checkbox" name={graph.name} checked={graph.enabled}
                onChange={(e) => this.props.onToggleGraph(e, graph.name)} />
              <div className="topcoat-checkbox__checkmark"></div>
              &nbsp;<span className={'graph-name ' + graph.colorClass}>{graph.name}</span>
             </label>;
    });

    let collectionItems = this.props.collections.map((co) => {
      let hasCollection = !this.props.enabledCollections.includes(co);
      let disabledCls = hasCollection ? ' disabled' : '';

      return <label key={co} className={"item topcoat-checkbox" + disabledCls}>
              <input type="checkbox" name={co} checked={this.state.checkedCollections.includes(co)}
                onChange={this.handleCheckItem} disabled={hasCollection} />
              <div className="topcoat-checkbox__checkmark"></div>
              &nbsp;{co}
             </label>;
    });

    let searchOptions = (
      <div className="search-box-options">
        <div className="options-container">
          <strong className="option-title">Graphs</strong>
          <div className="graph-items">
            {graphButtons}
          </div>

          <strong className="option-title">Collections</strong>
          <div className="collection-items">
            {collectionItems}
          </div>

          <strong className="option-title">Search by Properties</strong>
          <div className="properties-items">
            <div className="prop-item">
              <input className="prop-query topcoat-text-input--large" type="search" name="prop-name" value="" placeholder="name" />
              <input className="prop-query topcoat-text-input--large" type="search" name="prop-value" value="" placeholder="value" />
            </div>
            <button className="btn-add-prop topcoat-button">+</button>
          </div>
        </div>
        <div className="options-base">
          <button className="topcoat-button--quiet"
            onClick={() => this.closeSearchOptions()}>Cancel</button>
          <button className="topcoat-button--cta"
            onClick={this.onSendSearchQuery} disabled={this.state.loading}>Search</button>
        </div>
      </div>
    );

    return <header className="main-header">
            <div className="header-group">
              <span className="logo">
                globo<span className="logo-map">map</span>
              </span>

              <div className="search-box">
                <input className="search-query topcoat-text-input--large" type="search" name="query"
                  value={this.state.query} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />

                <button className="btn-search" onClick={this.onSendSearchQuery} disabled={this.state.loading}>
                  {this.state.loading
                    ? <i className="loading-cog fa fa-cog fa-spin fa-fw"></i>
                    : <i className="fa fa-search"></i>}
                </button>

                <button className="btn-search-options topcoat-button--large"
                  onClick={(e) => this.onToggleSearchOptions(e)}>
                  <i className="fa fa-list"></i>
                </button>

                {this.state.showOptions && searchOptions}
              </div>
            </div>
            <div className="header-sub-group"></div>
           </header>;
  }

  handleCheckItem(event) {
    let target = event.target,
        colls = this.state.checkedCollections.slice(),
        itemIndex = colls.indexOf(target.name);

    if(itemIndex < 0) {
      colls.push(target.name);
    } else {
      colls.splice(itemIndex, 1);
    }

    this.setState({ checkedCollections: colls });
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
      let collections = this.state.checkedCollections;
      if (collections.length === 0) {
        collections = this.props.enabledCollections;
      }
      this.setState({ loading: true }, () => {
        this.props.findNodes(this.state.query, collections, null, 1, (data) => {
          this.setState({ loading: false });
          this.props.searchContent.pagination.setState({
            pageNumber: 1,
            totalPages: data.total_pages,
            total: data.total
          });
          this.closeSearchOptions();
        });
      });
    });
  }

  onToggleSearchOptions(event) {
    event.preventDefault();
    this.setState({ showOptions: !this.state.showOptions });
  }

  closeSearchOptions() {
    this.setState({ showOptions: false });
  }

  componentWillReceiveProps(nextProps) {
    let checkedCollections = [];

    this.state.checkedCollections.forEach((item) => {
      if (nextProps.enabledCollections.includes(item)) {
        checkedCollections.push(item);
      }
    });

    this.setState({ checkedCollections });
  }
}

export default Header;
