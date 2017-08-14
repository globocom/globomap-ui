import React, { Component } from 'react';
import Search from './Search';
import './css/Header.css';

class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      enabledCollections: []
    };

    this.handleCheckItem = this.handleCheckItem.bind(this);
  }

  render() {
    let graphButtons = this.props.graphs.map((graph) => {
      return (<button key={"btn-" + graph.name}
                className={"graph-btn topcoat-button--quiet " + graph.colorClass}
                disabled={!graph.enabled}>
                {graph.name}
              </button>);
    });

    let collectionItems = this.props.collections.map((co) => {
      return (<label key={co} className="item topcoat-checkbox">
                <input type="checkbox" name={co} checked={this.state.enabledCollections.indexOf(co) >= 0}
                  onChange={this.handleCheckItem} />
                <div className="topcoat-checkbox__checkmark"></div>
                &nbsp;{co}
              </label>);
    });

    return (
      <header className="main-header">
        <div className="header-group">
          <span className="logo">globomap</span>
          <Search findNodes={this.props.findNodes}
                  clearStage={this.props.clearStage}
                  enabledCollections={this.state.enabledCollections} />
        </div>
        <div className="header-sub-group">
          <div className="graph-buttons">
            {graphButtons}
          </div>
          <div className="collection-items">
            {collectionItems}
          </div>
        </div>
      </header>
    );
  }

  handleCheckItem(event) {
    let target = event.target,
        colls = this.state.enabledCollections.slice(),
        itemIndex = colls.indexOf(target.name);

    if(itemIndex < 0) {
      colls.push(target.name);
    } else {
      colls.splice(itemIndex, 1);
    }

    this.setState({ enabledCollections: colls });
  }
}

export default Header;
