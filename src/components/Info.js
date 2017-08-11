import React, { Component } from 'react';
import io from 'socket.io-client';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = io('http://localhost:8888');  // development

    this.state = {
      node: this.getNode(this.props.currentNode),
      subNodesByGraph: []
    }

    this.getNode = this.getNode.bind(this);
    this.traversalSearch = this.traversalSearch.bind(this);

    this.traversalSearch(this.state.node);
  }

  render() {
    let subNodesByGraph = this.state.subNodesByGraph.map((nodesItem) => {
      let subnodes = nodesItem.subnodes.map((subnode) => {
        return (<div key={subnode._id} className="sub-node">
                  <span className="sub-node-type">{subnode.type}</span>
                  <span className="sub-node-name">{subnode.name}</span>
                </div>);
      });

      let qtdNodes = nodesItem.subnodes.length;
      return (<div key={nodesItem.graph} className="sub-nodes-by-graph">
                <span className="graph-name">
                  {nodesItem.graph} - {qtdNodes + (qtdNodes === 1 ? ' node' : ' nodes')}
                </span>
                {subnodes}
              </div>);
    });

    return (
      <div className="info">
        <div className="info-title">
          {this.props.currentNode ? this.state.node.name : 'Info'}
        </div>
        <div className="info-content">
          {subNodesByGraph}
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.currentNode !== nextProps.currentNode) {
      let node = this.getNode(nextProps.currentNode);

      this.setState({node: node});
      this.traversalSearch(node);
    }
  }

  getNode(nodeId) {
    let nodes = this.props.nodes;
    let index = nodes.findIndex((elem, i, arr) => {
      return elem._id === nodeId;
    });

    if(index < 0) {
      return false;
    }

    return nodes[index];
  }

  traversalSearch(node) {
    let options = { start: node._id, graphs: ['base', 'access'], depth: 1 }

    this.socket.emit('traversalsearch', options, (data) => {
      let subNodesByGraph = [];

      for(let i=0, l=data.length; i<l; i++) {
        let nodesItem = { graph: data[i].graph };

        let subnodes = data[i].nodes.map((n) => {
          n.edges = [];
          for(let j=0, k=data[i].edges.length; j<k; j++) {
            let e = data[i].edges[j];
            if(n._id === e._to) {
              n.edges.push({edge_type: e.type, edge_from: e._from});
            }
          }
          return n;
        });

        nodesItem.subnodes = subnodes.filter((n) => {
          return n._id !== node._id;
        })

        subNodesByGraph.push(nodesItem);
      }

      console.log(subNodesByGraph);
      this.setState({ subNodesByGraph: subNodesByGraph });
    });
  }

}

export default Info;
