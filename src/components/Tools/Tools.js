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

/* global localStorage, JSON */

import React from 'react';
import { connect } from 'react-redux';
import { setStageNodes, getUserMap,
         deleteUserMap, listUserMaps } from '../../redux/modules/stage';
import { clearCurrentNode, resetSubNodes } from '../../redux/modules/nodes';
import { setMainTab } from '../../redux/modules/tabs';
import { Loading } from '../';
import { sortByName } from '../../utils';
import './Tools.css';

class Tools extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      savedOpen: false
    }

    this.tabs = [{ name: 'Search Results' }, { name: 'Navigation' }];
    // this.onRestoreGraph = this.onRestoreGraph.bind(this);
    // this.onSaveGraph = this.onSaveGraph.bind(this);
    this.renderUserMaps = this.renderUserMaps.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.toggleSaved = this.toggleSaved.bind(this);
    this.closeSaved = this.closeSaved.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  // getLocalStorage(key) {
  //   const data = localStorage.getItem(key);
  //   if (data) {
  //     return JSON.parse(data);
  //   }
  //   return null;
  // }

  // setLocalStorage(key, data) {
  //   try {
  //     localStorage.setItem(key, JSON.stringify(data));
  //   } catch(error) {
  //     console.log('localStorage save error,', error);
  //   }
  //   return data;
  // }

  // clearLocalStorage(key) {
  //   delete this.storages[key];
  //   this.setLocalStorage(this.key, this.storages);
  //   this.setState({ message: 'deleted' }, () => {
  //     this.clearMessage();
  //     if (Object.keys(this.storages).length === 0) {
  //       return this.closeSaved();
  //     }
  //     this.openSaved();
  //   });
  // }

  applyGraph(event, content) {
    // const items = this.props.userMaps[key].content;

    this.closeSaved();
    this.props.clearCurrentNode();
    this.props.resetSubNodes();
    this.props.setStageNodes(content);

    // this.props.getUserMap(key);

    // new Promise((resolve) => {
    //   this.storages = this.getLocalStorage(this.key) || {};
    //   resolve();
    // }).then(() => {
    //     this.props.clearCurrentNode();
    //     this.props.resetSubNodes();
    //     // this.props.resetGraphsCollections();
    //     this.props.setStageNodes(this.storages[key])
    // });
  }

  clearMessage() {
    if (typeof(this.message) !== 'undefined') {
        window.clearTimeout(this.message);
    }
    this.message = window.setTimeout(function() {
      this.setState({ message: '' });
    }.bind(this), 3000);
  }

  // onRestoreGraph() {
  //   if (!this.storages || Object.keys(this.storages).length === 0) {
  //     return;
  //   }

  //   if (this.state.savedOpen) {
  //     return this.closeSaved();
  //   }

  //   this.setState({ storages: this.storages }, () => {
  //     this.openSaved();
  //   });
  // }

  // onSaveGraph() {
  //   let key = '';
  //   let stageNodes = [];

  //   if (this.props.stageNodes.length === 0 ||
  //     this.props.stageNodes[0].items.length === 0) {
  //     return;
  //   }

  //   stageNodes = this.props.stageNodes;
  //   key = stageNodes[0].type + '/' + stageNodes[0].name;

  //   traverseItems(stageNodes, (node) => {
  //     node.exist = true;
  //   });

  //   this.storages[key] = stageNodes;
  //   this.setLocalStorage(this.key, this.storages);
  //   this.setState({ message: 'saved', storages: this.storages }, () => {
  //     this.clearMessage();
  //   });
  // }

  onDeleteGraph(event, key) {
    event.stopPropagation();
    if (window.confirm('Are you sure to delete this item?')) {
      // this.clearLocalStorage(key);
      this.props.deleteUserMap(key);
    }
  }

  toggleSaved() {
    this.setState({ savedOpen: !this.state.savedOpen });
  }

  closeSaved() {
    this.setState({ savedOpen: false });
  }

  renderUserMaps() {
    if (this.props.userMaps.length === 0) {
      return (
        <ul className="content-list">
          <li className="no-content-item">No map saved yet</li>
        </ul>
      );
    }

    const uMaps = sortByName(this.props.userMaps);
    return (
      <ul className="content-list">
        {uMaps.map((item) => {
          return (
            <li key={item.key} className="content-item"
                onClick={e => this.applyGraph(e, item.content)}>
              <span  className="content-title">{item.name}</span>
              <button className="remove-btn"
                      onClick={e => this.onDeleteGraph(e, item.key)}
                      title="Delete this item">
                <i className="fa fa-times"></i>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  handleOutsideClick(e) {
    if (this.tools && this.tools.contains(e.target)) {
      return;
    }
    this.closeSaved();
  }

  componentWillMount() {
    this.props.listUserMaps();
  }

  componentDidMount() {
    // this.key = 'GSNAP_' + this.props.environ.toUpperCase();
    // this.storages = this.getLocalStorage(this.key) || {};
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
          disabled={tab.name === 'Navigation' && !rootNodeHasItens}
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
          {/* <button className="btn btn-save-graph topcoat-button"
                  onClick={this.onSaveGraph} disabled={!rootNodeHasItens}>
            <i className="fa fa-save"></i> Save map
          </button> */}
          <button className="btn btn-restore-graph topcoat-button"
                  onClick={this.toggleSaved}>
            Show saved <i className="fa fa-caret-down"></i>
          </button>
        </div>

        {this.state.savedOpen &&
          <div className="saved">
            <div className="saved-content">
              {this.renderUserMaps()}
            </div>
            <Loading iconSize="medium"
                     isLoading={ this.props.saveUserMapLoading ||
                                 this.props.deleteUserMapLoading } />
          </div>}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    stageNodes: state.stage.stageNodes,
    userMaps: state.stage.userMaps,
    latestUserMapKey: state.stage.latestUserMapKey,
    saveUserMapLoading: state.stage.saveUserMapLoading,
    deleteUserMapLoading: state.stage.deleteUserMapLoading,
    currentMainTab: state.tabs.currentMainTab,
    serverData: state.app.serverData
  };
}

export default connect(
  mapStateToProps,
  { setStageNodes, clearCurrentNode, resetSubNodes,
    setMainTab, getUserMap, deleteUserMap,
    listUserMaps }
)(Tools);
