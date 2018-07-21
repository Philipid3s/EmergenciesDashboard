const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const USGS = require('./usgs');
const OCHA = require('./ocha');
const {promisify} = require('util');

app.use(express.static(path.join(__dirname, 'client')));

async function sendResultsUSGS(usgs, response) {
  const json = await usgs.loadEarthquakes();
  response.send({ result: json });
  console.log('[earthquakes] results sent to client');
}

async function sendResultsOCHA(ocha, response) {
  const json = await ocha.loadDisasters();
  response.send({ result: json });
  console.log('[disasters] results sent to client');
}

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: '[connected to node.js server]' });
});

app.get('/api/usgs', (req, res) => {
  let today = new Date();
  let todayMinus10days = new Date();
  todayMinus10days.setDate(today.getDate()-10);

  let usgs = new USGS(todayMinus10days, today, 'green');

  sendResultsUSGS(usgs, res);
});

app.get('/api/ocha', (req, res) => {
  let ocha = new OCHA();

  sendResultsOCHA(ocha, res);
});

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
