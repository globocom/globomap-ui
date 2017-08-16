import React, { Component } from 'react';
import io from 'socket.io-client';
import { traverseItems } from '../utils';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = io();

    this.state = {
      node: this.getNode(this.props.currentNode),
      subNodesByGraph: []
    }

    this.getNode = this.getNode.bind(this);
    this.traversalSearch = this.traversalSearch.bind(this);
    this.onAddNode = this.onAddNode.bind(this);
    this.buildProperties = this.buildProperties.bind(this);
  }

  render() {
    let node = this.state.node,
        edgesSet = new Set();

    let subNodesByGraph = this.state.subNodesByGraph.map((nodesItem) => {

      let graphColorClass = this.props.graphs.filter((graph) => {
        return graph.name === nodesItem.graph;
      })[0].colorClass;

      let subnodes = nodesItem.subnodes.map((subnode) => {

        let subNodeEdges = subnode.edges.map((edge, i) => {
          edgesSet.add(edge.type);
          return <span key={i} className={'edge '+ graphColorClass}>{edge.type}</span>
        });

        return (<div key={subnode._id} className="sub-node">
                  <button className="btn-add-node topcoat-button--quiet"
                    onClick={(e) => this.onAddNode(e, subnode)}>+</button>
                  <div className="sub-node-info">
                    <span className="sub-node-type">{subnode.type}</span>
                    <span className="sub-node-name">{subnode.name}</span>
                  </div>
                  <div className="sub-node-edges">
                    {subNodeEdges}
                  </div>
                </div>);
      });

      let qtdNodes = nodesItem.subnodes.length;

      return (<div key={nodesItem.graph} className="sub-nodes-by-graph">
                <div className={'graph-name '+ graphColorClass}>
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
          {node.name}
        </div>
        <div className="info-content">
          <div className="info-properties">
            {node.properties &&
              this.buildProperties(node.properties)}
          </div>
          {subNodesByGraph}
        </div>
      </div>
    );
  }

  buildProperties(properties) {
    let props = properties.map((prop, i) => {
      let val = prop.value;

      if(typeof val === 'boolean') {
        val = val ? 'yes' : 'no';
      }

      if(val instanceof Object) {
        let items = [];
        for(let o in val) {
          items.push(<span key={o}>{o}: {val[o]}</span>)
        }
        val = <div>{items}</div>;
      }

      if(val instanceof Array) {
        val = <div>{prop.value.map(o => <span key={o}>{o}</span>)}</div>;
      }

      let name = prop.description ? prop.description : prop.key;

      return <tr key={prop.key}><th>{name}</th><td>{val}</td></tr>;
    });

    return <table><tbody>{props}</tbody></table>;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.currentNode !== nextProps.currentNode) {
      let node = this.getNode(nextProps.currentNode);

      if(node) {
        this.setState({ node: node });
        this.traversalSearch(node);
      }
    }
  }

  getNode(node) {
    let nodes = this.props.nodes.slice(),
        index = nodes.findIndex((elem, i, arr) => {
      return elem._id === node._id;
    });

    if(index >= 0) {
      return nodes[index];
    }

    let stageNodes = this.props.stageNodes.slice(),
        foundNode = false;

    traverseItems(stageNodes, (n) => {
      if(n.uuid === node.uuid) {
        foundNode = n;
      }
    });

    return foundNode;
  }

  onAddNode(event, node) {
    event.stopPropagation();
    this.props.addNodeToStage(node, this.state.node.uuid);
  }

  traversalSearch(node) {
    let graphs = this.props.graphs.filter(g => g.enabled).map(g => g.name),
        params = { start: node._id, graphs: graphs }

    this.socket.emit('traversalsearch', params, (data) => {
      if(data.errors !== undefined) {
        console.log(data.errors);
        return;
      }

      let subNodesByGraph = [];

      for(let i=0, l=data.length; i<l; i++) {
        let nodesItem = { graph: data[i].graph };
        let subnodes = data[i].nodes.map((n) => {
          n.edges = [];
          for(let j=0, k=data[i].edges.length; j<k; j++) {
            let e = data[i].edges[j];
            if(n._id === e._to) {
              n.edges.push({type: e.type, dir: 'in', graph: data[i].graph});
            }

            if(n._id === e._from) {
              n.edges.push({type: e.type, dir: 'out', graph: data[i].graph});
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
