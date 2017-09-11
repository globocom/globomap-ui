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
import './css/SearchContent.css';

class SearchContent extends Component {

  constructor(props) {
    super(props);
    this.onNodeSelect = this.onNodeSelect.bind(this);
  }

  render() {
    let allNodes = this.props.nodes.map((node, i) => {
      let current = (this.props.currentNode &&
                     node._id === this.props.currentNode._id);

      return <tr key={node._id} className={current ? 'current' : ''}
                 onClick={(e) => this.onNodeSelect(e, node)}>
              <td>{i + 1}</td>
              <td>{node.type}</td>
              <td>{node.name}</td>
             </tr>;
    });

    return <div className="search-content">
            {allNodes.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th width="3%">#</th>
                    <th width="5%">Type</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>{allNodes}</tbody>
              </table>}
              {allNodes.length === 0 &&
                <span className="empty">
                  {this.props.firstTimeSearch ?
                    "Inicie sua busca." :
                    "Nenhum resultado encontrado."}
              </span>}
           </div>;
  }

  onNodeSelect(event, node) {
    event.stopPropagation();
    this.props.setCurrent(node, () => {
      this.props.addNodeToStage(node, false, true);
    });
  }

}

export default SearchContent;
