import React, { Component } from 'react';
import './css/SearchContent.css';

class SearchContent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onNodeSelect = this.onNodeSelect.bind(this);
    this.onAddNode = this.onAddNode.bind(this);
  }

  render() {
    let nodes = this.props.nodes;

    const allNodes = nodes.map((node, i) => {
      return (<tr key={node._id} className={node.current ? 'current' : ''}
                  onClick={(e) => this.onNodeSelect(e, node)}>
                <td>{i + 1}</td>
                <td>
                  <button className="btn-open-node topcoat-button"
                    onClick={(e) => this.onAddNode(e, node)}>+</button>
                </td>
                <td>{node.type}</td>
                <td>{node.name}</td>
              </tr>);
    });

    return (
      <div className="search-content">
        {allNodes.length > 0 &&
          (<table>
            <thead>
              <tr>
                <th width="2%">&nbsp;</th>
                <th width="2%">&nbsp;</th>
                <th width="10%">Type</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {allNodes}
            </tbody>
          </table>)}
      </div>
    );
  }

  onNodeSelect(event, node) {
    event.stopPropagation();
    this.props.setCurrent(node._id);
  }

  onAddNode(event, node) {
    event.stopPropagation();
    this.props.addNodeToStage(node);
  }

}

export default SearchContent;
