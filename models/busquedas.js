const fs = require("fs");
const axios = require("axios").default;

class Busquedas {
  historial = [];
  dbPATH = "./db/database.json";
  constructor() {
    //TODO: leer DB si existe
    this.leerdb();
  }

  get parametros() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  async ciudad(lugar = "") {
    try {
      //peticion HHTP
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.parametros,
      });
      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name_es,
        long: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climalugar(lat, long) {
    try {
      const resp = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPENWE_KEY}&units=metric&lang=es`
      );
      const { weather, main } = resp.data;
      console.log(main.temp);
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 9);
    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const playload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPATH, JSON.stringify(playload));
  }

  leerdb() {
    if (!fs.existsSync(this.dbPATH)) return;

    const info = fs.readFileSync(this.dbPATH, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
