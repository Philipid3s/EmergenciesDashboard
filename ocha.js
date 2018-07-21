var fetch = require("node-fetch");
var countries = require("./countries");
var latlon = require("./latlon");

const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class OCHA {

  constructor() {
    this.disasters = [];

    this.url = `https://www.humanitarianresponse.info/api/v1.0/disasters?filter[status]=current`;
  }

  json() {
    return JSON.stringify(this.disasters);
  }

  addDisaster(data) {
    let datetime = parseInt(data.created) * 1000; // convert unix date
    let date = new Date(datetime);

    let disaster = {
      type: data.primary_type,
      datetime: datetime,
      date: date.toLocaleDateString('EN-en', date_options),
      coordinates: data.operation.map(
                          operation => {
                            var coord = [];
                            countries.forEach(  country => {
                              country.name === (operation === null ? 'null': operation.label)?
                              coord = [parseFloat(latlon[country.code.toLowerCase()][0]), parseFloat(latlon[country.code.toLowerCase()][1])]
                              : {}} );
                            return coord;
                        }),
      title :data.label,
      //level: data.properties.alert,
      url: data.self
    };

    this.disasters.push(disaster);
    return `[disasters] ${disaster.title}`;
  }

  async loadDisasters() {
    console.log('[disasters] loading...');

    let json = await(await fetch(this.url)).json();

    await Promise.all(json.data.map(data => {
                      const result = this.addDisaster(data);
                      console.log(result);
                  }));

    console.log('[disasters] loaded!');

    return this.json();
  }
}

module.exports = OCHA
