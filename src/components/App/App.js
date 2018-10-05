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

import _ from "lodash";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGraphs, fetchCollections, fetchEdges,
         fetchQueries, getServerData, toggleHasId } from '../../redux/modules/app';
import { clearCurrentNode } from '../../redux/modules/nodes';
import { Header, Modal, SearchContent, Stage,
         SubNodes, Tools } from '../';
// import { socketClient } from '../../';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.clearCurrentNode();
    }
  };

  componentDidMount() {
    this.props.fetchGraphs();
    this.props.fetchCollections();
    this.props.fetchEdges();
    this.props.fetchQueries();
    this.props.getServerData();
    document.addEventListener('keydown', _.throttle(this.handleKeyDown, 100));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    // socketClient.disconnect();
  }

  render() {
    return (
      <div className="main">
        <span className="has-id"
              onDoubleClick={this.props.toggleHasId}>&nbsp;</span>

        <Header />
        <Tools />

        {/*<Tabs>
          <Tab name="Search Results">
            <SearchContent />
          </Tab>
          <Tab name="Navigation">
            <Stage />
          </Tab>
        </Tabs>*/}

        <div className="tabs-container">
          <div className={'tab-content' + (this.props.currentMainTab === 'Search Results' ? ' active' : '')}>
            <SearchContent />
          </div>
          <div className={'tab-content' + (this.props.currentMainTab === 'Navigation' ? ' active' : '')}>
            <Stage sharedMapKey={this.props.match.params.mapKey} />
          </div>
        </div>

        <SubNodes />
        <Modal />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    currentMainTab: state.tabs.currentMainTab
  };
}

export default connect(
  mapStateToProps,
  { fetchGraphs, fetchCollections, fetchEdges,
    fetchQueries, getServerData, clearCurrentNode,
    toggleHasId }
)(App);
