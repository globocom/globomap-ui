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
    return (
      <div className="item-properties">
      {this.buildProperties(this.props.item)}
      </div>
    );
  }

  buildProperties(item) {
    let properties = item.properties || {};
    let propertiesMetadata = item.propertiesMetadata;
    let convertedDate, formattedDate, props;

    convertedDate = new Date(parseInt(item.timestamp, 10) * 1000);
    formattedDate = convertedDate.toLocaleString('pt-BR');

    props = Object.keys(properties).map((key, index) => {
      let val = properties[key];

      if(typeof val === 'boolean') {
        val = val ? 'yes' : 'no';
      }

      if(val instanceof Object) {
        let initial = [],
            remaining = [];

        Object.keys(val).forEach((objectKey, i) => {
          i < 5
            ? initial.push(<span key={i}>{objectKey}: {val[objectKey]}</span>)
            : remaining.push(<span key={i}>{objectKey}: {val[objectKey]}</span>);
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
        val = <div>{properties[key].map(o => <span key={o}>{o}</span>)}</div>;
      }

      return <tr key={key}>
               <th>{(propertiesMetadata &&
                  propertiesMetadata[key].description) || key}</th>
               <td>{val}</td>
             </tr>;
    });

    props.push(
      <tr key="timestamp">
        <th>timestamp</th>
        <td>{formattedDate}</td>
      </tr>
    )

    this.props.hasId &&
      props.push(<tr key="id">
                  <th>id</th>
                  <td>{item.id}</td>
                 </tr>)

    return <table>
              {props.length > 0 &&
                <tbody>{props}</tbody>}
           </table>;
  }

}

export default Properties;
