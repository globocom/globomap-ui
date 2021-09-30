/*
Copyright 2019 Globo.com

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

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {
  setStageNodes,
  setMapName,
  setMapKey,
  cleanStageNodes } from '../../redux/modules/stage';
import {
  setCurrentKind,
  automapFindNodes,
  dnsLookupAutomapFindNodesAndRename,
  automapTraversal,
  automapTraversalQuery,
  automapResetNodes } from '../../redux/modules/automap';
import {
  clearCurrentNode,
  resetSubNodes } from '../../redux/modules/nodes';
import {
  App,
  NodeInfo } from '../';
import './AutoMap.css';

export class AutoMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      q: '',
      kinds: [
        {
          name: 'VIP',
          collection: 'vip',
          graph: ['load_balancing'],
          max_depth: 2,
          direction: 'any',
          description: 'Recupera mapas que mostram os hosts relacionados a um VIP.\nDigite pelo menos parte do nome do VIP.',
          map_name: (root_node) => {return 'Hosts de ' + root_node},
          searchby: 'name',
          type: 'search'
        },
        {
          name: 'VIP resolvendo o DNS',
          collection: 'vip',
          graph: ['load_balancing'],
          max_depth: 2,
          direction: 'any',
          description: 'Recupera mapas que mostram os hosts relacionados a um VIP.\nDigite um DNS para ser resolvido. Retornaremos os VIPs cujo IP é igual ao IP resolvido.',
          map_name: (root_node) => {return 'Hosts de ' + root_node},
          searchby: 'ip',
          type: 'search'
        },
        {
          name: 'Clientes de uma APP',
          collection: 'dns',
          graph: ['load_balancing'],
          max_depth: 2,
          direction: 'any',
          description: 'Recupera mapas que mostram as APPs que dependem uma dada APP.\nDigite pelo menos parte do nome do DNS. Retornaremos apenas os VIPs relacionados à APP.',
          map_name: (root_node) => {return 'Clientes de ' + root_node},
          searchby: 'name',
          type: 'query',
          query: 'query_vip_access_vip_custom_maps'
        },
        {
          name: 'Dependências de uma APP',
          collection: 'dns',
          graph: ['load_balancing'],
          max_depth: 2,
          direction: 'any',
          description: 'Recupera mapas que mostram as APPs das quais uma dada APP depende.\nDigite pelo menos parte do nome do DNS. Retornaremos apenas os VIPs relacionados à APP.',
          map_name: (root_node) => {return 'Dependências de ' + root_node},
          searchby: 'name',
          type: 'query',
          query: 'query_vip_vip_custom_maps'
        },
        {
          name: 'Hosts Físicos de um VIP',
          collection: 'vip',
          graph: ['physical_host'],
          max_depth: 3,
          direction: 'any',
          description: 'Recupera mapas que mostram os Hosts Físicos relacionados a um VIP.\nDigite um VIP.',
          map_name: (root_node) => {return 'Hosts de ' + root_node},
          searchby: 'name',
          type: 'search'
        },
        {
          name: 'VIPs de um Host Físico',
          collection: 'comp_unit',
          graph: ['physical_host'],
          max_depth: 3,
          direction: 'any',
          description: 'Recupera mapas que mostram os VIPs relacionados a um Host Físico.\nDigite um Host Físico.',
          map_name: (root_node) => {return 'Vips de ' + root_node},
          searchby: 'name',
          type: 'search'
        }
      ],
      showNodeInfo: false,
      nodeInfoNode: null
    }

    this.handleQChange = this.handleQChange.bind(this);
    this.onCloseNodeInfo = this.onCloseNodeInfo.bind(this);
    this.openMap = this.openMap.bind(this);

    window.ga('set', 'page', '/auto-maps');
    window.ga('send', 'pageview');
  }

  onToggleNodeInfo(event, node) {
    event.stopPropagation();
    this.setState({
      showNodeInfo: true,
      nodeInfoNode: node
    });
  }

  onCloseNodeInfo() {
    this.setState({ showNodeInfo: false });
  }

  handleQChange(event) {
    const value = event.target.value.trim();
    this.setState({ q: value });
  }

  handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search();
      document.activeElement.blur();
    }
  }

  setCurrent(kind) {
    this.props.setCurrentKind(kind);
    this.inputQ.focus();
  }

  findNodes(opts, searchby) {
    let options = {
      collections: [this.props.currentKind.collection]
    }

    opts = Object.assign(options, opts);

    if (searchby === 'ip') {
      this.props.dnsLookupAutomapFindNodesAndRename(opts, this.state.q);
      return;
    }

    this.props.automapFindNodes(opts);
  }

  search() {
    const currentKind = this.props.currentKind;

    if (!currentKind) {
      return false;
    }

    if (!currentKind.searchby || currentKind.searchby === 'name') {
      this.findNodes({
        queryType: 'name',
        query: this.state.q
      }, currentKind.searchby);
    } else {
      let query = this.state.q;
      let qProps = [{ 'name': currentKind.searchby, 'op': '==', 'value': query }];

      this.findNodes({queryProps: qProps}, currentKind.searchby);
    }
  }

  openMap(event, node) {
    event.preventDefault();
    event.stopPropagation();

    const kind = this.props.currentKind;

    this.props.clearCurrentNode();
    this.props.resetSubNodes();
    this.props.cleanStageNodes();
    this.props.setMapName(kind.map_name(node.name));
    this.props.setMapKey('');

    if (kind.type === 'query') {
      this.props.automapTraversalQuery({
        q: kind.query,
        v: node._id,
        type: kind.collection
      });
    } else {
      this.props.automapTraversal({
        node: node,
        graphs: kind.graph,
        max_depth: kind.max_depth,
        direction: kind.direction
      });
    }

    this.props.history.push('/map');
  }

  renderKinds() {
    return this.state.kinds.map(item => {
      return (
        <button key={item.name} className="gmap-btn" onClick={() => this.setCurrent(item)}>
          {item.name}
        </button>
      );
    });
  }

  renderDescription() {
    const currentKind = this.props.currentKind;

    if (!currentKind) {
      return;
    }

    let descriptionLst = currentKind.description.split('\n');
    return descriptionLst.map(item => {
      return (
        <p key={item}>{item}</p>
      );
    });

  }

  render() {
    const currentKind = this.props.currentKind;
    const automapNodes = this.props.automapNodeList.map((node, i) => {
      let itemCls = '';

      return (
        <li key={`${i}-${node._id}`} className={itemCls}>
          <div className="row-tools">
            <button onClick={e => this.onToggleNodeInfo(e, node)}
                    className={this.state.showNodeInfo ? 'active' : ''}
                    data-tippy-content="Show Info">
              <i className="icon fa fa-info" />
            </button>
            <button onClick={e => this.openMap(e, node)}>
              <i className="icon fa fa-sitemap" />
            </button>
          </div>
          <a href={`#${node._id}`} onClick={e => this.openMap(e, node)}>
            { node.shownName || node.name }
          </a>
        </li>
      )
    });

    return (
      <App>
        <div className={`automaps base-content ${this.props.className || ''}`}>
          <div className="base-content-header">
            <h2 className="base-content-title">Mapas Autom&aacute;ticos</h2>
          </div>

          <div className="base-panel automaps-panel automap-kind">
            {this.renderKinds()}
          </div>

          <div className="base-panel automaps-panel automap-search">
            <div className="automap-description">{this.renderDescription()}</div>

            <input type="search" name="q" className="gmap-text automap-q" autoComplete="off"
                  disabled={!currentKind}
                  value={this.state.q} ref={elem => { this.inputQ = elem; }}
                  onChange={_.throttle(this.handleQChange, 300)}
                  onKeyPress={e => this.handleEnterKeyPress(e)}
                  placeholder={currentKind ? currentKind.name : ''} />

            <button className="gmap-btn"
                    onClick={() => this.search()}
                    disabled={!currentKind}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="base-panel automaps-panel automap-content">
            {this.props.automapFindLoading
              ? <div className="content-loading">
                  <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
                </div>
              : <ul className="automap-found-nodes">{ automapNodes }</ul>}
          </div>
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
    hasId: state.app.hasId,
    currentKind: state.automap.currentKind,
    automapNodeList: state.automap.automapNodeList,
    automapSubNodesList: state.automap.automapSubNodesList,
    automapFindLoading: state.automap.automapFindLoading,
    automapTraversalLoading: state.automap.automapTraversalLoading
  };
}

export default connect(
  mapStateToProps,
  {
    setCurrentKind,
    automapFindNodes,
    dnsLookupAutomapFindNodesAndRename,
    automapTraversal,
    automapTraversalQuery,
    automapResetNodes,
    setStageNodes,
    setMapName,
    setMapKey,
    cleanStageNodes,
    clearCurrentNode,
    resetSubNodes
  }
)(AutoMap);
