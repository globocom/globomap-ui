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
import update from "immutability-helper";
import './css/Properties.css';
import { TextInput } from "./controls/Text";
import { FormCloseButton, FormPlusButton } from "./controls/Button";
import { PlusIcon, CloseIcon } from "./controls/icon";

class Properties extends Component {

  updateChartData(newData) {
    this.props.setStateNode(update(this.props.node, {data: newData}));
  }

  _changeCommon = (event) => {
    let key = event.target.attributes.name.nodeValue;
    let value = event.target.value;
    this.setState({
      [key]: value
    })
    // this.updateChartData({[key]: {$set: value}});
  }

  _handlePointAdd = () => {
    // let serieKey = this.state.serieKey + this.serieKeyInterval;
    // this.setState({serieKey});

    let newItemData = {name: "", value: ""};
    this.updateChartData({$push: [newItemData]});
  }

  renderData() {
    return this.props.node.data.map(function(data, index) {
      return (
        <div key={"key-value" + index} className="key-value">
          <TextInput
            key="key"
            name="key"
            className="key"
            placeholder="Chave"
            onChange={this._changeCommon}
            defaultValue={data.name} />
          <TextInput
            key="value"
            name="value"
            className="value"
            placeholder="Valor"
            onChange={this._changeCommon}
            defaultValue={data.value} />
        </div>
      )
    }, this)
  }

  render() {
    return (
      <div className="data">
        {this.renderData()}
        <div className="add">
          <FormPlusButton
            name="handlePointAdd"
            onClick={this._handlePointAdd}>
            <PlusIcon /> adicionar
          </FormPlusButton>
        </div>
      </div>
    )
  }
}

export default Properties;
