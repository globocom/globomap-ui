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

  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      stepIndex: 0
    };
  }

  onCloseTour(event) {
    event.stopPropagation();
    this.props.closeModal();
    console.log('on close tour');
  }

  nextStep(event) {
    this.setState({ stepIndex: this.state.stepIndex + 1 });
  }

  previousStep(event) {
    this.setState({ stepIndex: this.state.stepIndex - 1 });
  }

  registerStep(content) {
    this.setState({ steps: [...this.state.steps, content] });
  }

  setSteps() {
    this.setState({
      steps: [
        <React.Fragment>
          <span className="tour-left">Bem vindo ao Globomap</span>
          <div className="tour-right">
            <p>
              O Globomap é uma ferramenta para te auxiliar a encontrar recursos e seus relacionamentos.
            </p>
            Segue uma breve introdução às suas principais sessões:
            <ul>
              <li>Mapas Automáticos</li>
              <li>Relatórios</li>
              <li>Busca Avançada</li>
            </ul>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Mapas Automáticos</span>
          <div className="tour-right">
            <p>Com os Mapas Automáticos você pode realizar buscas pré-definidas para um recurso e poderá obter uma visualização interativa de seus relacionamentos.</p>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Relatórios</span>
          <div className="tour-right">
            <p>Assim como os Mapas Automáticos, os Relatórios também são buscas pré-definidas.</p>
            <p>A diferença é que o retorno é textual e não interativo, contendo somente as informações relacionadas ao objetivo do relatório.</p>
          </div>
        </React.Fragment>,

        <React.Fragment>
          <span className="tour-left">Busca Avançada</span>
          <div className="tour-right">
            <p>Na Busca Avançada você procura por qualquer recurso, utilizando tanto o nome quanto suas propriedades.</p>
            <p>Utilize também filtros para facilitar sua busca.</p>
            <p>A partir de um item retornado na sua busca você poderá visualizar e montar um mapa personalizado com todos os seus relacionamentos.</p>
          </div>
        </React.Fragment>
      ]
    });
  }

  componentDidMount() {
    this.setSteps()
  }

  render() {
    const totalSteps = (this.state.steps.length - 1);

    return (
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

            {this.state.stepIndex === totalSteps &&
              <button className="gmap-btn tour-btn-finish" onClick={e => this.onCloseTour(e)}>
                Fechar <i className="fas fa-check-circle"></i>
              </button>}

            {this.state.stepIndex < totalSteps &&
              <button className="gmap-btn tour-btn-next" onClick={e => this.nextStep(e)}>
                Pr&oacute;ximo <i className="fas fa-arrow-right"></i>
              </button>}
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

