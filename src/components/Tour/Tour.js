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
  setTourStatus,
  saveTourStatus,
  getTourStatus } from '../../redux/modules/app';
import { getLocal } from '../../utils';
import './Tour.css';

export class Tour extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      stepIndex: 0
    };
  }

  onCloseTour(event) {
    event.stopPropagation();
    this.props.saveTourStatus(true);
    console.log('clicou')
  }

  nextStep(event) {
    this.setState({ stepIndex: this.state.stepIndex + 1 });
  }

  previousStep(event) {
    this.setState({ stepIndex: this.state.stepIndex - 1 });
  }

  defineSteps() {
    this.setState({
      steps: [
        <React.Fragment>
          <span className="tour-left">Bem-vindo ao Globomap!</span>
          <div className="tour-right">
            <p>O Globomap é uma ferramenta que mapeia os recursos da globo.com e os relacionamentos entre eles.</p>
            <p>Com ele, você pode encontrar informações sobre qualquer recurso, bem como quais têm alguma relação com eles.</p>
            <p>Segue uma breve introdução às suas principais sessões.</p>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Mapas Automáticos</span>
          <div className="tour-right">
            <p>
              Com os Mapas Automáticos você pode realizar buscas pré-definidas para um recurso e poderá obter uma visualização interativa de seus relacionamentos,
              podendo ver diversas informações de qualquer recurso no mapa.
            </p>
            <p>Também é possível personalizar o mapa gerado, apagando partes dele ou até mesmo adicionando novos nós que têm relação com os que estão lá.</p>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Relatórios</span>
          <div className="tour-right">
            <p>Assim como os Mapas Automáticos, os Relatórios também são buscas pré-definidas.</p>
            <p>Enquanto os Mapas Automáticos são interativos, os Relatórios são objetivos, contendo somente as informações mais importantes para o relatório.</p>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Busca Avançada</span>
          <div className="tour-right">
            <p>Na Busca Avançada você procura por qualquer recurso. Poderá utilizar na busca o nome ou suas propriedades.</p>
            <p>É possível também utilizar filtros para facilitar sua busca.</p>
            <p>A partir de um item retornado na sua busca, você poderá visualizar e montar um mapa personalizado com todos os relacionamentos que seu mapa precisar.</p>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Mapas Salvos</span>
          <div className="tour-right">
            <p>
              No Globomap, é possível salvar qualquer mapa gerado, seja ele automático ou personalizado. Desta forma,
              você pode consultá-lo mais rapidamente quando quiser.
            </p>
            <p>É possível também compartilhar um mapa. Com apenas um link, qualquer um pode visualizar o mapa que você construiu.</p>
          </div>
        </React.Fragment>
      ]
    });
  }

  componentDidMount() {
    this.defineSteps();

    const tour = getLocal('gmap.tour');
    if (tour !== null) {
      this.props.setTourStatus(tour === 'true');
    } else {
      this.props.getTourStatus();
    }
  }

  render() {
    const totalSteps = (this.state.steps.length - 1);
    return !this.props.tourStatus
      ? <div className="tour-bg">
          <div className="tour">
            <div className="base-panel">
              <h3 className="base-panel-title">O que &eacute; o Globomap</h3>
              <button className="base-panel-close-btn" onClick={e => this.onCloseTour(e)}>
                <i className="fas fa-times"></i>
              </button>

              <div className="base-panel-content tour-content">
                {this.state.steps[this.state.stepIndex]}
              </div>

              <div className="base-panel-footer">
                {this.state.stepIndex > 0 &&
                  <button className="gmap-btn tour-btn-previous" onClick={e => this.previousStep(e)}>
                    <i className="fas fa-arrow-left"></i> Anterior
                  </button>}

                {this.state.stepIndex < totalSteps &&
                  <button className="gmap-btn tour-btn-next" onClick={e => this.nextStep(e)}>
                    Pr&oacute;ximo <i className="fas fa-arrow-right"></i>
                  </button>}

                {this.state.stepIndex === totalSteps &&
                  <button className="gmap-btn tour-btn-finish" onClick={e => this.onCloseTour(e)}>
                    Fechar <i className="fas fa-check-circle"></i>
                  </button>}
              </div>
            </div>
          </div>
        </div>
      : null;
  }

}

function mapStateToProps(state) {
  return {
    tourStatus: state.app.tourStatus
  };
}

export default connect(
  mapStateToProps,
  {
    setTourStatus,
    saveTourStatus,
    getTourStatus
  }
)(Tour);

