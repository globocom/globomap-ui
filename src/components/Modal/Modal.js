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
import './Modal.css';

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    }
  }

  render() {
    return this.props.visible
            ? <div className="modal" onClick={(e) => this.props.closeModal()}>
                <button className="close-modal-btn topcoat-button--quiet"
                  onClick={(e) => this.props.closeModal()}>
                  <i className="fa fa-times"></i>
                </button>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  {this.props.content !== null
                    ? this.props.content
                    : <i className="modal-loading fa fa-cog fa-spin fa-2x fa-fw"></i>}
                </div>
              </div>
            : null
  }
}

export default Modal;
