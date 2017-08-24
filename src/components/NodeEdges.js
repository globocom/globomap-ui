import React, { Component } from 'react';
import './css/NodeEdges.css';

class NodeEdges extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inOpen: false,
      outOpen: false
    }

    this.onOpenIn = this.onOpenIn.bind(this);
    this.onOpenOut = this.onOpenOut.bind(this);
  }

  render() {
    let edges = this.props.edges;
    if(edges === undefined) {
      return <div className="sub-node-edges"></div>;
    }

    let colorCls = this.props.graphs.filter((graph) => {
        return graph.name === edges.graph;
    })[0].colorClass;

    let edgesIn = edges.in.map((e, i) => {
      return <span key={i}>{e.type}: {e.name}</span>;
    });

    let edgesOut = edges.out.map((e, i) => {
      return <span key={i}>{e.type}</span>;
    });

    return <div className={'sub-node-edges ' + this.props.position}>
            {edgesIn.length > 0 &&
              <div className="edges-in">
                <button className={'edges-btn ' + colorCls} onClick={this.onOpenIn}>
                  <i className="fa fa-arrow-right"></i>
                </button>
                {this.state.inOpen &&
                  <div className="edges-in-content">
                    <div className="tooltip-arrow"></div>
                    {edgesIn}
                  </div>}
              </div>}

            {edgesOut.length > 0 &&
              <div className="edges-out">
                <button className={'edges-btn ' + colorCls} onClick={this.onOpenOut}>
                  <i className="fa fa-arrow-left"></i>
                </button>
                {this.state.outOpen &&
                  <div className="edges-out-content">
                    <div className="tooltip-arrow"></div>
                    {edgesOut}
                  </div>}
              </div>}
            </div>;
  }

  onOpenIn(event) {
    event.stopPropagation();
    this.setState({ inOpen: !this.state.inOpen });
  }

  onOpenOut(event) {
    event.stopPropagation();
    this.setState({ outOpen: !this.state.outOpen });
  }

}

export default NodeEdges;
