import React, { Component } from 'react';
import Monit from './Monit';
import Properties from './Properties';
import './css/InfoContentHead.css';

class InfoContentHead extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'Properties'
    }
  }

  render() {

    let tabs = [{ name: 'Properties', content: <Properties properties={this.props.node.properties} /> },
                { name: 'Monitoring', content: <Monit node={this.props.node} /> }];

    let tabsButtons = tabs.map((tabItem) => {
      let active = this.state.currentTab === tabItem.name ? ' active' : '',
          disabled = tabItem.name === 'Monitoring' && this.props.node.type !== 'comp_unit';

      return <li key={'tab' + tabItem.name} className={active}>
              <button className="tab-btn topcoat-button--quiet" disabled={disabled}
                onClick={(e) => this.setState({ currentTab: tabItem.name })}>
                {tabItem.name}
              </button>
            </li>
    });

    let tabsContent = tabs.map((tabItem) => {
      let active = this.state.currentTab === tabItem.name ? ' active' : '';
      return <div key={'content' + tabItem.name} className={'tab-content' + active}>
              {tabItem.content}
            </div>
    });

    return <div className="info-content-head">
            <nav className="tabs-nav">
              <ul>{tabsButtons}</ul>
            </nav>
            <div className="tabs-container">
              {tabsContent}
            </div>
           </div>;
  }

  componentWillReceiveProps(nextProps){
    let current = this.props.node,
        next = nextProps.node;

    if(current._id !== next._id) {
      this.setState({ currentTab: 'Properties' });
    }
  }

}

export default InfoContentHead;
