import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LoginLogout from './LoginLogout';
import './header.css'

const headerCss={
    'font-family': "Times New Roman",
    'background-color':"#b1b1b1",
    '-webkit-box-shadow': '0 4px 10px 1px #333',
    'box-shadow': '0 4px 10px 1px #333',
    'margin-bottom': '10px'
}

class Header extends Component {


  render() {
    return (
      <nav className="navbar is-fixed-top" style={headerCss}>
        <div className="navbar-menu">
          <div>

              <a href="/" className=" nohover navbar-item title"><img src={require('./stickynote.png')} width="50" height="50"/>Note-It!</a>

            </div>

          <LoginLogout {...this.props} />

        </div>
      </nav>
    )
  }

}

export default Header;
