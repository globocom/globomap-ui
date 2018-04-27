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

import Clipboard from 'clipboard';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveSharedMap, getSharedMap, saveUserMap,
         getUserMap, listUserMaps } from '../../redux/modules/stage';
import { setMainTab } from '../../redux/modules/tabs';
import { NodeItem } from '../';
import { Loading } from '../';
import './Stage.css';

class Stage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fullScreen: false,
      sharedLinkOpen: false
    };

    this.renderNodes = this.renderNodes.bind(this);
    this.saveMap = this.saveMap.bind(this);
    this.shareMap = this.shareMap.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.openSharedLink = this.openSharedLink.bind(this);
    this.closeSharedLink = this.closeSharedLink.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    new Clipboard('.btn-clipboard');
  }

  renderNodes(nodeList) {
    return nodeList.map((node, i) => {
      return (
        <div key={`n${i}`} className="node-item-group">
          <NodeItem node={node} />
          <div className="node-item-content">
            {node.items.length > 0 ? this.renderNodes(node.items) : ''}
          </div>
        </div>
      );
    });
  }

  hasMinimumStageNodes(sNodes) {
    let sItems = [];
    if(sNodes.length > 0) {
      sItems = sNodes[0].items;
    }
    return sItems.length > 0;
  }

  saveMap() {
    this.props.saveUserMap(this.props.stageNodes);
    return;
  }

  shareMap() {
    if (!this.state.sharedLinkOpen) {
      this.openSharedLink();
      this.props.saveSharedMap(this.props.stageNodes);
      return;
    }
    this.closeSharedLink();
  }

  openSharedLink() {
    this.setState({ sharedLinkOpen: true });
  }

  closeSharedLink() {
    this.setState({ sharedLinkOpen: false });
  }

  handleOutsideClick(e) {
    if (this.stageTools && this.stageTools.contains(e.target)) {
      return;
    }
    this.closeSharedLink();
  }

  toggleFullScreen() {
    this.setState({ fullScreen: !this.state.fullScreen });
  }

  componentWillReceiveProps(nextProps) {
    if (this.hasMinimumStageNodes(nextProps.stageNodes)) {
      this.props.setMainTab('Navigation');
    }
  }

  componentDidMount() {
    const { sharedMapKey } = this.props;
    if (sharedMapKey) {
      this.props.setMainTab('Navigation');
      this.toggleFullScreen();
      this.props.getSharedMap(sharedMapKey);
    }
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  render() {
    const { protocol, host } = window.location;
    const urlToShare = this.props.latestSharedMapKey
                       ? `${protocol}//${host}/map/${this.props.latestSharedMapKey}`
                       : '';

    let rootNodeHasItens = false;
    if (this.props.stageNodes[0] !== undefined &&
        this.props.stageNodes[0].items.length > 0) {
      rootNodeHasItens = true;
    }

    return (
      <div className={`stage${this.state.fullScreen ? ' full' : ''}`}>
        <div className="stage-tools" ref={ stageTools => this.stageTools = stageTools }>
          <button className="btn btn-save-map" onClick={this.saveMap}
                  disabled={!rootNodeHasItens}>
            <i className="fa fa-save"></i>
          </button>

          <button className="btn btn-share-map" onClick={this.shareMap}
                  disabled={!rootNodeHasItens}>
            <i className="fa fa-link"></i>
          </button>

          {this.state.sharedLinkOpen &&
            <div className="shared-link">
              <input type="text" readOnly={true} className="link-url topcoat-text-input--large"
                     value={urlToShare} onClick={e => e.target.select()} />
              <button className="btn-clipboard topcoat-button--large"
                      data-clipboard-text={urlToShare} disabled={!this.props.latestSharedMapKey}>
                <i className="fa fa-clipboard"></i> Copy to clipboard
              </button>
              <Loading isLoading={this.props.saveSharedLoading} iconSize="medium" />
            </div>}

          <button className="btn btn-fullscreen" onClick={this.toggleFullScreen}>
            {this.state.fullScreen
              ? <i className="fa fa-compress"></i>
              : <i className="fa fa-expand"></i>}
          </button>
        </div>
        <div className="stage-container">
          {this.renderNodes(this.props.stageNodes)}
        </div>
        <Loading iconSize="big"
                 isLoading={this.props.getSharedLoading
                            || this.props.saveUserMapLoading
                            || this.props.getUserMapLoading} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    ...state.stage
  };
}

export default connect(
  mapStateToProps,
  { setMainTab, saveSharedMap, getSharedMap,
    saveUserMap, getUserMap, listUserMaps }
)(Stage);
