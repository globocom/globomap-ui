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

import tippy from 'tippy.js';
import Clipboard from 'clipboard';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  saveSharedMap,
  getSharedMap,
  saveUserMap,
  getUserMap,
  listUserMaps } from '../../redux/modules/stage';
import {
  setFullTab,
  toggleFullTab } from '../../redux/modules/tabs';
import {
  App,
  NodeInfo,
  NodeItem } from '../';
import SubNodes from './SubNodes';
import './Stage.css';

export class Stage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sharedLinkOpen: false,
      showNodeInfo: false,
      nodeInfoNode: null
    };

    this.renderNodes = this.renderNodes.bind(this);
    this.openSharedLink = this.openSharedLink.bind(this);
    this.closeSharedLink = this.closeSharedLink.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.onCloseNodeInfo = this.onCloseNodeInfo.bind(this);
    this.onShowNodeInfo = this.onShowNodeInfo.bind(this);
  }

  onShowNodeInfo(node) {
    this.setState({
      showNodeInfo: true,
      nodeInfoNode: node
    });
  }

  onCloseNodeInfo() {
    this.setState({ showNodeInfo: false });
  }

  renderNodes(nodeList) {
    return nodeList.map((node, i) => {
      return (
        <div key={`n${i}`} className="node-item-group">
          <NodeItem node={node}
                    onShowNodeInfo={() => this.onShowNodeInfo(node)} />
          <div className="node-item-content">
            {node.items.length > 0 ? this.renderNodes(node.items) : ''}
          </div>
        </div>
      );
    });
  }

  saveMap(event) {
    event.preventDefault();
    this.props.saveUserMap(this.props.stageNodes);
    return;
  }

  shareMap(event) {
    event.preventDefault();
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

  componentDidMount() {
    const { sharedMapKey } = this.props;

    if (sharedMapKey) {
      this.props.setFullTab('map');
      this.props.getSharedMap(sharedMapKey);
    }

    document.addEventListener('click', this.handleOutsideClick, false);

    new Clipboard('.btn-clipboard');
    tippy('.stage-tools button', { arrow: true, animation: "fade" });
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
    let sNodes = this.props.stageNodes;

    if (sNodes[0] !== undefined && sNodes[0].items !== undefined &&
        sNodes[0].items.length > 0) {
      rootNodeHasItens = true;
    }

    const noSubnodes = this.props.currentNode ? '' : 'no-subnodes';
    const full = this.props.fullTab ? 'full' : '';

    return (
      <App>
        <div className={`stage ${this.props.className} ${full} ${noSubnodes}`}>

          {this.props.full &&
            <Link to="/" className="btn-close-full">
              <i className="fa fa-arrow-left"></i>
            </Link>}

          <div className="stage-tools" ref={ stageTools => this.stageTools = stageTools }>
            <button className="gmap-btn small tool-btn-left btn-toggle-menu" onClick={this.props.toggleFullTab}
                    data-tippy-content="Esconder/Exibir Menu">
              <i className="fas fa-bars"></i>
            </button>

            <button className="gmap-btn small btn-share-map" onClick={e => this.shareMap(e)}
                    data-tippy-content="Compartilhar este mapa"
                    disabled={!rootNodeHasItens}>
              <i className="fas fa-link"></i>
            </button>

            <button className="gmap-btn small btn-save-map" onClick={e => this.saveMap(e)}
                    data-tippy-content="Salvar este mapa"
                    disabled={!rootNodeHasItens}>
              <i className="fas fa-save"></i>
            </button>

            {this.state.sharedLinkOpen &&
              <div className="shared-link">
                <input type="text" readOnly={true} className="link-url"
                       value={urlToShare} onClick={e => e.target.select()} />
                <button className="btn-clipboard" onClick={() => alert('Copiado!')}
                        data-clipboard-text={urlToShare} disabled={!this.props.latestSharedMapKey}>
                  <i className="fa fa-clipboard"></i> Copiar para o clipboard
                </button>
              </div>}
          </div>

          <div className="stage-container">
            <div className="node-item-content">
              {this.renderNodes(this.props.stageNodes)}
            </div>
          </div>

          <SubNodes />

          {this.state.showNodeInfo &&
            <NodeInfo node={this.state.nodeInfoNode}
                      onClose={this.onCloseNodeInfo} />}
        </div>
      </App>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    fullTab: state.tabs.fullTab,
    ...state.stage
  };
}

export default connect(
  mapStateToProps,
  {
    saveSharedMap,
    getSharedMap,
    saveUserMap,
    getUserMap,
    listUserMaps,
    setFullTab,
    toggleFullTab
  }
)(Stage);
