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
  copySharedMap,
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
import StageSubMenu from './StageSubMenu';
import { uuid } from '../../utils';
import './Stage.css';

export class Stage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      subMenuOpen: '',
      showNodeInfo: false,
      nodeInfoNode: null,
      mapName: ''
    };

    this.renderNodes = this.renderNodes.bind(this);
    this.openSharedLink = this.openSharedLink.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.onCloseNodeInfo = this.onCloseNodeInfo.bind(this);
    this.onShowNodeInfo = this.onShowNodeInfo.bind(this);
    this.handleMapNameChange = this.handleMapNameChange.bind(this);
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

  copySharedMap(event) {
    event.preventDefault();
    this.props.copySharedMap();
    return;
  }

  saveMap(event, mapName) {
    event.preventDefault();
    this.props.saveUserMap(this.props.stageNodes, mapName, this.state.mapKey);
    return;
  }

  saveMapCopy(event, mapName) {
    event.preventDefault();
    this.props.saveUserMap(this.props.stageNodes, mapName, uuid());
    return;
  }

  saveMapForm(event) {
    event.preventDefault();
    if (this.state.subMenuOpen !== 'saveMap') {
      this.openSaveMapForm();
      return;
    }
    this.closeSubMenu();
  }

  openSaveMapForm() {
    this.setState({ subMenuOpen: 'saveMap' });
  }

  saveMapCopyForm(event) {
    event.preventDefault();
    if (this.state.subMenuOpen !== 'saveMapCopy') {
      this.openSaveMapCopyForm();
      return;
    }
    this.closeSubMenu();
  }

  openSaveMapCopyForm() {
    this.setState({ subMenuOpen: 'saveMapCopy' });
  }

  handleMapNameChange(event) {
    let target = event.target;
    this.setState({ "mapName": target.value });
  }

  shareMap(event) {
    event.preventDefault();
    if (this.state.subMenuOpen !== 'sharedLink') {
      this.openSharedLink();
      this.props.saveSharedMap(this.props.stageNodes);
      return;
    }
    this.closeSubMenu();
  }

  openSharedLink() {
    this.setState({ subMenuOpen: 'sharedLink' });
  }

  closeSubMenu() {
    this.setState({ subMenuOpen: '' });
  }

  handleOutsideClick(e) {
    if (this.stageTools && this.stageTools.contains(e.target)) {
      return;
    }
    this.closeSubMenu()
  }

  componentDidMount() {
    const { mapKey } = this.props.match.params;

    if (mapKey) {
      this.props.setFullTab('map');
      this.props.getSharedMap(mapKey);
    }

    document.addEventListener('click', this.handleOutsideClick, false);

    new Clipboard('.btn-clipboard');
    tippy('.stage-tools button', { arrow: true, animation: "fade" });

    if (this.props.mapName) {
      this.setState({ "mapName": this.props.mapName });
    }
    if (this.props.mapKey) {
      this.setState({ "mapKey": this.props.mapKey });
    }
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

            <button className="gmap-btn small btn-save-map" onClick={e => this.saveMapForm(e)}
                    data-tippy-content="Salvar este mapa"
                    disabled={!rootNodeHasItens}>
              <i className="fas fa-save"></i>
            </button>

            <button className="gmap-btn small btn-save-copy-map" onClick={e => this.saveMapCopyForm(e)}
                    data-tippy-content="Salvar cópia deste mapa"
                    disabled={!rootNodeHasItens}>
              <i class="fas fa-copy"></i>
            </button>

            {this.state.subMenuOpen === 'sharedLink' &&
              <StageSubMenu readOnly={true}
                            value={urlToShare}
                            btnClassName='btn-clipboard'
                            onClick={e => this.copySharedMap(e)}
                            urlToShare={urlToShare}
                            disabled={!this.props.latestSharedMapKey}
                            buttonIcon="fa fa-clipboard"
                            buttonText="Copiar para o clipboard" />}

            {this.state.subMenuOpen === 'saveMap' &&
              <StageSubMenu readOnly={false}
                            value={this.state.mapName}
                            placeholder="Nome"
                            onChange={this.handleMapNameChange}
                            btnClassName='btn-save'
                            onClick={e => this.saveMap(e, this.state.mapName)}
                            disabled={!rootNodeHasItens}
                            buttonIcon="fas fa-save"
                            buttonText="Salvar Mapa" />}

            {this.state.subMenuOpen === 'saveMapCopy' &&
              <StageSubMenu readOnly={false}
                            value={this.state.mapName}
                            placeholder="Nome"
                            onChange={this.handleMapNameChange}
                            btnClassName='btn-save-copy'
                            onClick={e => this.saveMapCopy(e, this.state.mapName)}
                            disabled={!rootNodeHasItens}
                            buttonIcon="fas fa-save"
                            buttonText="Salvar Cópia" />}
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
    copySharedMap,
    getUserMap,
    listUserMaps,
    setFullTab,
    toggleFullTab
  }
)(Stage);
