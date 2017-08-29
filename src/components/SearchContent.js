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
           </div>;
  }

  onNodeSelect(event, node) {
    event.stopPropagation();
    this.props.setCurrent(node, () => {
      this.props.addNodeToStage(node);
    });
  }

}

export default SearchContent;
