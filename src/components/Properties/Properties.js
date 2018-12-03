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
import { connect } from 'react-redux';
import './Properties.css';

const DATE_FORMAT_LANGUAGE = 'pt-BR';

class Properties extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      subProps: []
    }

    this.buildProperties = this.buildProperties.bind(this);
    this.buildProps = this.buildProps.bind(this);
    this.toggleProps = this.toggleProps.bind(this);
  }

  toggleProps(event, item) {
    event.preventDefault();
    let sub = this.state.subProps.slice();

    if (sub.includes(item)) {
      sub.splice(sub.indexOf(item), 1);
    } else {
      sub.push(item);
    }

    this.setState({ subProps: sub });
  }

  buildProps(obj, level) {
    return Object.keys(obj).map((key, index) => {
      let value = obj[key];
      let itemKey = key + level;
      let isObject = (value instanceof Object);

      if (isObject) {
        return (
          <div key={key} className={'l-'+level}>
            <div className="item-prop">
              <span>{key}</span>
              <span>
                <a href="#sup-props" onClick={(e) => this.toggleProps(e, itemKey)}>
                  {!this.state.subProps.includes(itemKey)
                    ? <span><i className="icon fa fa-caret-right"></i> show</span>
                    : <span><i className="icon fa fa-caret-down"></i> close</span>}
                </a>
              </span>
            </div>
            {this.state.subProps.includes(itemKey) &&
              <div className="sub-item-prop">
                {this.buildProps(value, level+1)}
              </div>}
          </div>
        );
      }

      if (typeof value === 'boolean') {
        value = value ? 'yes' : 'no';
      } else if (value instanceof Array) {
        value = (
          <div>
            {value.map(o => <span key={o}>{o}</span>)}
          </div>
        );
      }

      return (
        <div key={key} className={'l-'+level}>
          <div className="item-prop">
            <span>{key}</span>
            <span>{value}</span>
          </div>
        </div>
      );
    });
  }

  buildProperties(item) {
    const properties = item.properties || {};
    let content = this.buildProps(properties, 0);

    console.log(item.timestamp);

    const itemTimestamp = new Date(parseInt(item.timestamp, 10) * 1000);
    content.push(<div key="timestamp" className="item-prop">
                   <span>timestamp</span>
                   <span>{itemTimestamp.toLocaleString(DATE_FORMAT_LANGUAGE)}</span>
                 </div>);

    this.props.hasId &&
      content.push(<div key="id" className="item-prop">
                     <span>id</span>
                     <span>{item.id}</span>
                   </div>);

    return content;
  }


  render() {
    return (
      <div className="item-properties">
        {this.buildProperties(this.props.item)}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    hasId: state.app.hasId
  };
}

export default connect(
  mapStateToProps,
  null
)(Properties);
