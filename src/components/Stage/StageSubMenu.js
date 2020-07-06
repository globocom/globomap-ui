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

import tippy from 'tippy.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  resetRedirect,
  clearNotification } from '../../redux/modules/stage';
import './StageSubMenu.css';

export class StageSubMenu extends Component {

  treatRedirect() {
    if (this.props.willRedirect) {
      let willRedirect = this.props.willRedirect;
      this.props.resetRedirect();
      this.props.history.push(willRedirect);
    }
  }

  applyNotificationTippy() {
    if (this.props.notification) {
      let classToApplyTippy = this.props.btnClassName;
      let notificationTransition = 500;
      let notificationDuration = 2000;
      if (document.getElementsByClassName(classToApplyTippy).length > 0) {
        tippy('.' + classToApplyTippy, {
          trigger: 'manual',
          animation: 'scale',
          duration: notificationTransition,
          onShown(instance) {
            (async () => {
              await new Promise(r => setTimeout(r, notificationDuration));
              instance.hide();
            })();
          }
        });
      }
    }
  }

  showNotification() {
    if (this.props.notification) {
      this.applyNotificationTippy();
      let notification = document.getElementsByClassName(
          this.props.btnClassName)[0]._tippy;
      notification.show();
      this.props.clearNotification();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.treatRedirect();
    this.showNotification();
  }

  render() {
    return (
      <div className="stage-sub-menu">
        <input type="text" readOnly={this.props.readOnly} className="link-url"
               value={this.props.value} placeholder={this.props.placeholder}
               onClick={e => e.target.select()}
               onChange={this.props.onChange} />
        <button className={this.props.btnClassName} onClick={this.props.onClick}
               data-tippy-content={this.props.notification}
               data-clipboard-text={this.props.urlToShare} disabled={this.props.buttonDisabled}>
          <i className={this.props.buttonIcon}></i> {this.props.buttonText}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.stage
  };
}

export default connect(
  mapStateToProps,
  {
    resetRedirect,
    clearNotification,
  }
)(StageSubMenu);
