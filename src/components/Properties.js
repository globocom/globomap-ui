import React, { Component } from 'react';
import './css/Properties.css';

class Properties extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMore: false
    }
    this.buildProperties = this.buildProperties.bind(this);
  }

  render() {
    return this.buildProperties(this.props.properties);
  }

  buildProperties(properties) {
    if(!properties) {
      return <table></table>;
    }

    let props = properties.map((prop) => {
      let val = prop.value;

      if(typeof val === 'boolean') {
        val = val ? 'yes' : 'no';
      }

      if(val instanceof Object) {
        let initial = [],
            remaining = [];

        Object.keys(val).forEach((key, i) => {
          i < 5
            ? initial.push(<span key={i}>{key}: {val[key]}</span>)
            : remaining.push(<span key={i}>{key}: {val[key]}</span>);
        });

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

    return props.length > 0
           ? <div className="item-properties">
              <table>
                <tbody>{props}</tbody>
              </table>
             </div>
           : null;
  }

}

export default Properties;
