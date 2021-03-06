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

import React from 'react';
import { connect } from 'react-redux';
import {
  registerTab,
  setTab } from '../../redux/modules/tabs';

export class Tab extends React.Component {

  componentDidMount() {
    this.props.registerTab(this.props.tabKey);
  }

  render() {
    return React.Children.map(this.props.children, child => {
      const cls = this.props.currentTab === this.props.tabKey
                    ? `${child.props.className || ''} active`
                    : child.props.className || ''

      return React.cloneElement(child, {
        className:  cls,
        onClick: () => this.props.setTab(this.props.tabKey)
      });
    });
  }

}

function mapStateToProps(state) {
  return {
    currentTab: state.tabs.currentTab
  };
}

export default connect(
  mapStateToProps,
  {
    registerTab,
    setTab
  }
)(Tab);
