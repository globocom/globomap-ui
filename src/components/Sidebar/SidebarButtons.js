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
import { setTab } from '../../redux/modules/tabs';
import { Tab } from '../';
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
        <Tab tabKey="search">
          <button onClick={() => this.handleSearch()}>
            <i className="fa fa-search"></i>
          </button>
        </Tab>
        <Tab tabKey="map">
          <button>
            <i className="fa fa-sitemap"></i>
          </button>
        </Tab>
        <Tab tabKey="reports">
          <button>
            <i className="fa fa-print"></i>
          </button>
        </Tab>
        <Tab tabKey="automap">
          <button>
            <i className="fas fa-project-diagram"></i>
          </button>
        </Tab>
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
    setTab,
    clearNodes,
    clearCurrentNode
  }
)(SidebarButtons);
