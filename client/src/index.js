import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './Header';
import Map from './Map';
import Footer from './Footer';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Header />, document.getElementById('header'));
ReactDOM.render(<Map />, document.getElementById('content'));
ReactDOM.render(<Footer />, document.getElementById('footer'));

registerServiceWorker();
