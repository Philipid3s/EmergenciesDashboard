import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  state = {
    response: ''
  };

  render() {
    return (
      <div className="Footer">
        <h3>Sources:</h3>
        <table>
        <tbody>
          <td>
            <a href="https://earthquake.usgs.gov/">USGS</a> - United States Geological Survey: Latest earthquakes (10 last days).
          </td>
          <td>
            <a href="https://www.unocha.org/">OCHA</a> - United Nations Office for the Coordination of Humatinarian Affairs: Current disasters.
          </td>
        </tbody>
        </table>
        <br/>
        <br/>
        contact: <a href="mailto:julien.regnault@email.com">Julien Regnault</a>
      </div>
    );
  }
}

export default Footer;
