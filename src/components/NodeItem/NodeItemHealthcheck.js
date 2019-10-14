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

    // plugin name that this component is enabled
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

  getHealthcheckStatus() {
    const plugin = this.props.plugins.filter(p => {
      return p.name === this.pluginName;
    })[0];

    if (plugin) {
      // axios.post(`${host}/api/plugins/${this.pluginName}`, { params: params });
      console.log('check status');
    }
  }

  async componentDidUpdate() {
    this.getHealthcheckStatus();
  }

  render() {
    if (!this.isEnabled()) {
      return null;
    }

    return (
      <div className="node-item-hc active">
        <div className="hc-result"></div>
      </div>
    );
  }

}

export default NodeItemHealthcheck;
