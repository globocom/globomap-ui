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

import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { host } from '../../config'
import './User.css';

export class User extends Component {

  logout() {
    axios.get(`${host}/logout`)
      .then(resp => {
        if (resp.status === 200) {
          return window.location.href = `${resp.data.logout}?client_id=${resp.data.client}&redirect_uri=${window.location.origin}/`;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const uInfo = this.props.serverData.userInfo;
    let picture, email;

    if (uInfo !== undefined) {
      ({picture, email} = uInfo);
    }

    return (
      <div className="sidebar-user">
        <div className="user-avatar">
          <img src={picture} alt={email} />
        </div>
        <div className="sidebar-logout">
          <button className="gmap-btn no-bg user-logout" onClick={() => this.logout()}>
            Logout <i className="fa fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    serverData: state.app.serverData
  };
}

export default connect(
  mapStateToProps,
  {}
)(User);
