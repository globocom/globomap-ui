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

import _ from "lodash";
import tippy from 'tippy.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Stickyfill from 'stickyfill';
import {
  traversalSearch,
  resetSubNodes,
  setCurrentNode } from '../../redux/modules/nodes';
import {
  removeStageNode,
  setStageNodes } from '../../redux/modules/stage';
import { NodeEdges } from '../';
import NodeItemHealthcheck from './NodeItemHealthcheck';
import './NodeItem.css';

export class NodeItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pluginsFiltered: false,
      pluginsLoaded: false,
      nodePlugins: []
    };

    this.ref = React.createRef();

    this.onItemSelect = this.onItemSelect.bind(this);
    this.onSelfRemove = this.onSelfRemove.bind(this);
    this.filterPlugins = this.filterPlugins.bind(this);
    this.stickyfill = Stickyfill();
  }

  onItemSelect(event) {
    if (!this.props.currentNode) {
      this.props.traversalSearch({ node: this.props.node });
      this.props.setCurrentNode(this.props.node);
      return;
    }

    if (this.props.currentNode._id !== this.props.node._id) {
      this.props.traversalSearch({ node: this.props.node });
    }

    this.props.setCurrentNode(this.props.node);
  }

  onNodeInfo(event) {
    event.stopPropagation();
    this.props.onShowNodeInfo();
  }

  onSelfRemove(event) {
    event.stopPropagation();
    this.props.removeStageNode(this.props.node);

    if (this.props.currentNode === null) {
      return;
    }

    if (this.props.currentNode.uuid === this.props.node.uuid) {
      this.props.resetSubNodes();
    }
  }

  filterPlugins() {
    if (this.state.pluginsFiltered) {
      return;
    }

    const plugins = this.props.plugins;
    if (!plugins) {
      return;
    }

    let nodePlugins = [];
    for (let i=0, l=plugins.length; i<l; i++) {
      const plugin = plugins[i];
      if (plugin.types.includes(this.props.node.type)) {
        nodePlugins.push(plugin);
      }
    }

    this.setState({
      pluginsFiltered: true,
      nodePlugins: nodePlugins
    });
  }

  addPluginsObserver() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 1 && !this.state.pluginsLoaded) {
          this.setState({ pluginsLoaded: true });
        }
      }, { root: null, rootMargin: '0px', threshold: 1.0 }
    )

    if (this.ref.current) {
      observer.observe(this.ref.current)
    }
  }

  componentDidMount() {
    let element = document.getElementsByClassName('sticky');
    this.stickyfill.add(element);
    tippy('.btn-with-tip', { arrow: true, animation: "fade" });

    this.addPluginsObserver()
    this.filterPlugins();
  }

  componentDidUmount() {
    this.setState({ pluginsLoaded: false });
  }

  render() {
    let { _id, name, type, edges, uuid, id } = this.props.node;
    let cNode = this.props.currentNode,
        current = cNode && _id === cNode._id ? ' current' : '',
        thisnode = cNode && uuid === cNode.uuid ? ' this-node' : '',
        exist = this.props.node.exist === undefined ? true : this.props.node.exist,
        disabled = !exist ? ' disabled' : '';

    let nodeType = type;
    if (this.props.namedCollections !== undefined
        && this.props.namedCollections[type] !== undefined) {
      nodeType = this.props.namedCollections[type].alias;
    }

    return (
      <div key={this.props.node.id}
           className={'node-item' + disabled + current + thisnode}
           onClick={exist && _.debounce(this.onItemSelect, 100, true)}>

        <div className="node-info sticky">
          <span className="type">{nodeType}</span>
          <span ref={this.ref} className="name">{name}</span>
          {this.props.hasId && <span>{id}</span>}
        </div>

        <NodeEdges edges={edges} position={'left'} />

        <div className="node-item-tools">
          <button className="btn-with-tip show-node-info-btn"
                  onClick={e => this.onNodeInfo(e)}
                  data-tippy-content="Mostrar Propriedades">
            <i className="fa fa-info-circle"></i>
          </button>
          {!this.props.node.root &&
            <button className="btn-with-tip close-node-btn"
                    onClick={this.onSelfRemove}
                    data-tippy-content="Remover este item">
              <i className="fa fa-times-circle"></i>
            </button>}
        </div>

        {this.state.pluginsLoaded &&
          <NodeItemHealthcheck  node={this.props.node}
                                plugins={this.state.nodePlugins} />}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentNode: state.nodes.currentNode,
    stageNodes: state.stage.stageNodes,
    hasId: state.app.hasId,
    namedCollections: state.app.namedCollections,
    plugins: state.plugins.plugins
  };
}

export default connect(
  mapStateToProps,
  {
    setCurrentNode,
    removeStageNode,
    resetSubNodes,
    setStageNodes,
    traversalSearch
  }
)(NodeItem);
