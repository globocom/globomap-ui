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

    let edgesInOut = [
      {
        dir: 'in',
        toggleFn: this.onOpenIn,
        openState: this.state.inOpen,
        items: edges.in.map((e, i) => {
          return <span key={i} className="edge-item" title={e.name}>
                   <strong>{e.type}</strong>: {e.name}
                 </span>;
        })
      },
      {
        dir: 'out',
        toggleFn: this.onOpenOut,
        openState: this.state.outOpen,
        items: edges.out.map((e, i) => {
          return <span key={i} className="edge-item" title={e.name}>
                   <strong>{e.type}</strong>: {e.name}
                 </span>;
        })
      }
    ].map((elem) => {
      return elem.items.length > 0
              ? (<div key={elem.dir} className={'edges-' + elem.dir}>
                  <button className={'edges-btn ' + colorCls} onClick={elem.toggleFn}>
                    <i className={'fa fa-arrow-'+ (elem.dir === 'in' ? 'right' : 'left')}></i>
                  </button>
                  {elem.openState &&
                    <div className="edges-content" onClick={e => e.stopPropagation()}>
                      <div className="tooltip-arrow"></div>
                      <div className={'v-line ' + colorCls}></div>
                      <div className="edges-content-head">
                        Links
                        <button className="close-tooltip-btn" onClick={elem.toggleFn}>
                          <i className="fa fa-close"></i>
                        </button>
                      </div>
                      {elem.items}
                    </div>}
                  </div>)
              : '';
    });

    return <div className={'sub-node-edges ' + this.props.position}>
            {edgesInOut}
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
