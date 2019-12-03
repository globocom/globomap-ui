/*
Copyright 2018 Globo.com

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
import {
  resetSubNodes,
  findNodes } from '../../redux/modules/nodes';
import { cleanStageNodes } from '../../redux/modules/stage';
import { sortBy } from '../../utils';
import './SearchHeader.css';

export class SearchHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedCollections: [],
      query: '',
      showOptions: true,
      showSearchTypes: false,
      searchFor: "nome",
      queryProps: [{ 'name': '', 'value': '', 'op': 'LIKE' }],
      propsOperators: ["==", "LIKE", "NOTIN", "IN", "!=", ">", ">=", "<", "<=", "!~", "=~"]
    };

    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.onToggleSearchOptions = this.onToggleSearchOptions.bind(this);
    this.closeSearchOptions = this.closeSearchOptions.bind(this);
  }

  addProp(event) {
    event.preventDefault();
    this.propItems.scrollTop = this.propItems.scrollHeight;
    let qProps = this.state.queryProps.slice();
    qProps.push({ 'name': '', 'value': '', 'op': 'LIKE' });
    this.setState({ queryProps: qProps });
  }

  removeProp(event, index) {
    event.preventDefault();
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
      document.activeElement.blur();
    }
  }

  onSendSearchQuery(event) {
    event.preventDefault();

    this.props.cleanStageNodes();
    this.props.resetSubNodes();

    let checked = this.state.checkedCollections;

    if (checked.length === 0) {
      checked = this.props.collections.map(co => co.name);
    }

    let params = { collections: checked };

    if (this.state.searchFor === 'nome') {
      params['query'] = this.state.query;
      params['queryType'] = 'name';
    } else {
      params['queryProps'] = this.state.queryProps;
    }

    this.props.findNodes(params);
  }

  onToggleSearchOptions(event) {
    event.preventDefault();
    this.setState({ showOptions: !this.state.showOptions });
  }

  closeSearchOptions() {
    this.setState({ showOptions: false });
  }

  render() {
    const coItems = sortBy(this.props.collections, 'alias');
    const collectionItems = coItems.map((co) => {
      const checked = this.state.checkedCollections.includes(co.name);
      return (
        <label key={co.name} className={`item${checked ? ' checked' : ''}`}>
          {co.alias}
          <input type="checkbox" name={co.name} checked={checked} onChange={this.handleCheckItem} />
        </label>
      );
    });

    const propItems = this.state.queryProps.map((prop, i) => {
      return (
        <div key={'prop' + i} className="prop-item">
          <input className="prop-query" type="search"
            name={'prop'+i+'-name'} placeholder="property name" value={this.state.queryProps[i].name}
            onChange={e => this.handlePropChange(e, i, 'name')} />

          <select className="prop-operator" name={'prop'+i+'-operator'}
            value={this.state.queryProps[i].op} onChange={e => this.handlePropChange(e, i, 'op')}>
            {this.state.propsOperators.map((op, j) => <option key={'op'+j} value={op}>{op}</option>)}
          </select>

          <input className="prop-query" type="search"
            name={'prop'+i+'-value'} placeholder="value" value={this.state.queryProps[i].value}
            onChange={e => this.handlePropChange(e, i, 'value')}
            onKeyPress={e => this.handleKeyPress(e)} />

          {i === 0 &&
            <button className="btn-remove-prop" disabled={true}>
              <i className="fas fa-times"></i>
            </button>}

          {i > 0 &&
            <button className="btn-remove-prop" onClick={e => this.removeProp(e, i)}>
              <i className="fas fa-times"></i>
            </button>}
        </div>
      );
    });

    return (
      <header className={`search-header${this.state.showOptions ? ' with-options' : ''}`}>
        <div className="search-box">
          {this.state.searchFor === 'nome' &&
            <div className="search-for-all">
              <input className="search-query" type="search" name="query"
                placeholder="Type keyword" autoComplete="off"
                value={this.state.query}
                onChange={this.handleSearchChange}
                onKeyPress={e => this.handleKeyPress(e)} />
            </div>}

          {this.state.searchFor === 'propriedades' &&
            <div className="search-for-properties">
              <div className="property-items" ref={(el) => { this.propItems = el; }}>
                {propItems}
              </div>
              <button className="gmap-btn small btn-add-prop" onClick={e => this.addProp(e)}>
                <i className="icon fas fa-plus"></i> Adicionar outro
              </button>
            </div>}

          <div className="search-header-base">

            <div className="search-header-type">
              <div className="toggle-search-type">
                <div className="selected-search-type"
                    onClick={() => this.setState({ showSearchTypes: !this.state.showSearchTypes })}>
                  por <span className="search-type">{this.state.searchFor}</span> <i className="arrow fas fa-chevron-down"></i>
                </div>
                {this.state.showSearchTypes &&
                  <div className="search-types">
                    <button onClick={() => this.setState({ searchFor: 'nome', showSearchTypes: false })}
                      disabled={this.state.searchFor === 'nome'}>nome</button>

                    <button onClick={() => this.setState({ searchFor: 'propriedades', showSearchTypes: false })}
                      disabled={this.state.searchFor === 'propriedades'}>propriedades</button>
                  </div>}
              </div>
            </div>

            <button className="gmap-btn btn-search-options" onClick={(e) => this.onToggleSearchOptions(e)}
              data-tippy-content="Show/hide filters">
              <i className="fa fa-sliders-h"></i> Habilitar/desabilitar filtros
            </button>

            <button className="gmap-btn btn-search" onClick={e => this.onSendSearchQuery(e)}
              data-tippy-content="Run Search" disabled={this.props.findLoading}>
                <i className="fa fa-search"></i> Buscar
            </button>
          </div>

        </div>

        {this.state.showOptions &&
          <div className="search-options">
            <div className="collection-items">
              {this.props.collectionsLoading
                ? <div className="content-loading">
                    <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
                  </div>
                : collectionItems}
            </div>
          </div>}
      </header>
    );
  }

}

function mapStateToProps(state) {
  return {
    graphs: state.app.graphs,
    collections: state.app.collections,
    collectionsByGraphs: state.app.collectionsByGraphs,
    selectedCollections: state.app.selectedCollections,
    collectionsLoading: state.app.collectionsLoading,
    findLoading: state.nodes.findLoading
  };
}

export default connect(
  mapStateToProps,
  {
    resetSubNodes,
    findNodes,
    cleanStageNodes
  }
)(SearchHeader);
