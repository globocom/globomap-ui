import React, { Component } from 'react';
import Monit from './Monit';
import './css/InfoProperties.css';

class InfoProperties extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMore: false
    }

    this.buildProperties = this.buildProperties.bind(this);
  }

  render() {
    let props = this.buildProperties();

    return <div className="info-properties">
            {props}
            <Monit node={this.props.node} />
          </div>
  }

  buildProperties() {
    let properties = this.props.node.properties;
    if(!properties) {
      return <table></table>;
    }

    let props = properties.map((prop, i) => {
      let val = prop.value;

      if(typeof val === 'boolean') {
        val = val ? 'yes' : 'no';
      }

      if(val instanceof Object) {
        let initial = [],
            remaining = [];

        for(let i in val) {
          i < 3
            ? initial.push(<span key={i}>{i}: {val[i]}</span>)
            : remaining.push(<span key={i}>{i}: {val[i]}</span>);
        }

        val = <div>
                <div className="prop-initial">{initial}</div>
                {remaining.length > 0 &&
                  <button className="btn-show-more topcoat-button--quiet"
                    onClick={(e) => this.setState({ showMore: !this.state.showMore })}>
                      show {!this.state.showMore ? 'more' : 'less'}
                  </button>}
                {this.state.showMore &&
                  <div className="prop-remaining">{remaining}</div>}
              </div>;
      }

      if(val instanceof Array) {
        val = <div>{prop.value.map(o => <span key={o}>{o}</span>)}</div>;
      }

      return <tr key={prop.key}>
              <th>{prop.description || prop.key}</th>
              <td>{val}</td>
             </tr>;
    });

    return <table>
            <tbody>{props}</tbody>
           </table>;
  }

}

export default InfoProperties;
