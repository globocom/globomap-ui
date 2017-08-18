import React, { Component } from 'react';
import io from 'socket.io-client';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = io();

    this.state = {
      node: this.props.getNode(this.props.currentNode),
      byGraph: []
    }

    this.onAddNode = this.onAddNode.bind(this);
    this.onCloseInfo = this.onCloseInfo.bind(this);
  }

  render() {
    let byGraph = this.state.byGraph.map((nodesItem) => {

      let colorCls = this.props.graphs.filter((graph) => {
        return graph.name === nodesItem.graph;
      })[0].colorClass;

      return <div key={nodesItem.graph} className="sub-nodes-by-graph">
              <div className={'graph-name ' + colorCls}>
                {nodesItem.graph}
                <span className="qtd-nodes">
                  {nodesItem.subnodes.length}
                </span>
              </div>
              {this.buildSubNodes(nodesItem)}
            </div>;
    });

    return <div className={'info ' + (this.props.currentNode ? 'open' : '')}>
            <div className="info-title">
              {this.state.node.name}
              <button className="close-info-btn topcoat-button--quiet"
                onClick={this.onCloseInfo}>
                <i className="fa fa-close"></i>
              </button>
            </div>
            <div className="info-content">
              <div className="info-properties">
                {this.buildProperties()}
              </div>
              <div className="graph-items">
                {byGraph}
              </div>
            </div>
          </div>;
  }

  buildSubNodes(nodesItem) {
    let subnodes = nodesItem.subnodes.map((subnode) => {
      let hasNode = this.props.stageHasNode(subnode._id, this.state.node.uuid);

      return <div key={subnode._id} className={'sub-node' + (hasNode ? ' disabled': '')}>
              <div className="sub-node-btn">
                <button className="btn-add-node topcoat-button"
                  onClick={(e) => this.onAddNode(e, subnode)} disabled={hasNode}>+</button>
              </div>

              <div className="sub-node-info" onClick={(e) => this.onAddNode(e, subnode, true)}>
                <span className="sub-node-type">{subnode.type}</span>
                <span className="sub-node-name">{subnode.name}</span>
              </div>

              <div className="sub-node-edges">
                {this.buildEdges(subnode.edges)}
              </div>
            </div>;
    });

    return subnodes;
  }

  buildEdges(edges) {
    let edgesSet = new Set();
    let nodeEdges = edges.map((edge, i) => {
      let colorCls = this.props.graphs.filter((graph) => {
          return graph.name === edge.graph;
      })[0].colorClass;

      edgesSet.add(edge.type);
      return <span key={i} className={'edge '+ colorCls}>{edge.type}</span>
    });

    return nodeEdges;
  }

  buildProperties() {
    let properties = this.state.node.properties;
    if(!properties) {
      return '';
    }

    let props = properties.map((prop, i) => {
      let val = prop.value;

      if(typeof val === 'boolean') {
        val = val ? 'yes' : 'no';
      }

      if(val instanceof Object) {
        let items = [];
        for(let o in val) {
          items.push(<span key={o}>{o}: {val[o]}</span>);
        }
        val = <div>{items}</div>;
      }

      if(val instanceof Array) {
        val = <div>{prop.value.map(o => <span key={o}>{o}</span>)}</div>;
      }

      return <tr key={prop.key}>
              <th>{prop.description || prop.key}</th>
              <td>{val}</td>
            </tr>;
    });

    return <table>
            <tbody>{props}</tbody>
          </table>;
  }

  resetSubNodes() {
    let byGraphCopy = this.state.byGraph.slice();
    byGraphCopy = byGraphCopy.map((nodesItem) => {
      nodesItem.subnodes = [];
      return nodesItem;
    });
    this.setState({ byGraph: byGraphCopy });
  }

  traversalSearch(node) {
    let graphs = this.props.graphs.filter(g => g.enabled).map(g => g.name),
        params = { start: node._id, graphs: graphs }

    this.socket.emit('traversalsearch', params, (data) => {
      if(data.errors !== undefined) {
        console.log(data.errors);
        return;
      }

      let byGraph = [];

      for(let i=0, l=data.length; i<l; ++i) {
        let nodesItem = { graph: data[i].graph };
        let subnodes = data[i].nodes.map((n) => {
          n.edges = [];
          for(let j=0, k=data[i].edges.length; j<k; ++j) {
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
        byGraph.push(nodesItem);
      }

      this.setState({ byGraph: byGraph });
    });
  }

  componentWillReceiveProps(nextProps) {
    let current = this.props.currentNode,
        next = nextProps.currentNode;

    if(current._id !== next._id || current.uuid !== next.uuid) {
      this.resetSubNodes();
      let node = this.props.getNode(next);

      if(node) {
        this.setState({ node: node });
        this.traversalSearch(node);
      }
    }
  }

  onCloseInfo(event) {
    event.stopPropagation();
    this.props.clearCurrent();
  }

  onAddNode(event, node, makeCurrent) {
    event.stopPropagation();
    this.props.addNodeToStage(node, this.state.node.uuid || this.state.node._id, makeCurrent);
  }

}

export default Info;
