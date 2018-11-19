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
import { Properties, Monit, Query } from '../';
import './InfoContentHead.css';

class InfoContentHead extends Component {

  render() {
    const node = this.props.currentNode;
    if (!node) {
      return null;
    }

    let tabs = [{ name: 'Properties', content: <Properties key="properties-info" item={node} /> },
                { name: 'Monitoring', content: <Monit /> },
                { name: 'Reports', content: <Query /> }];

    let tabsButtons = tabs.map((tabItem) => {
      let active = this.props.currentExtTab === tabItem.name ? ' active' : '';
      let disabled = false;

      if (tabItem.name === 'Monitoring' && !['comp_unit', 'zabbix_graph'].includes(node.type)) {
        disabled = true;
      }

      if (tabItem.name === 'Reports') {
        disabled = true;
        let queries = _.filter(this.props.queries, (q) => {
          return q.collection === node.type;
        });

        if (queries.length > 0) {
          disabled = false;
        }
      }

      return (
        <li key={'tab' + tabItem.name} className={active}>
          <button className="tab-btn topcoat-button--quiet" disabled={disabled}
            onClick={(e) => this.props.setExtTab(tabItem.name) }>
            {tabItem.name}
          </button>
        </li>
      );
    });

    let tabsContent = tabs.map((tabItem) => {
      let active = this.props.currentExtTab === tabItem.name ? ' active' : '';
      return (
        <div key={'content' + tabItem.name} className={'tab-content' + active}>
          {tabItem.content}
        </div>
      );
    });

    return (
      <div className="info-content-head">
        <nav className="tabs-nav">
          <ul>{tabsButtons}</ul>
        </nav>
        <div className="tabs-container">
          {tabsContent}
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    currentExtTab: state.tabs.currentExtTab,
    queries: state.app.queries
  };
}

export default connect(
  mapStateToProps,
  { }
)(InfoContentHead);
