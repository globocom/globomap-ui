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
  automapTraversalSearch,
  automapResetNodes } from '../../redux/modules/automap';
import { setTab } from '../../redux/modules/tabs';
import './AutoMap.css';

export class AutoMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      q: '',
      kinds: [{ name: 'VIP', collection: 'vip', graph: 'load_balancing', depth: 2, direction: 'any' }],
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

  search() {
    const curr = this.state.current;

    if (!curr) {
      return false;
    }

    this.props.automapFindNodes({
      collections: [curr.collection],
      queryType: 'name',
      query: this.state.q
    });
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
    const newMap = traversalToStage(this.props.automapSubNodesList);
    this.props.setStageNodes(newMap);
    this.props.setTab('map');
  }

  renderKinds() {
    return this.state.kinds.map(item => {
      return (
        <button key={item.name} onClick={() => this.setCurrentKind(item)}>
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

    const automapNodes = this.props.automapNodeList.map((node, i) => {
      return (
        <li key={`${i}-${node._id}`}>
          <a href={`#${node._id}`} onClick={e => this.showAutoMap(e, node)}>
            { node.name }
          </a>
        </li>
      )
    });

    return (
      <div className="automaps">
        <h3 className="automaps-title">Custom Maps</h3>

        <div className="automaps-panel automap-kind">
          {this.renderKinds()}
        </div>

        <div className="automaps-panel automap-search">
          <input type="search" name="q" className="automap-q" autoComplete="off" disabled={!this.state.current}
                      value={this.state.q} ref={elem => { this.inputQ = elem; }}
                      onChange={_.throttle(this.handleQChange, 300)}
                      onKeyPress={e => this.handleEnterKeyPress(e)}
                      placeholder={curr ? curr.name : ''} />
          <button onClick={() => this.search()} disabled={!this.state.current}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="automaps-panel automap-content">
          {this.props.automapFindLoading
            ? <div><i className="ui-loading-cog fa fa-cog fa-spin fa-3x fa-fw"></i></div>
            : <ul>{ automapNodes }</ul>}

          {selected &&
            <div className="selected-node">
              <span className="selected-name">{ selected.name }</span>
              <button className="btn-build-map" onClick={e => this.buildMap(e)}>
                {this.props.automapTraversalLoading
                  ? <i className="ui-loading-cog fa fa-cog fa-spin fa-1x fa-fw"></i>
                  : 'Build Custom Map'}
              </button>
            </div>}
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
    automapTraversalSearch,
    automapResetNodes,
    setStageNodes,
    setTab
  }
)(AutoMap);

