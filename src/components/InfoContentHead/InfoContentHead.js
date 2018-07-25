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
import { uiSocket } from '../../utils';
import { showModal, closeModal } from '../../redux/modules/app';
import { setExtTab } from '../../redux/modules/tabs';
import { Properties, Monit, Query } from '../';
import './InfoContentHead.css';

class InfoContentHead extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();
  }

  openZbxGraph(event) {
    const node = this.props.currentNode;
    if (!node) {
      return;
    }
    this.props.showModal(null);
    this.socket.emit('getZabbixGraph', { graphId: node.id }, (base64data) => {
      if (base64data.error) {
        console.log(base64data.message);
        this.props.closeModal();
        return;
      }
      this.props.showModal(<img src={`data:image/png;base64,${base64data.toString()}`}
                                alt={node.name} />);
    });
  }

  render() {
    const node = this.props.currentNode;
    if (!node) {
      return null;
    }

    let tabs = [{ name: 'Properties', content: <Properties key="properties-info" item={node} /> },
                { name: 'Monitoring', content: <Monit node={node} /> },
                { name: 'Queries', content: <Query /> }];

    let tabsButtons = tabs.map((tabItem) => {
      let active = this.props.currentExtTab === tabItem.name ? ' active' : '';
      let disabled = false;

      if (tabItem.name === 'Monitoring' && node.type !== 'comp_unit') {
        disabled = true;
      }

      if (tabItem.name === 'Queries') {
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

    let zbxGraphButton = (
      <button className="topcoat-button--cta" onClick={(e) => this.openZbxGraph(e)}>
        <i className="fa fa-bar-chart"></i>
      </button>
    );

    return (
      <div className="info-content-head">
        <nav className="tabs-nav">
          <ul>{tabsButtons}</ul>
        </nav>
        <div className="plugins-buttons">
          {node.type === 'zabbix_graph' &&
            zbxGraphButton}
        </div>
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
  { showModal, closeModal, setExtTab }
)(InfoContentHead);
