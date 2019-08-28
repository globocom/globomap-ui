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
import { closeModal } from '../../redux/modules/app';
import './Tour.css';

export class Tour extends React.Component {

  onCloseTour(event) {
    event.stopPropagation();
    this.props.closeModal();
    console.log('on close tour');
  }

  render() {
    return (
      <div className="tour">

        <div className="base-panel">
          <h3 className="base-panel-title">O que &eacute; o Globomap</h3>
          <button className="base-panel-close-btn" onClick={e => this.onCloseTour(e)}>
            <i className="fas fa-times"></i>
          </button>

          <div className="base-panel-content tour-content">
            <span className="tour-left">Bem vindo ao Globomap</span>
            <div className="tour-right">
              Uma breve introdução aos seus principais conceitos e sessões:
              <ul>
                <li>Mapas Automáticos</li>
                <li>Relatórios</li>
                <li>Busca Avançada</li>
              </ul>
            </div>
          </div>

          <div className="base-panel-footer">
            <button className="gmap-btn">
              Next <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
  };
}

export default connect(
  mapStateToProps,
  {
    closeModal
  }
)(Tour);

