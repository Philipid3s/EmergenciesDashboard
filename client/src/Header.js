import React, { Component } from 'react';
import logo from './logo.svg';
import './Header.css';

class Header extends Component {
  state = {
    response: '[Connection to server... please wait.]'
  };

  render() {
    return (
      <div className="Header">
        <header className="Header-header">
          <img src={logo} className="Header-logo" alt="logo" />
          <h1 className="Header-title">GED - global emergencies dashboard</h1>
        </header>
          <p className="Header-intro">
            {this.state.response}
          </p>
      </div>
    );
  }

  // ComponentDidMount is called AFTER render()
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };
}

export default Header;
