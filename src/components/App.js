import React, { Component } from 'react';
import Header from './Header';
import Stage from './Stage';
import Info from './Info';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="main">
        <Header />
        <Stage />
        <Info />
      </div>
    );
  }
}

export default App;
