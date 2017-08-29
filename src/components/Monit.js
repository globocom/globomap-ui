import React, { Component } from 'react';
import { uiSocket } from './App';
import './css/Monit.css';

class Monit extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();
    this.state = {
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

      return <div className="monit">
              {this.state.triggers.length > 0
                ? <table>
                    <tbody>{props}</tbody>
                  </table>
                : <table></table>}
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
    let current = this.props.node,
        next = nextProps.node;

    if(next.type !== 'comp_unit'){
      this.setState({ triggers : [] });
      return;
    }

    if(current._id !== next._id) {
      this.setState({ triggers : [] });
      this.socket.emit('getmonitoring', next, (data) => {
        console.log(data);

        this.setState({ triggers : data });
      });
    }
  }

}

export default Monit;
