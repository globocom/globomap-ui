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

import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../redux/modules/app';
import { Loading } from '../';
import './Modal.css';

class Modal extends React.Component {
  render() {
    return this.props.modalVisible
      ? <div className="modal" onClick={(e) => this.props.closeModal()}>
          <button className="close-modal-btn topcoat-button--quiet"
            onClick={(e) => this.props.closeModal()}>
            <i className="fa fa-times"></i>
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Loading isLoading={this.props.modalContent === null} iconSize="big" />
            {this.props.modalContent}
          </div>
        </div>
      : null
  }
}

function mapStateToProps(state) {
  return {
    modalVisible: state.app.modalVisible,
    modalContent: state.app.modalContent
  };
}

export default connect(
  mapStateToProps,
  { closeModal }
)(Modal);
