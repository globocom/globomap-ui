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
