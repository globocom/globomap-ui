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

import axios from 'axios';
import React, { Component } from 'react';
import { host } from '../../config'
import './NodeItemHealthcheck.css';

export class NodeItemHealthcheck extends Component {

  constructor(props) {
    super(props);

    // plugin name that this component is enabled for
    this.pluginName = 'healthcheck';

    this.state = {
      result: null
    };

    this.isEnabled = this.isEnabled.bind(this);
  }

  isEnabled() {
    const plugins = this.props.plugins;

    for (let i=0, l=plugins.length; i<l; i++) {
      if (plugins[i].name === this.pluginName) {
        return true;
      }
    }

    return false;
  }

  getNodeParameters(parameters=[]) {
    const nodeProps = this.props.node.properties;
    let params = {};

    parameters.forEach(param => {
      if (Object.keys(nodeProps).includes(param)) {
        params[param] = nodeProps[param];
      }
    })

    return params;
  }

  getHealthcheckStatus() {
    const plugin = this.props.plugins.filter(p => {
      return p.name === this.pluginName;
    })[0];

    if (plugin) {
      const params = this.getNodeParameters(plugin.parameters);
      axios.post(`${host}/api/plugins/${this.pluginName}`, { data: params })
        .then(res => {
          this.setState({ result: res.data.healthcheck });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    this.getHealthcheckStatus();
  }

  render() {
    if (!this.isEnabled()) {
      return null;
    }

    const result = this.state.result;
    const icons = {
      success: 'fa-check',
      warning: 'fa-exclamation',
      failed: 'fa-times',
      nothing: 'fa-question'
    }

    return (
      <div className={`node-item-hc ${result && 'active'}`}>
        {!result && <div className="hc-load"></div>}
        <div className={`hc-result ${result ? result : ''}`}>
          <i className={`hc-icon fa ${icons[result]}`}></i>
        </div>
      </div>
    );
  }

}

export default NodeItemHealthcheck;
