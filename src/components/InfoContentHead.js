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

import React, { Component } from 'react';
import { uiSocket } from './App';
import Monit from './Monit';
import Properties from './Properties';
import Modal from './Modal';
import './css/InfoContentHead.css';

class InfoContentHead extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();
    this.state = {
      currentTab: 'Properties',
      modalVisible: false,
      modalContent: null
    }

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    let tabs = [{ name: 'Properties', content: <Properties key="properties-info"
                                                           item={this.props.node}
                                                           hasId={this.props.hasId} /> },
                { name: 'Monitoring', content: <Monit node={this.props.node} /> }];

    let tabsButtons = tabs.map((tabItem) => {
      let active = this.state.currentTab === tabItem.name ? ' active' : '',
          disabled = tabItem.name === 'Monitoring' && this.props.node.type !== 'comp_unit';

      return (<li key={'tab' + tabItem.name} className={active}>
                <button className="tab-btn topcoat-button--quiet" disabled={disabled}
                  onClick={(e) => this.setState({ currentTab: tabItem.name })}>
                  {tabItem.name}
                </button>
              </li>);
    });

    let tabsContent = tabs.map((tabItem) => {
      let active = this.state.currentTab === tabItem.name ? ' active' : '';
      return (<div key={'content' + tabItem.name} className={'tab-content' + active}>
                {tabItem.content}
              </div>);
    });

    let zbxGraphButton = (
      <button className="topcoat-button--cta" onClick={(e) => this.openZbxGraph(e)}>
        <i className="fa fa-bar-chart"></i>
      </button>
    );

    return (<div className="info-content-head">
              <nav className="tabs-nav">
                <ul>{tabsButtons}</ul>
              </nav>
              <div className="plugins-buttons">
                {this.props.node.type === 'zabbix_graph' &&
                  zbxGraphButton}
              </div>
              <div className="tabs-container">
                {tabsContent}
              </div>
              <Modal visible={this.state.modalVisible}
                     content={this.state.modalContent}
                     closeModal={this.closeModal} />
            </div>);
  }

  openZbxGraph(event) {
    let data = { graphId: this.props.node.id };
    this.showModal(null);
    this.socket.emit('getZabbixGraph', data, (base64data) => {
      if (base64data.error) {
        console.log(base64data.message);
        this.closeModal();
        return;
      }
      let imgData = 'data:image/png;base64,' + base64data.toString();
      this.setState({ modalContent: <img src={imgData} alt={this.props.node.name} /> });
    });
  }

  showModal(content) {
    this.setState({ modalContent: content, modalVisible: true });
  }

  closeModal() {
    this.setState({ modalContent: '', modalVisible: false });
  }

  componentWillReceiveProps(nextProps){
    let current = this.props.node,
        next = nextProps.node;

    if(current._id !== next._id) {
      this.setState({ currentTab: 'Properties' });
    }
  }
}

export default InfoContentHead;
