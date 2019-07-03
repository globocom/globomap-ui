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
import { traversalToStage } from '../../utils';
import { setStageNodes } from '../../redux/modules/stage';
import {
  automapFindNodes,
  dnsLookupAutomapFindNodes,
  automapTraversalSearch,
  automapResetNodes } from '../../redux/modules/automap';
import { setTab } from '../../redux/modules/tabs';
import './AutoMap.css';

export class AutoMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      q: '',
      kinds: [{ name: 'VIP', collection: 'vip', graph: 'load_balancing', depth: 2, direction: 'any', searchby: 'name' },
              { name: 'VIP by resolving DNS', collection: 'vip', graph: 'load_balancing', depth: 2, direction: 'any', searchby: 'ip' }],

      current: null,
      selected: null
    }

    this.handleQChange = this.handleQChange.bind(this);
  }

  handleQChange(event) {
    const value = event.target.value.trim();
    this.setState({ q: value });
  }

  handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search();
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
      this.props.dnsLookupAutomapFindNodes(opts);
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

  showAutoMap(event, node) {
    event.preventDefault();
    const kind = this.state.current;

    this.props.automapTraversalSearch({
      node: node,
      graphs: [kind.graph],
      depth: kind.depth,
      direction: kind.direction
    });

    this.setState({ selected: node });
  }

  buildMap(event) {
    event.stopPropagation();
    const newMap = traversalToStage(this.props.automapSubNodesList, 'type');
    this.props.setStageNodes(newMap);
    this.props.setTab('map');
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

  componentWillUnmount() {
    this.props.automapResetNodes();
  }

  render() {
    const curr = this.state.current;
    const selected = this.state.selected;
    const tLoading = this.props.automapTraversalLoading;

    const automapNodes = this.props.automapNodeList.map((node, i) => {
      let itemCls = '';
      if (selected && selected._id === node._id) {
        itemCls = 'selected';
      }
      return (
        <li key={`${i}-${node._id}`} className={itemCls}>
          <a href={`#${node._id}`} onClick={e => this.showAutoMap(e, node)}>
            { node.name }
          </a>
          <button className="btn-build-map gmap-btn sm-size"
                  onClick={e => this.buildMap(e)}
                  disabled={ tLoading }>
            {tLoading
              ? <span><i className="fa fa-sync-alt fa-spin fa-fw"></i></span>
              : 'Build Custom Map'}
          </button>
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
    dnsLookupAutomapFindNodes,
    automapTraversalSearch,
    automapResetNodes,
    setStageNodes,
    setTab
  }
)(AutoMap);

