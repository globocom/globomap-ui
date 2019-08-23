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
import React from 'react';
import { connect } from 'react-redux';
import {
  fetchGraphs,
  fetchCollections,
  fetchEdges,
  fetchQueries,
  getServerData,
  toggleHasId } from '../../redux/modules/app';
import {
  clearCurrentNode,
  resetSubNodes } from '../../redux/modules/nodes';
import {
  Home,
  AutoMap,
  Favorites,
  Modal,
  Reports,
  Sidebar,
  Search,
  Stage,
  Loading,
  TabContent } from '../';
import './App.css';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.clearCurrentNode();
      this.props.resetSubNodes();
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
  }

  render() {
    return (
      <div className="main">
        <Sidebar />

        <TabContent tabKey="home"><Home /></TabContent>
        <TabContent tabKey="automap"><AutoMap /></TabContent>
        <TabContent tabKey="reports"><Reports /></TabContent>
        <TabContent tabKey="search"><Search /></TabContent>
        <TabContent tabKey="map">
          <Stage sharedMapKey={this.props.match.params.mapKey} />
        </TabContent>
        <TabContent tabKey="favorites"><Favorites /></TabContent>

        <Loading iconSize="big"
                 isLoading={this.props.findLoading
                            || this.props.traversalLoading
                            || this.props.getSharedLoading
                            || this.props.saveUserMapLoading
                            || this.props.getUserMapLoading
                            || this.props.saveSharedLoading
                            || this.props.automapTraversalLoading} />
        <Modal />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    findLoading: state.nodes.findLoading,
    traversalLoading: state.nodes.traversalLoading,
    getSharedLoading: state.stage.getSharedLoading,
    saveUserMapLoading: state.stage.saveUserMapLoading,
    getUserMapLoading: state.stage.getUserMapLoading,
    saveSharedLoading: state.stage.saveSharedLoading,
    automapTraversalLoading: state.automap.automapTraversalLoading
  };
}

export default connect(
  mapStateToProps,
  {
    fetchGraphs,
    fetchCollections,
    fetchEdges,
    fetchQueries,
    getServerData,
    clearCurrentNode,
    resetSubNodes,
    toggleHasId
  }
)(App);
