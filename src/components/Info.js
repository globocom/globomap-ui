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
                  <div className="sub-node-info">
                    <span className="sub-node-type">{subnode.type}</span>
                    <span className="sub-node-name">{subnode.name}</span>
                  </div>
                  <div className="sub-node-edges">
                    {subnode.edges.map((edge, i) => {
                      return <span key={i} className="edge">{edge.edge_type}</span>})}
                  </div>
                </div>);
      });

      let qtdNodes = nodesItem.subnodes.length;
      let graphColor = this.props.graphs.filter((graph) => {
        return graph.name === nodesItem.graph;
      })[0].colorClass;

      return (<div key={nodesItem.graph} className="sub-nodes-by-graph">
                <div className={'graph-name '+ graphColor}>
                  {nodesItem.graph}
                  <span className="qtd-nodes">
                    {qtdNodes + (qtdNodes === 1 ? ' node' : ' nodes')}
                  </span>
                </div>
                {subnodes}
              </div>);
    });

    return (
      <div className={'info ' + (this.props.currentNode ? 'open' : '')}>
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
    let graphs = this.props.graphs.filter(g => g.enabled)
                                  .map(g => g.name);
    this.socket.emit('traversalsearch', { start: node._id, graphs: graphs, depth: 1 }, (data) => {
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

        nodesItem.subnodes = subnodes.filter(n => n._id !== node._id);
        subNodesByGraph.push(nodesItem);
      }

      this.setState({ subNodesByGraph: subNodesByGraph });
    });
  }

}

export default Info;
