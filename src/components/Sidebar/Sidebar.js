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

import React from 'react';
import { connect } from 'react-redux';
import SidebarButtons from './SidebarButtons';
import User from './User';
import './Sidebar.css';

class Sidebar extends React.Component {

  render() {
    return (
      <section className="sidebar">
        <div className="sidebar-logo">
          <img src="/images/logo_white.png" alt="globomap" />
        </div>
        <SidebarButtons />
        <User />
      </section>
    );
  }

}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  {}
)(Sidebar);
