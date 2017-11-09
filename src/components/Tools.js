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
import './css/Tools.css';

class Tools extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
    this.socket = uiSocket();
    this.key = 'screenshot';
    this.onRestoreGraph = this.onRestoreGraph.bind(this);
    this.onSaveGraph = this.onSaveGraph.bind(this);
    this.getContent = this.getContent.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.checkNodeExistence = this.checkNodeExistence.bind(this);
  }

  componentDidMount() {
    this.storages = this.getLocalStorage(this.key) || {};
  }

  getLocalStorage(key) {
    let data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    else {
      return null;
    }
  }

  setLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(error) {
      console.log('Erro ao tentar salvar o grafico no localStorage,', error);
    }
    return data;
  }

  clearLocalStorage(key) {
    delete this.storages[key];
    this.setLocalStorage(this.key, this.storages);
    this.setState({ message: 'Apagado.' }, () => {
      this.clearMessage();
      if (Object.keys(this.storages).length === 0) {
        this.props.popMenu.closePopMenu();
        return;
      }
      this.props.popMenu.openPopMenu('Consultas salvas', this.getContent);
    });
  }

  getContent() {
    return (
      <ul className="content-list">
        {Object.keys(this.storages).map((key, index) => {
          return (
            <li key={index} className="content-item">
              <span  className="content-title" onClick={(e) => {this.applyGraph(e, key)}}>{key}</span>
              <button className="remove-search-btn"
                      onClick={() => {this.clearLocalStorage(key)}}>
                <i className="fa fa-close"></i>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  equalizeNodes(key, fn) {
    let items = this.storages[key];
    let length = items.length;
    let promises = [];

    let equalizeNodes = () => {
      items.forEach((item) => {
        promises.push(new Promise((resolve) => {
          this.checkNodeExistence(item).then((result) => {
            item.exist = result;
            resolve(this.storages[key]);
          })
        }))
      })

      items = items[0].items;
      length = items.length;
    };

    while (length > 0) {
      equalizeNodes();
    }

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
      let params = {};
      let collection = node._id.split('/')[0];
      let id = node._id.split('/')[1];

      params['collection'] = collection;
      params['id'] = id;

      this.socket.emit('getnode', params, (data) => {
        if (data.error) {
          console.log(data.message);
          resolve(false);
        }
        if (Object.keys(data).length === 0) {
          console.log('empty collection');
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  onRestoreGraph() {
    if (!this.storages || Object.keys(this.storages).length === 0) {
      return;
    }

    this.setState({ storages: this.storages }, () => {
      this.props.popMenu.openPopMenu('Consultas salvas', this.getContent);
    });
  }

  onSaveGraph() {
    let key = '';
    let stageNodes = [];
    let items = [];
    let length = 0;

    if (this.props.stageNodes.length === 0 ||
      this.props.stageNodes[0].items.length === 0) {
      return;
    }

    stageNodes = this.props.stageNodes;
    key = stageNodes[0].type + '/' + stageNodes[0].name;
    items = stageNodes;
    length = items.length;

    while (length > 0) {
      items.forEach((item) => {
        item.exist = true;
      });

      items = items[0].items;
      length = items.length;
    }

    this.storages[key] = stageNodes;
    this.setLocalStorage(this.key, this.storages);
    this.setState({
      message: 'Salvo.',
      storages: this.storages
    }, () => {
      this.clearMessage();
    });
  }

  render() {
    return (
      <div className={'tools' + (this.props.currentNode ? ' with-info' : '')}>
        <span className="message">{this.state.message}</span>
        <button className={'btn-save-graph topcoat-button'}
                onClick={this.onSaveGraph}
                disabled={(this.props.stageNodes.length === 0 ||
                this.props.stageNodes[0].items.length === 0 ? 'disabled' : '')}>
          <i className="fa fa-save"></i>
        </button>
        <button className={'btn-restore-graph topcoat-button'}
                onClick={this.onRestoreGraph}
                disabled={(!this.storages ||
                Object.keys(this.storages).length === 0 ? 'disabled' : '')}>
          <i className="fa fa-folder-open-o"></i>
        </button>
      </div>
    );
  }
}

export default Tools;
