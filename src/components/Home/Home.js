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
import { Link } from 'react-router-dom';
import {
  App,
  Tour } from '../';
import './Home.css';

export class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}

    window.ga('set', 'page', '/');
    window.ga('send', 'pageview');
  }

  render() {
    return (
      <App>
        <div className={`home base-content ext ${this.props.className}`}>
          <div className="base-content-header">
            <h2 className="base-content-title">
              Globomap
              <span className="subtitle">Recursos e seus relacionamentos em um s&oacute; lugar</span>
            </h2>
            <div className="fancy-img">
              <img src="images/undraw_software_engineer_lvl5.svg" alt="Map" />
            </div>
          </div>

          <div className="base-panel home-widget">
            <h3 className="base-panel-title">Mapas autom&aacute;ticos</h3>

            <div className="base-panel-content">
              Realize buscas pré-definidas de recursos e obtenha um mapa automático.
            </div>

            <div className="base-panel-footer">
              <Link to="/auto-maps" className="gmap-btn">
                <i className="icon fas fa-project-diagram"></i> Mapas Autom&aacute;ticos
              </Link>
            </div>
          </div>

          <div className="base-panel home-widget">
            <h3 className="base-panel-title">Relat&oacute;rios</h3>

            <div className="base-panel-content">
              Assim como os mapas automáticos, os relatórios também são buscas pré-definidas, mas o retorno é textual e somente com as informações necessárias.
            </div>

            <div className="base-panel-footer">
              <Link to="/reports" className="gmap-btn">
                <i className="icon fas fa-print"></i> Relat&oacute;rios
              </Link>
            </div>
          </div>

          <div className="base-panel home-widget full">
            <h3 className="base-panel-title">Busca Avan&ccedil;ada</h3>

            <div className="base-panel-content">
              Na busca avançada você procura por qualquer recurso por nome ou suas propriedades. Podendo também montar um mapa personalizado.
            </div>

            <div className="base-panel-footer">
              <Link to="/advanced-search" className="gmap-btn">
                <i className="icon fas fa-search"></i> Busca Avan&ccedil;ada
              </Link>
            </div>
          </div>

        </div>

        <Tour />
      </App>
    );
  }

}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  {}
)(Home);
