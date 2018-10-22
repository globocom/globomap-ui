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
import { connect } from 'react-redux';
import { Loading } from '../';
import { getZabbixMonitoring,
         getZabbixGraph } from '../../redux/modules/plugins';
import './Monit.css';

class Monit extends Component {
  monitItems = ['comp_unit'];

  getIcon(val) {
    return parseInt(val, 10) !== 0
            ? <i className="fa fa-times"></i>
            : <i className="fa fa-check"></i>;
  }

  // fetchMonitData(node) {
  //   this.setState({ loading: true, triggers: [] }, () => {
  //     this.socket.emit('getmonitoring', node, (data) => {
  //       if (data.error) {
  //         console.log(data.message);
  //         return this.setState({ loading: false, triggers: [] });
  //       }
  //       return this.setState({ loading: false, triggers: data });
  //     });
  //   });
  // }

  componentWillReceiveProps(nextProps){
    const next = nextProps.node;
    const current = this.props.node;

    if(!this.monitItems.includes(next.type)) {
      return;
    }

    if(current._id !== next._id) {
      // this.fetchMonitData(next);
      this.props.getZabbixMonitoring(next);
    }
  }

  componentDidMount() {
    const node = this.props.node;

    if(!this.monitItems.includes(node.type)) {
      return;
    }

    // this.fetchMonitData(node);
    this.props.getZabbixMonitoring(node);
  }

  render() {
    if(this.props.node.type === 'comp_unit'){
      let props = this.state.zbxTriggers.map((trigger, i) => {
        return (
          <tr key={trigger.properties.triggerid}>
            <th>{trigger.key}</th>
            <td className={'trigger-' + trigger.value}>
              {this.getIcon(trigger.value)}
            </td>
          </tr>
        );
      });

      if(props.length === 0) {
        props = [<tr key={1}><th className="trigger-not-found"></th></tr>];
      }

      return (
        <div className="monit">
          <table>
            <tbody>{props}</tbody>
          </table>
          <Loading isLoading={this.state.loading} iconSize="medium" />
        </div>
      );
    }

    return null;
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
  { getZabbixMonitoring, getZabbixGraph }
)(Monit);
