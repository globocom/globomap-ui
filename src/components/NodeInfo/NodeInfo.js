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

import _ from "lodash";
import React from 'react';
import { connect } from 'react-redux';
import { clearCurrentNode } from '../../redux/modules/nodes';
import { Properties, Monit, Query } from '../';
import './NodeInfo.css';

class NodeInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'Properties',
      show: false
    }
  }

  setTab(event, tabName) {
    event.stopPropagation();
    this.setState({ tab: tabName });
  }

  onClose(event) {
    event.stopPropagation();
    return this.props.onClose
            ? this.props.onClose()
            : this.props.clearCurrentNode();
  }

  render() {
    if (!this.props.node)
      return null;

    const node = this.props.node;
    const tabs = [{ name: 'Properties', content: <Properties item={node} /> },
                  { name: 'Monitoring', content: <Monit node={node} /> },
                  { name: 'Reports', content: <Query node={node} /> }];

    const tabsButtons = tabs.map(tabItem => {
      const active = this.state.tab === tabItem.name ? ' active' : '';
      let disabled = false;

      // if (tabItem.name === 'Monitoring' && !['comp_unit', 'zabbix_graph'].includes(node.type)) {
      //   disabled = true;
      // }

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
        <li key={`tab-${tabItem.name}`} className={active}>
          <button className="tab-btn" disabled={disabled}
            onClick={e => this.setTab(e, tabItem.name)}>
            {tabItem.name}
          </button>
        </li>
      );
    });

    const tabsContent = tabs.map(tabItem => {
      const active = this.state.tab === tabItem.name ? ' active' : '';
      return (
        <div key={'content' + tabItem.name} className={'tab-content' + active}>
          {tabItem.content}
        </div>
      );
    });

    let nodeType = node.type;
    if (this.props.namedCollections !== undefined)
      nodeType = this.props.namedCollections[node.type].alias;

    const position = this.props.position ? this.props.position : 'right';
    return (
      <div className={`node-info-box ${position}`}>
        <div className="title">
          <span className="type">{nodeType}</span>
          <span className="name">{node.name}</span>
          <button className="close-btn" onClick={e => this.onClose(e)}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <ul className="tabs">
          {tabsButtons}
        </ul>
        <div className="tabs-content">
          {tabsContent}
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    hasId: state.app.hasId,
    queries: state.app.queries,
    namedCollections: state.app.namedCollections
  };
}

export default connect(
  mapStateToProps,
  { clearCurrentNode }
)(NodeInfo);
