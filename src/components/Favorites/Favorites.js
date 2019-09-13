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

import React from 'react';
import { connect } from 'react-redux';
import {
  listUserMaps,
  deleteUserMap,
  getUserMap,
  setStageNodes } from '../../redux/modules/stage';
import {
  clearCurrentNode,
  resetSubNodes } from '../../redux/modules/nodes';
import { sortByName } from '../../utils';
import { App } from '../';
import './Favorites.css';

export class Favorites extends React.Component {

  componentDidMount() {
    this.props.listUserMaps();
  }

  applyGraph(event, content) {
    event.stopPropagation();
    this.props.clearCurrentNode();
    this.props.resetSubNodes();
    this.props.setStageNodes(content);
    this.props.history.push('/map');
  }

  onDeleteGraph(event, key) {
    event.stopPropagation();
    if (window.confirm('Are you sure to delete this item?')) {
      this.props.deleteUserMap(key);
    }
  }

  renderUserMaps() {
    if (this.props.userMaps.length === 0) {
      return (
        <ul className="user-map-list">
          <li className="user-map-item no-content">No map saved yet</li>
        </ul>
      );
    }

    const uMaps = sortByName(this.props.userMaps);
    return (
      <ul className="user-map-list">
        {uMaps.map(item => {
          return (
            <li key={item.key} className="user-map-item"
                onClick={e => this.applyGraph(e, item.content)}>
              <span  className="user-map-item-title">{item.name}</span>
              <button className="user-map-item-remove-btn"
                      onClick={e => this.onDeleteGraph(e, item.key)}
                      title="Delete this item">
                <i className="fa fa-trash"></i>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <App>
        <div className={`favorites base-content ${this.props.className || ''}`}>

          <div className="base-content-header">
            <h3 className="base-content-title">
              Mapas Salvos
            </h3>
          </div>

          <div className="base-panel">
            {this.renderUserMaps()}
          </div>

        </div>
      </App>
    );
  }

}

function mapStateToProps(state) {
  return {
    hasId: state.app.hasId,
    userMaps: state.stage.userMaps
  };
}

export default connect(
  mapStateToProps,
  {
    clearCurrentNode,
    listUserMaps,
    deleteUserMap,
    getUserMap,
    resetSubNodes,
    setStageNodes
  }
)(Favorites);

