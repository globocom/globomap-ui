import React, { Component } from 'react';
import io from 'socket.io-client';

class Monit extends Component {

  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      triggers: []
    }
  }

  render() {
      if(this.state.triggers.length != 0){
        let props = this.state.triggers.map((trigger, i) => {
          return <tr key={trigger.triggerid}>
                  <th>{trigger.description}</th>
                  <td>{trigger.value}</td>
                </tr>;
        });

        return <div className="monit">
                  <table>
                    <tbody>{props}</tbody>
                  </table>
                </div>;
      }
      return null;
  }

  componentWillReceiveProps(nextProps){
    let current = this.props.node,
    next = nextProps.node;

    if((current._id !== next._id || current.uuid !== next.uuid) && next.type == 'comp_unit') {
      this.setState({ triggers : [] });
      this.socket.emit('getmonitoring', next, (data) => {
        this.setState({ triggers : data });
      })
    }
  }
}

export default Monit;
