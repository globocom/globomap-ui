import React, { Component } from 'react';
import Search from './Search';
import './css/Header.css';

class Header extends Component {
  render() {
    return (
      <header className="main-header">
        <span className="logo">globomap</span>
        <Search />
      </header>
    );
  }
}

export default Header;
