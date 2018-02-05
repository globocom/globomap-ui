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
import { connect } from 'react-redux';
import { setStageNodes } from '../../redux/modules/stage';
import { clearCurrentNode, resetSubNodes } from '../../redux/modules/nodes';
import { setMainTab } from '../../redux/modules/tabs';
import { traverseItems } from '../../utils';
import './Tools.css';

class Tools extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      savedOpen: false
    }
    this.tabs = [{ name: 'Search Results' }, { name: 'Navigation' }];
    this.onRestoreGraph = this.onRestoreGraph.bind(this);
    this.onSaveGraph = this.onSaveGraph.bind(this);
    this.getContent = this.getContent.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.openSaved = this.openSaved.bind(this);
    this.closeSaved = this.closeSaved.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  getLocalStorage(key) {
    const data = localStorage.getItem(key);
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
        return this.closeSaved();
      }
      this.openSaved();
    });
  }

  getContent() {
    return (
      <ul className="content-list">
        {Object.keys(this.storages).map((key, index) => {
          return (
            <li key={index} className="content-item">
              <span  className="content-title"
                     onClick={e => this.applyGraph(e, key)}>{key}</span>
              <button className="remove-btn"
                      onClick={e => this.onDeleteGraph(e, key)}
                      title="Delete this item">
                <i className="fa fa-times"></i>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  applyGraph(e, key) {
    this.closeSaved();

    new Promise((resolve) => {
      this.storages = this.getLocalStorage(this.key) || {};
      resolve();
    }).then(() => {
        this.props.clearCurrentNode();
        this.props.resetSubNodes();
        // this.props.resetGraphsCollections();
        this.props.setStageNodes(this.storages[key])
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

  onRestoreGraph() {
    if (!this.storages || Object.keys(this.storages).length === 0) {
      return;
    }

    if (this.state.savedOpen) {
      return this.closeSaved();
    }

    this.setState({ storages: this.storages }, () => {
      this.openSaved();
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

  openSaved() {
    this.setState({ savedOpen: true });
  }

  closeSaved() {
    this.setState({ savedOpen: false });
  }

  handleOutsideClick(e) {
    if (this.tools && this.tools.contains(e.target)) {
      return;
    }
    this.closeSaved();
  }

  componentDidMount() {
    this.key = 'GSNAP_' + this.props.environ.toUpperCase();
    this.storages = this.getLocalStorage(this.key) || {};
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  render() {
    let rootNodeHasItens = false;
    if (this.props.stageNodes[0] !== undefined &&
        this.props.stageNodes[0].items.length > 0) {
      rootNodeHasItens = true;
    }

    const tabsButtons = this.tabs.map((tab, index) => {
      let active = this.props.currentMainTab === tab.name ? ' active' : '';
      return (
        <button key={'tab' + index} className={'tab-btn' + active}
          // disabled={tab.name === 'Navigation' && !rootNodeHasItens}
          onClick={(e) => this.props.setMainTab( tab.name )}>
          {tab.name}
        </button>
      );
    });

    return (
      <div className="tools" ref={ tools => this.tools = tools }>
        <nav className="tools-tabs">
          {tabsButtons}
        </nav>

        <div className="tools-buttons">
          <span className="message">{this.state.message}</span>
          <button className="btn btn-save-graph"
                  onClick={this.onSaveGraph} disabled={!rootNodeHasItens}>
            <i className="fa fa-save"></i>
          </button>
          <button className="btn btn-restore-graph"
                  onClick={this.onRestoreGraph}
                  disabled={(!this.storages || Object.keys(this.storages).length === 0)}>
            <i className="fa fa-star"></i>
          </button>
        </div>

        {this.state.savedOpen &&
          <div className="saved">
            <div className="saved-head">
              Saved searches
              <button className="close-btn" onClick={this.closeSaved}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="saved-content">
              {this.getContent()}
            </div>
          </div>}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    stageNodes: state.stage.stageNodes,
    currentMainTab: state.tabs.currentMainTab,
    environ: state.app.environ
  };
}

export default connect(
  mapStateToProps,
  { setStageNodes, clearCurrentNode, resetSubNodes,
    setMainTab }
)(Tools);
