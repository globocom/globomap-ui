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
import { setStageNodes } from '../../redux/modules/stage';
import {
  automapFindNodes,
  dnsLookupAutomapFindNodesAndRename,
  automapTraversal,
  automapTraversalQuery,
  automapResetNodes } from '../../redux/modules/automap';
import {
  clearCurrentNode,
  resetSubNodes } from '../../redux/modules/nodes';
import { setTab } from '../../redux/modules/tabs';
import { NodeInfo } from '../';
import './AutoMap.css';

export class AutoMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      q: '',
      kinds: [{ name: 'VIP', collection: 'vip', graph: 'load_balancing', depth: 2, direction: 'any', description: 'Recupera mapas que mostram os hosts relacionados a um VIP.\nDigite pelo menos parte do nome do VIP.', searchby: 'name', type: 'search' },
              { name: 'VIP resolvendo o DNS', collection: 'vip', graph: 'load_balancing', depth: 2, direction: 'any', description: 'Recupera mapas que mostram os hosts relacionados a um VIP.\nDigite um DNS para ser resolvido. Retornaremos os VIPs cujo IP é igual ao IP resolvido.', searchby: 'ip', type: 'search' },
              { name: 'Clientes de uma APP', collection: 'vip', graph: 'load_balancing', depth: 2, direction: 'any', description: 'Recupera mapas que mostram os hosts relacionados a um VIP.\nDigite pelo menos parte do nome do VIP. Retornaremos apenas os VIPs relacionados a APP.', searchby: 'name', type: 'query' }],

      current: null,
      showNodeInfo: false,
      nodeInfoNode: null
    }

    this.handleQChange = this.handleQChange.bind(this);
    this.onCloseNodeInfo = this.onCloseNodeInfo.bind(this);
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

  setCurrentKind(kind) {
    this.setState({ current: kind }, () => {
      this.inputQ.focus();
    });
  }

  findNodes(opts, searchby) {
    let options = {
      collections: [this.state.current.collection]
    }

    opts = Object.assign(options, opts);

    if (searchby === 'ip') {
      this.props.dnsLookupAutomapFindNodesAndRename(opts, this.state.q);
      return;
    }

    this.props.automapFindNodes(opts);

  }

  search() {
    const curr = this.state.current;

    if (!curr) {
      return false;
    }

    if (!curr.searchby || curr.searchby === 'name') {
      this.findNodes({
        queryType: 'name',
        query: this.state.q
      }, curr.searchby);
    } else {
      let query = this.state.q;
      let qProps = [{ 'name': curr.searchby, 'op': '==', 'value': query }];

      this.findNodes({queryProps: qProps}, curr.searchby);
    }
  }

  openMap(event, node) {
    event.preventDefault();
    event.stopPropagation();

    const kind = this.state.current;

    this.props.clearCurrentNode();
    this.props.resetSubNodes();

    if (kind.type === 'query') {
        this.props.automapTraversalQuery({
          node: node,
          graphs: [kind.graph],
          q: 'query_vip_vip_custom_maps',
          v: node._id
        });
    } else {
        this.props.automapTraversal({
          node: node,
          graphs: [kind.graph],
          depth: kind.depth,
          direction: kind.direction
        });
    }
  }

  renderKinds() {
    return this.state.kinds.map(item => {
      return (
        <button key={item.name} className="gmap-btn" onClick={() => this.setCurrentKind(item)}>
          {item.name}
        </button>
      );
    });
  }

  renderDescription() {
    if (!this.state.current) {
      return;
    }
    let descriptionLst = this.state.current.description.split('\n');
    return descriptionLst.map(item => {
      return (
        <p key={item}>{item}</p>
      );
    });

  }

  componentWillUnmount() {
    this.props.automapResetNodes();
  }

  render() {
    const curr = this.state.current;
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
      <div className={`automaps ${this.props.className}`} >
        <h3 className="automaps-title">Custom Maps</h3>

        <div className="automaps-panel automap-kind">
          {this.renderKinds()}
        </div>

        <div className="automaps-panel automap-search">
          <div className="automap-description">{this.renderDescription()}</div>
          <input type="search" name="q" className="gmap-text automap-q" autoComplete="off"
                disabled={!this.state.current}
                value={this.state.q} ref={elem => { this.inputQ = elem; }}
                onChange={_.throttle(this.handleQChange, 300)}
                onKeyPress={e => this.handleEnterKeyPress(e)}
                placeholder={curr ? curr.name : ''} />
          <button className="gmap-btn"
                  onClick={() => this.search()}
                  disabled={!this.state.current}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="automaps-panel automap-content">
          {this.props.automapFindLoading
            ? <div className="content-loading">
                <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
              </div>
            : <ul className="automap-found-nodes">{ automapNodes }</ul>}
        </div>
        {this.state.showNodeInfo &&
          <NodeInfo node={this.state.nodeInfoNode}
                    onClose={this.onCloseNodeInfo}
                    position="right" />}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    hasId: state.app.hasId,
    automapNodeList: state.automap.automapNodeList,
    automapSubNodesList: state.automap.automapSubNodesList,
    automapFindLoading: state.automap.automapFindLoading,
    automapTraversalLoading: state.automap.automapTraversalLoading
  };
}

export default connect(
  mapStateToProps,
  {
    automapFindNodes,
    dnsLookupAutomapFindNodesAndRename,
    automapTraversal,
    automapTraversalQuery,
    automapResetNodes,
    setStageNodes,
    clearCurrentNode,
    resetSubNodes,
    setTab
  }
)(AutoMap);

