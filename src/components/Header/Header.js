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
import { toggleGraph } from '../../redux/modules/graphs';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedGraphs: [],
      checkedCollections: [],
      query: '',
      loading: false,
      showOptions: false,
      queryProps: [],
      propsOperators: ["==", "LIKE", "!=", ">", ">=", "<", "<="]
    };

    this.addProp = this.addProp.bind(this);
    this.removeProp = this.removeProp.bind(this);
    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onSendSearchQuery = this.onSendSearchQuery.bind(this);
    this.onToggleSearchOptions = this.onToggleSearchOptions.bind(this);
    this.onToggleGraph = this.onToggleGraph.bind(this);
    this.closeSearchOptions = this.closeSearchOptions.bind(this);
  }

  addProp() {
    let qProps = this.state.queryProps.slice();
    qProps.push({ 'name': '', 'value': '', 'op': 'LIKE' });
    this.setState({ queryProps: qProps });
  }

  removeProp(index) {
    let qProps = this.state.queryProps.slice();
    qProps.splice(index, 1);
    this.setState({ queryProps: qProps });
  }

  handlePropChange(event, index, item) {
    let qProps = this.state.queryProps.slice();
    qProps[index][item] = event.target.value;
    this.setState({ queryProps: qProps });
  }

  handleCheckItem(event) {
    let target = event.target,
        co = this.state.checkedCollections.slice(),
        itemIndex = co.indexOf(target.name);

    if (itemIndex < 0) {
      co.push(target.name);
    } else {
      co.splice(itemIndex, 1);
    }

    this.setState({ checkedCollections: co });
  }

  handleSearchChange(event) {
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
      let checkedGraphs = this.state.checkedGraphs,
          checkedCollections = this.state.checkedCollections;

      if (checkedCollections.length === 0 && checkedGraphs.length === 0) {
        checkedCollections = this.props.collections;
      }

      if (checkedCollections.length === 0) {
        return;
      }

      this.setState({ loading: true }, () => {
        this.props.findNodes({
            query: this.state.query,
            queryProps: this.state.queryProps,
            collections: checkedCollections
          }, (data) => {
            // TODO: Remove ref to SearchContent
            this.props.searchContent.pagination.setState({
              pageNumber: 1,
              currentPage: 1,
              totalPages: data.total_pages,
              total: data.total
            });

            this.setState({ loading: false });
            this.closeSearchOptions();
          });
      });

    });
  }

  onToggleSearchOptions(event) {
    event.preventDefault();
    this.setState({ showOptions: !this.state.showOptions });
  }

  onToggleGraph(event, graphName) {
    let collectionsByGraphs = Object.assign({}, this.props.collectionsByGraphs),
        collectionsByGraph = collectionsByGraphs[graphName],
        checkedCollections = this.state.checkedCollections.slice(),
        target = event.target;

    let checkedGraphs = this.props.graphs.filter(graph => {
      return graph.enabled;
    }).map(graph => {
      return graph.name;
    });

    let index = checkedGraphs.indexOf(target.name);

    // if (index < 0) {
    //   checkedGraphs.push(target.name);
    // } else {
    //   checkedGraphs.splice(index, 1);
    // }

    if (target.checked) {
      checkedCollections = checkedCollections.concat(collectionsByGraph);
    } else {
      collectionsByGraph.forEach((collection) => {
        let hasCheckedGraphs = false;
        for (let i = 0; i < checkedGraphs.length; i++) {
          if (this.props.collectionsByGraphs[checkedGraphs[i]].includes(collection)) {
            hasCheckedGraphs = true;
            break;
          }
        }

        if (!hasCheckedGraphs) {
          index = checkedCollections.indexOf(collection);
          checkedCollections.splice(index, 1);
        }
      });
    }

    // this.props.onToggleGraph(graphName, () => {
    //   this.setState({
    //     checkedGraphs: checkedGraphs,
    //     checkedCollections: _.uniq(checkedCollections)
    //   });
    // });

    this.props.toggleGraph(graphName);
  }

  closeSearchOptions() {
    this.setState({ showOptions: false });
  }

  render() {
    let graphButtons = this.props.graphs.map((graph) => {
      let disabledCls = graph.enabled ? '' : ' disabled';

      return <label key={"graph-" + graph.name} className={'item topcoat-checkbox' + disabledCls}>
              <input type="checkbox" name={graph.name} checked={graph.enabled}
                onChange={(e) => this.onToggleGraph(e, graph.name)} />
              <div className="topcoat-checkbox__checkmark"></div>
              &nbsp;<span className={'graph-name ' + graph.colorClass}>{graph.name}</span>
             </label>;
    });

    let collectionItems = this.props.collections.map((co) => {
      let selectedCollection = this.props.selectedCollections.includes(co),
          checkedCollection = this.state.checkedCollections.includes(co),
          disabledCls = !selectedCollection ? ' disabled' : '';

      return <label key={co} className={"item topcoat-checkbox" + disabledCls}>
              <input type="checkbox" name={co} checked={checkedCollection && selectedCollection}
                onChange={this.handleCheckItem} disabled={!selectedCollection} />
              <div className="topcoat-checkbox__checkmark"></div>
              &nbsp;{co}
             </label>;
    });

    let propItems = this.state.queryProps.map((prop, i) => {
      return (
        <div key={'prop' + i} className="prop-item">
          <input className="prop-query topcoat-text-input--large" type="search"
            name={'prop'+i+'-name'} placeholder="property name" value={this.state.queryProps[i].name}
            onChange={(e) => this.handlePropChange(e, i, 'name')} />

          <select className="prop-operator" name={'prop'+i+'-operator'}
            value={this.state.queryProps[i].op} onChange={(e) => this.handlePropChange(e, i, 'op')}>
            {this.state.propsOperators.map((op, j) => <option key={'op'+j} value={op}>{op}</option>)}
          </select>

          <input className="prop-query topcoat-text-input--large" type="search"
            name={'prop'+i+'-value'} placeholder="value" value={this.state.queryProps[i].value}
            onChange={(e) => this.handlePropChange(e, i, 'value')} />

          <button className="btn-remove-prop topcoat-button--quiet" onClick={() => this.removeProp(i)}>
            <i className="fa fa-close"></i>
          </button>
        </div>
      )
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
            {propItems}
            <button className="btn-and-prop topcoat-button" onClick={this.addProp}>+</button>
          </div>
        </div>
        <div className="options-base">
          <button className="topcoat-button--quiet" onClick={this.closeSearchOptions}>Cancel</button>
          <button className="topcoat-button--cta" onClick={this.onSendSearchQuery}
            disabled={this.state.loading}>Search</button>
        </div>
      </div>
    );

    let disabledMainSearch = this.state.queryProps.length > 0 && this.state.showOptions;
    return (
      <header className="main-header">
        <div className="header-group">
          <span className="logo">
            globo<span className="logo-map">map</span>
          </span>

          <div className="search-box">
            <input className="search-query topcoat-text-input--large" type="search" name="query"
              disabled={disabledMainSearch} value={this.state.query}
              onChange={this.handleSearchChange} onKeyPress={this.handleKeyPress} />

            <button className="btn-search" onClick={this.onSendSearchQuery}
              disabled={this.state.loading || disabledMainSearch}>
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

          <div className="user-items">
            <button className="logout-btn topcoat-button" href="/logout"
              onClick={() => { window.location.href = '/logout' }}>
              logout <i className="fa fa-sign-out"></i>
            </button>
          </div>
        </div>
        <div className="header-sub-group"></div>
      </header>
    );
  }

}

function mapStateToProps({ graphs, collections }) {
  return { graphs, collections };
}

export default connect(mapStateToProps, { toggleGraph })(Header);
