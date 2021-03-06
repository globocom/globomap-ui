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
import { Loading } from '../';
import {
  showModal,
  closeModal } from '../../redux/modules/app';
import {
  getZabbixMonitoring,
  getZabbixGraph } from '../../redux/modules/plugins';
import './Monit.css';

export class Monit extends Component {
  monitItems = ['comp_unit', 'zabbix_graph'];

  getIcon(val) {
    return parseInt(val, 10) !== 0
            ? <i className="fa fa-times"></i>
            : <i className="fa fa-check"></i>;
  }

  openZbxGraph(event) {
    event.stopPropagation();

    const node = this.props.node;
    if (!node) {
      return;
    }

    this.props.showModal(<img src={`data:image/png;base64,${this.props.zbxGraph}`}
                              alt={node.name} />);
  }

  componentDidUpdate(prevProps) {
    const prev = prevProps.node;
    const current = this.props.node;

    if(!this.monitItems.includes(current.type)) {
      return;
    }

    if(prev._id !== current._id) {
      if (prev.type === 'comp_unit') {
        this.props.getZabbixMonitoring(current);
      }

      if (prev.type === 'zabbix_graph') {
        this.props.getZabbixGraph(current);
      }
    }
  }

  componentDidMount() {
    const node = this.props.node;

    if(!this.monitItems.includes(node.type)) {
      return;
    }

    if (node.type === 'comp_unit') {
      this.props.getZabbixMonitoring(node);
    }

    if (node.type === 'zabbix_graph') {
      this.props.getZabbixGraph(node);
    }
  }

  render() {
    if (!this.props.node) {
      return null;
    }

    let node = this.props.node,
        triggers = [],
        zbxGraphButton = '';

    if (node.type === 'comp_unit') {
      triggers = this.props.zbxTriggers.map((trigger) => {
        return (
          <tr key={trigger.properties.triggerid}>
            <th>{trigger.key}</th>
            <td className={'trigger-' + trigger.value}>
              {this.getIcon(trigger.value)}
            </td>
          </tr>
        );
      });

      if (triggers.length === 0) {
        triggers = [<tr key={1}><th className="trigger-not-found"></th></tr>];
      }
    }

    if (node.type === 'zabbix_graph') {
      zbxGraphButton = (
        <button className="gmap-btn small" onClick={(e) => this.openZbxGraph(e)}>
          <i className="fa fa-chart-bar"></i>&nbsp;Show Zabbix Graph
        </button>
      );
    }

    return (
      <div className="monit">
        <div className="monit-buttons">
          { zbxGraphButton }
        </div>
        <table>
          <tbody>{ triggers }</tbody>
        </table>
        <Loading iconSize="medium"
                 isLoading={ this.props.zbxMonitLoading ||
                             this.props.zbxGraphLoading } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    zbxMonitLoading: state.plugins.zbxMonitLoading,
    zbxGraphLoading: state.plugins.zbxGraphLoading,
    zbxTriggers: state.plugins.zbxTriggers,
    zbxGraph: state.plugins.zbxGraph
  };
}

export default connect(
  mapStateToProps,
  {
    getZabbixMonitoring,
    getZabbixGraph,
    showModal,
    closeModal
  }
)(Monit);
