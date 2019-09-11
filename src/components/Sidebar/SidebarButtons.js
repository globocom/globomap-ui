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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  clearNodes,
  clearCurrentNode } from '../../redux/modules/nodes';
import './SidebarButtons.css';

export class SidebarButtons extends Component {

  handleSearch = () => {
    const nodeList = this.props.nodeList;
    const currentTab = this.props.currentTab;
    if (nodeList.length > 0 && currentTab === 'search') {
      this.props.clearNodes();
      this.props.clearCurrentNode();
    }
  }

  render() {
    return (
      <div className="sidebar-buttons">
        <Link to="/">
          <i className="icon fas fa-home"></i> Home
        </Link>

        <Link to="/auto-maps">
          <i className="icon fas fa-project-diagram"></i> Mapas Autom&aacute;ticos
        </Link>

        <Link to="/reports">
          <i className="icon fas fa-print"></i> Relat&oacute;rios
        </Link>

        <Link to="/advanced-search" onClick={() => this.handleSearch()}>
          <i className="icon fas fa-search"></i> Busca Avan&ccedil;ada
        </Link>

        <Link to="/saved-maps">
          <i className="icon fas fa-star"></i> Mapas Salvos
        </Link>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    nodeList: state.nodes.nodeList,
    currentTab: state.tabs.currentTab
  };
}

export default connect(
  mapStateToProps,
  {
    clearNodes,
    clearCurrentNode
  }
)(SidebarButtons);
