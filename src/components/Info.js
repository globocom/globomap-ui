import React, { Component } from 'react';
import io from 'socket.io-client';
import InfoProperties from './InfoProperties';
import Monit from './Monit';
import NodeEdges from './NodeEdges';
import './css/Info.css';

class Info extends Component {

  constructor(props) {
    super(props);
    this.socket = io();

    this.state = {
      node: this.props.getNode(this.props.currentNode),
      byGraph: [],
      currentTab: 'Properties'
    }

    this.onAddNode = this.onAddNode.bind(this);
    this.onCloseInfo = this.onCloseInfo.bind(this);
    this.composeEdges = this.composeEdges.bind(this);
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

    let tabsContent = [{ name: 'Properties', content: <InfoProperties node={this.state.node} /> }];
    if(this.state.node.type === 'comp_unit') {
      tabsContent.push({ name: 'Monitoring', content: <Monit node={this.state.node} /> });
    }

    return <div className={'info ' + (this.props.currentNode ? 'open' : '')}>
             <div className="info-title">
               {this.state.node.name}
               <button className="close-info-btn topcoat-button--quiet"
                 onClick={this.onCloseInfo}>
                 <i className="fa fa-close"></i>
               </button>
             </div>

             <div className="info-content">
               <nav className="tabs-nav">
                 <ul>
                   {tabsContent.map((tabItem) => {
                     let active = this.state.currentTab === tabItem.name ? ' active' : '';
                     return <li key={'tab' + tabItem.name} className={active}>
                              <button className="tab-btn topcoat-button--quiet"
                                onClick={(e) => this.setState({ currentTab: tabItem.name })}>
                                {tabItem.name}
                              </button>
                            </li>
                   })}
                 </ul>
               </nav>

               <div className="tabs-container">
                 {tabsContent.map((tabItem) => {
                   let active = this.state.currentTab === tabItem.name ? ' active' : '';
                   return <div key={'content' + tabItem.name} className={'tab-content' + active}>
                            {tabItem.content}
                          </div>
                 })}
               </div>

               <div className="info-graph-items">
                 {byGraph}
               </div>
             </div>
          </div>
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
                 <span className="sub-node-name" title={subnode.name}>{subnode.name}</span>
               </div>

               <NodeEdges edges={subnode.edges}
                          graphs={this.props.graphs}
                          position={'right'} />
             </div>;
    });

    return subnodes;
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

      let byGraph = data.map((gData) => {
        gData.subnodes = gData.nodes.filter(n => n._id !== node._id).map((n) => {
          n.edges = this.composeEdges(n, gData.edges)
          n.edges.graph = gData.graph;
          return n;
        });
        return gData;
      });

      this.setState({ byGraph: byGraph });
    });
  }

  composeEdges(node, edges) {
    let nEdges = { in: [], out: [] };

    for(let i=0, l=edges.length; i<l; ++i) {
      let edge = edges[i];

      if(node._id === edge._to) {
        edge.dir = 'in';
        nEdges.in.push(edge);
      }

      if(node._id === edge._from) {
        edge.dir = 'out';
        nEdges.out.push(edge);
      }
    }

    return nEdges;
  }

  onCloseInfo(event) {
    event.stopPropagation();
    this.props.clearCurrent();
  }

  onAddNode(event, node, makeCurrent) {
    event.stopPropagation();
    this.props.addNodeToStage(node, this.state.node.uuid || this.state.node._id, makeCurrent);
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

}

export default Info;
