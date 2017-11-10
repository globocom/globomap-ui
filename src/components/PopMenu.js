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
import './css/PopMenu.css';

class PopMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: '',
      content: () => {}
    };

    this.openPopMenu = this.openPopMenu.bind(this);
    this.closePopMenu = this.closePopMenu.bind(this);
    // this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  render() {
    return (
      <div className={'popmenu' + (this.state.open ? ' open' : '') + (this.props.currentNode ? ' with-info' : '')}>
        <div className="popmenu-head">
          {this.state.title}
          <button className="close-btn" onClick={this.closePopMenu}>
            <i className="fa fa-close"></i>
          </button>
        </div>
        <div className="popmenu-content">
          {this.state.content()}
        </div>
      </div>
    )
  }

  openPopMenu(title, content) {
    this.setState({ open: true, title: title, content: content });
  }

  closePopMenu() {
    this.setState({ open: false });
  }

  // handleOutsideClick(e) {
  //   if (this.state.open === false) {
  //     return;
  //   }

  //   if (this.popmenu && this.popmenu.contains(e.target)) {
  //     return;
  //   }

  //   this.closePopMenu();
  // }

  // componentDidMount() {
  //   document.addEventListener('click', this.handleOutsideClick, false);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener('click', this.handleOutsideClick, false);
  // }

}

export default PopMenu;
