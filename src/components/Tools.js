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
import './css/Tools.css';

class Tools extends React.Component {
  render() {
    return (
      <div className={'tools' + (this.props.currentNode ? ' with-info' : '')}>
        <button className="btn-save-graph topcoat-button">
          <i className="fa fa-save"></i>
        </button>
        <button className="btn-restore-graph topcoat-button">
          <i className="fa fa-folder-open-o"></i>
        </button>
      </div>
    );
  }
}

export default Tools;
