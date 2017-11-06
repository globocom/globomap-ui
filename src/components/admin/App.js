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
import './css/App.css';
import { TextInputGroup } from "./controls/Text";
import Properties from "./Properties"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      node: {
        name: "",
        data: [{
          name: "",
          value: ""
        }]
      }
    };
  }

  setStateNode = (data) => {
    let newState = {};
    newState["node"] = data;
    this.setState(newState);
  }

  _changeCommon = (event) => {
    let key = event.target.attributes.name.nodeValue;
    let value = event.target.value;
    this.setState({
      [key]: value
    })
    // this.updateChartData({[key]: {$set: value}});
  }

  render() {
    return (
      <div className="main">
        <header className="main-header">
          <div className="header-group">
            <span className="logo">
              globo<span className="logo-map">map</span>
            </span>
          </div>
        </header>
        <div className={'admin-content'}>
          <div className="admin-content-top"></div>

          <div className="admin-content-middle">
            <TextInputGroup
              key="name"
              name="name"
              label="Nome"
              placeholder="Nome"
              onChange={this._changeCommon}
              defaultValue={this.state.node.name}
              />
            <Properties node={this.state.node} setStateNode={this.setStateNode} />
          </div>

          <div className="admin-content-base"></div>
        </div>
      </div>
    );
  }
}

export default App;
