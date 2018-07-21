var fetch = require("node-fetch");

const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class USGS {

  constructor(dateFrom, dateTo, level) {
    this.earthquakes = [];

    var dd1 = dateFrom.getDate();
    var mm1 = dateFrom.getMonth()+1; //January is 0!
    var yyyy1 = dateFrom.getFullYear();

    var dd2 = dateTo.getDate();
    var mm2 = dateTo.getMonth()+1; //January is 0!
    var yyyy2 = dateTo.getFullYear();

    this.url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${yyyy1}-${mm1}-${dd1}&endtime=${yyyy2}-${mm2}-${dd2}&alertlevel=${level}`;
  }

  json() {
    return JSON.stringify(this.earthquakes);
  }

  addEarthquake(data) {
    let date = new Date(data.properties.time);

    let earthquake = {
      type: data.properties.type.toLowerCase(),
      datetime: data.properties.time,
      date: date.toLocaleDateString('EN-en', date_options),
      coordinates: [data.geometry.coordinates[1], data.geometry.coordinates[0]],
      title :data.properties.title,
      level: data.properties.alert,
      url: data.properties.url
    };

    this.earthquakes.push(earthquake);
    return `[earthquakes] ${earthquake.title}`;
  }

  async loadEarthquakes() {
    console.log('[earthquakes] loading...');

    let json = await(await fetch(this.url)).json();

    await Promise.all(json.features.map(data => {
                      const result = this.addEarthquake(data);
                      console.log(result);
                  }));

    console.log('[earthquakes] loaded!');

    return this.json();
  }
}

module.exports = USGS
