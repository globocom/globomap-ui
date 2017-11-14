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

/* global localStorage, JSON */

import React from 'react';
import { uiSocket } from './App';
import { traverseItems } from '../utils';
import './css/Tools.css';

class Tools extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }

    this.socket = uiSocket();
    this.key = 'screenshot';
    this.tabs = [{ name: 'Search Results' }, { name: 'Navigation' }];

    this.onRestoreGraph = this.onRestoreGraph.bind(this);
    this.onSaveGraph = this.onSaveGraph.bind(this);
    this.getContent = this.getContent.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.checkNodeExistence = this.checkNodeExistence.bind(this);
  }

  render() {
    let rootNodeHasItens = false;
    if (this.props.stageNodes[0] !== undefined &&
        this.props.stageNodes[0].items.length > 0) {
      rootNodeHasItens = true;
    }

    let tabsButtons = this.tabs.map((tab, index) => {
      let active = this.props.currentTab === tab.name ? ' active' : '';

      return (
        <button key={'tab' + index} className={'tab-btn' + active}
          disabled={tab.name === 'Navigation' && !rootNodeHasItens}
          onClick={(e) => this.props.setCurrentTab( tab.name )}>
          {tab.name}
        </button>
      );
    });

    return (
      <div className={'tools' + (this.props.currentNode ? ' with-info' : '')}>

        <nav className="tools-tabs">
          {tabsButtons}
        </nav>

        <div className="tools-buttons">
          <span className="message">{this.state.message}</span>
          <button className={'btn-save-graph topcoat-button'}
                  onClick={this.onSaveGraph} disabled={!rootNodeHasItens}>
            <i className="fa fa-save"></i>
          </button>
          <button className={'btn-restore-graph topcoat-button'}
                  onClick={this.onRestoreGraph}
                  disabled={(!this.storages || Object.keys(this.storages).length === 0)}>
            <i className="fa fa-folder-open-o"></i>
          </button>
        </div>

      </div>
    );
  }

  getLocalStorage(key) {
    let data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  setLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(error) {
      console.log('localStorage save error,', error);
    }
    return data;
  }

  clearLocalStorage(key) {
    delete this.storages[key];
    this.setLocalStorage(this.key, this.storages);
    this.setState({ message: 'deleted' }, () => {
      this.clearMessage();
      if (Object.keys(this.storages).length === 0) {
        this.props.popMenu.closePopMenu();
        return;
      }
      this.props.popMenu.openPopMenu('Saved searches', this.getContent);
    });
  }

  getContent() {
    return (
      <ul className="content-list">
        {Object.keys(this.storages).map((key, index) => {
          return (
            <li key={index} className="content-item">
              <span  className="content-title" onClick={(e) => {this.applyGraph(e, key)}}>{key}</span>
              <button className="remove-btn" onClick={(e) => {this.onDeleteGraph(e, key)}}
                title="Delete this item">
                <i className="fa fa-close"></i>
              </button>
            </li>
          );
        })}
      </ul>
    )
  }

  equalizeNodes(key, fn) {
    let promises = [];

    traverseItems(this.storages[key], (node) => {
      promises.push(new Promise((resolve) => {
        this.checkNodeExistence(node).then((result) => {
          node.exist = result;
          resolve(this.storages[key]);
        })
      }))
    });

    Promise.all(promises)
      .then((storages) => {
        fn(storages[storages.length - 1]);
      })
  }

  applyGraph(e, key) {
    this.props.popMenu.closePopMenu();
    new Promise((resolve) => {
      this.storages = this.getLocalStorage(this.key) || {};
      resolve()
    }).then(() => {
      this.equalizeNodes(key, (storages) => {
        this.props.info.props.clearCurrent();
        this.props.info.resetByGraph(() => {});
        this.props.setStageNodes(storages);
      })
    })
  }

  clearMessage() {
    if (typeof(this.message) !== 'undefined') {
        window.clearTimeout(this.message);
    }
    this.message = window.setTimeout(function() {
      this.setState({ message: '' });
    }.bind(this), 3000);
  }

  checkNodeExistence(node) {
    return new Promise((resolve) => {
      let params = {
        collection: node._id.split('/')[0],
        id: node._id.split('/')[1]
      };

      resolve(true);

      // this.socket.emit('getnode', params, (data) => {
      //   if (data.error) {
      //     console.log(data.message);
      //     resolve(false);
      //   }
      //   if (Object.keys(data).length === 0) {
      //     console.log('empty collection');
      //     resolve(false);
      //   }
      //   resolve(true);
      // });
    });
  }

  onRestoreGraph() {
    if (!this.storages || Object.keys(this.storages).length === 0) {
      return;
    }

    this.setState({ storages: this.storages }, () => {
      this.props.popMenu.openPopMenu('Saved searches', this.getContent);
    });
  }

  onSaveGraph() {
    let key = '';
    let stageNodes = [];

    if (this.props.stageNodes.length === 0 ||
      this.props.stageNodes[0].items.length === 0) {
      return;
    }

    stageNodes = this.props.stageNodes;
    key = stageNodes[0].type + '/' + stageNodes[0].name;

    traverseItems(stageNodes, (node) => {
      node.exist = true;
    });

    this.storages[key] = stageNodes;
    this.setLocalStorage(this.key, this.storages);
    this.setState({ message: 'saved', storages: this.storages }, () => {
      this.clearMessage();
    });
  }

  onDeleteGraph(event, key) {
    event.preventDefault();
    if (window.confirm('Are you sure to delete this item?')) {
      this.clearLocalStorage(key);
    }
  }

  componentDidMount() {
    this.socket.emit('getEnvironment', (environment) => {
      this.key = 'GSNAP_' + environment;
      this.storages = this.getLocalStorage(this.key) || {};
    });
  }
}

export default Tools;
