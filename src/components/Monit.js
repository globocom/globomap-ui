import React, { Component } from 'react';
import { uiSocket } from './App';
import './css/Monit.css';

class Monit extends Component {
  monitItems = ['comp_unit'];

  constructor(props) {
    super(props);
    this.socket = uiSocket();
    this.state = {
      loading: true,
      triggers: []
    }
  }

  render() {
    if(this.props.node.type === 'comp_unit'){
      let props = this.state.triggers.map((trigger, i) => {
        return <tr key={trigger.triggerid}>
                <th>{trigger.description}</th>
                <td className={'trigger-' + trigger.value}>
                  {this.getIcon(trigger.value)}
                </td>
              </tr>;
      });

      if(props.length === 0) {
        props = [<tr key={1}><th className="trigger-not-found">Not found</th></tr>];
      }

      return <div className="monit">
              {!this.state.loading
                ? <table>
                    <tbody>{props}</tbody>
                  </table>
                : <div className="monit-loading">
                    <i className="fa fa-cog fa-spin fa-2x fa-fw"></i>
                  </div>}
            </div>;
    }
    return null;
  }

  getIcon(val) {
    return parseInt(val, 10) !== 0
           ? <i className="fa fa-times"></i>
           : <i className="fa fa-check"></i>;
  }

  componentWillReceiveProps(nextProps){
    let next = nextProps.node,
        current = this.props.node;

    if(this.monitItems.indexOf(next.type) < 0) {
      return;
    }

    if(current._id !== next._id) {
      this.setState({ loading: true, triggers: [] }, () => {
        this.socket.emit('getmonitoring', next, (data) => {
          if (data.error) {
            console.log(data.message);
            return this.setState({ loading: false, triggers: [] });
          }
          return this.setState({ loading: false, triggers: data });
        });
      });
    }
  }

  componentDidMount() {
    let node = this.props.node;

    if(this.monitItems.indexOf(node.type) < 0) {
      return;
    }

    this.setState({ loading: true, triggers: [] }, () => {
      this.socket.emit('getmonitoring', node, (data) => {
        if (data.error) {
          console.log(data.message);
          return this.setState({ loading: false, triggers: [] });
        }
        return this.setState({ loading: false, triggers: data });
      });
    });
  }

}

export default Monit;
