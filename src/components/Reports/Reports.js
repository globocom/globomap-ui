/*
Copyright 2019 Globo.com

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

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {
  findReportNodes,
  clearReportNodes } from '../../redux/modules/reports';
import { sortByName } from '../../utils';
import './Reports.css';

export class Reports extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showQ: false,
      q: '',
      collection: '',
      query: '',
      paneIndex: 1
    }

    this.handleQChange = this.handleQChange.bind(this);
  }

  handleQChange(event) {
    let value = event.target.value.trim();
    this.setState({ q: value });
  }

  handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search();
    }
  }

  setQuery(query) {
    this.setState({
      showQ: true,
      collection: query.collection,
      query: query,
      q: ''
    }, () => {
      this.setPane(2);
      this.inputQ.focus();
      this.props.clearReportNodes();
    });
  }

  setPane(index) {
    this.setState({
      paneIndex: index
    })
  }

  search() {
    let params = {
      collections: ['vip'],
      queryType: 'name',
      query: this.state.q,
    };

    if (this.state.collection !== '') {
      params['collections'] = [this.state.collection];
    }

    this.props.findReportNodes(params);
  }

  componentWillUnmount() {
    this.props.clearReportNodes();
  }

  render() {
    let queries = sortByName(this.props.queries);

    // console.log(_.mapKeys(queries, 'collection'));

    queries = queries.map(query => {
      if (query.collection === '') {
        return null;
      }
      return (
        <button key={query._id} className="query-btn"
                onClick={() => this.setQuery(query)}>
          {query.description}
        </button>
      );
    });

    const reportNodes = this.props.reportNodes.map((node, i) => {
      return (
        <li key={`${i}-${node._id}`}>
          <a className="query" target="_blank" rel="noopener noreferrer"
            href={`/tools/report?q=${this.state.query._key}&v=${node._id}`}>
            { node.name }
          </a>
        </li>
      )
    })

    const idx = this.state.paneIndex;
    return (
      <div className="reports">
        <h3 className="reports-title">Reports</h3>

        <div className="reports-tabs">
          <button className={idx === 1 ? 'active' : ''} data-step="1"
                  onClick={() => this.setPane(1)}>Select report type</button>
          <button className={idx === 2 ? 'active' : ''} data-step="2"
                  onClick={() => this.setPane(2)}
                  disabled={this.state.query === ''}>Search for a item</button>
        </div>

        <div className="reports-panes">
          <div className={`reports-queries ${idx === 1 ? 'active' : ''}`}>
            {queries}
          </div>
          <div className={`reports-list ${idx === 2 ? 'active' : ''}`}>
            <div className="reports-search">
              <input type="search" name="q" className="reports-q" autoFocus
                      value={this.state.q} ref={elem => { this.inputQ = elem; }}
                      onChange={_.throttle(this.handleQChange, 300)}
                      onKeyPress={e => this.handleEnterKeyPress(e)}
                      placeholder={this.state.query.description}/>
              <button onClick={() => this.search()}>
                <i className="fas fa-search"></i>
              </button>
            </div>
            <ul className="reports-item-list">
              {reportNodes}
            </ul>
          </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    queries: state.app.queries,
    loading: state.reports.loading,
    reportNodes: state.reports.reportNodeslist
  };
}

export default connect(
  mapStateToProps,
  {
    findReportNodes,
    clearReportNodes
  }
)(Reports);
