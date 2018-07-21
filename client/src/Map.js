import React, { Component } from 'react';
import './Map.css';
import L from 'leaflet'

// const position = [51.505, -0.09]
// const map = L.map('map').setView(position, 13)

var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: './marker-shadow.png',
        iconSize:     [32, 52],
        shadowSize:   [50, 64],
        iconAnchor:   [16, 52],
        shadowAnchor: [20, 65],
        popupAnchor:  [0, -40]
    }
});

var greenIcon = new LeafIcon({iconUrl: './marker-green-small.png'}),
    redIcon = new LeafIcon({iconUrl: './marker-red-small.png'}),
    orangeIcon = new LeafIcon({iconUrl: './marker-orange-small.png'}),
    yellowIcon = new LeafIcon({iconUrl: './marker-yellow-small.png'});

class Map extends Component {
  state = {
    response: ''
  };

  render() {
    return (
      <div id="mapid"></div>
    );
  }

  // ComponentDidMount is called AFTER render()
  componentDidMount() {
    var mymap = L.map('mapid').setView([3, 18], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    mymap.on('click', e => {
      L.popup()
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(mymap);
    });

    this.callApiUsgs(mymap)
      .then(res => this.setState({ response: res.result }))
      .catch(err => console.log(err));

    this.callApiOcha(mymap)
      .then(res => this.setState({ response: res.result }))
      .catch(err => console.log(err));
  }



  callApiUsgs = async (mymap) => {
    const response = await fetch('/api/usgs');
    const json = await response.json();

    const dataArray = JSON.parse(json.result);

    if (response.status !== 200) throw Error(dataArray.message);

    for (let i = 0; i<dataArray.length; i++) {
      let earthquake = dataArray[i];

      let selectedIcon =  (earthquake.level === 'green') ? greenIcon :
                          (earthquake.level === 'yellow') ? yellowIcon :
                          (earthquake.level === 'orange') ? orangeIcon :
                          (earthquake.level === 'red') ? redIcon : redIcon;

      let marker = L.marker(earthquake.coordinates, {icon: selectedIcon}).addTo(mymap);
      marker.bindPopup(`<b>${earthquake.title}</b>
        <br>${earthquake.date}
        <br>level: <b>${earthquake.level}</b>
        <br><a href="${earthquake.url}">website</a>`);
    }

    return dataArray;
  }

  callApiOcha = async (mymap) => {
    const response = await fetch('/api/ocha');
    const json = await response.json();

    const dataArray = JSON.parse(json.result);

    if (response.status !== 200) throw Error(dataArray.message);

    var markers = [];

    for (let i = 0; i<dataArray.length; i++) {
      let disaster = dataArray[i];

      let today = new Date();
      let todayMinus30days = new Date();
      todayMinus30days.setDate(today.getDate()-30);
      let todayMinus365days = new Date();
      todayMinus365days.setDate(today.getDate()-365);

      let disasterDate = new Date(disaster.datetime);

      let color;
      if (disasterDate >= todayMinus30days) {
        color = 'red';
      }
      else if (disasterDate >= todayMinus365days) {
        color = 'orange';
      }
      else {
        color = 'yellow';
      }

      disaster.coordinates.forEach(coord => {
        if (coord !== null && coord.length == 2) {
          var circle = L.circle(coord, {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: 200000
          }).addTo(mymap);

          var newContent = '';
          var insert = true;

          markers.forEach(marker => { (marker.coordinates[0] === coord[0] && marker.coordinates[1] === coord[1]) ? (newContent =  (marker.content + '<br><br>'),  insert = false) : {} } );

          newContent += `<b>${disaster.title}</b>
            <br>${disaster.date}
            <br><b>${disaster.type}</b>
            <br><a href="${disaster.url}">website</a>`;

          if (insert == true) {
            markers.push({content: newContent, coordinates: coord});
          }

          circle.bindPopup(newContent);

          markers.map(marker => {
            var mark = marker;
            (marker.coordinates[0] === coord[0] && marker.coordinates[1] === coord[1]) ? mark = { content : newContent, coordinates : marker.coordinates } : {};
            return mark;
          });
        };
      });
    };

    return dataArray;
  }
}

export default Map;
