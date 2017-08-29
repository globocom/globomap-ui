import React, { Component } from 'react';
import Monit from './Monit';
import './css/InfoContentHead.css';

class InfoContentHead extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      currentTab: 'Properties'
    }

    this.buildProperties = this.buildProperties.bind(this);
  }

  render() {

    let tabsContent = [{ name: 'Properties', content: this.buildProperties() }];
    if(this.props.node.type === 'comp_unit') {
      tabsContent.push({ name: 'Monitoring', content: <Monit node={this.props.node} /> });
    }

    return <div className="info-content-head">
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
           </div>;
  }

  buildProperties() {
    let properties = this.props.node.properties;
    if(!properties) {
      return <table></table>;
    }

    let props = properties.map((prop, i) => {
      let val = prop.value;

      if(typeof val === 'boolean') {
        val = val ? 'yes' : 'no';
      }

      if(val instanceof Object) {
        let initial = [],
            remaining = [];

        for(let i in val) {
          i < 3
            ? initial.push(<span key={i}>{i}: {val[i]}</span>)
            : remaining.push(<span key={i}>{i}: {val[i]}</span>);
        }

        val = <div>
                <div className="prop-initial">{initial}</div>
                {remaining.length > 0 &&
                  <button className="btn-show-more topcoat-button--quiet"
                    onClick={(e) => this.setState({ showMore: !this.state.showMore })}>
                      show {!this.state.showMore ? 'more' : 'less'}
                  </button>}
                {this.state.showMore &&
                  <div className="prop-remaining">{remaining}</div>}
              </div>;
      }

      if(val instanceof Array) {
        val = <div>{prop.value.map(o => <span key={o}>{o}</span>)}</div>;
      }

      return <tr key={prop.key}>
               <th>{prop.description || prop.key}</th>
               <td>{val}</td>
             </tr>;
    });

    return <div className="info-properties">
            <table>
              <tbody>{props}</tbody>
            </table>
           </div>;
  }

  componentWillReceiveProps(nextProps){
    let current = this.props.node,
        next = nextProps.node;

    if(current._id !== next._id) {
      // this.setState({ currentTab: 'Properties' });
    }
  }

}

export default InfoContentHead;
