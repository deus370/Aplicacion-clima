require("colors");
require("dotenv").config();

const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  let opt = "";
  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        //Mostrar mensaje
        const lugar = await leerInput();
        //Buscar los lugares
        const lugares = await busquedas.ciudad(lugar);
        //Seleccionar lugar
        const id = await listarLugares(lugares);
        if (id === 0) continue;
        const lugarSel = lugares.find((l) => l.id === id);
        //Guardar DB
        busquedas.agregarHistorial(lugarSel.nombre);
        //Clima
        const clima = await busquedas.climalugar(lugarSel.lat, lugarSel.long);
        //Mostrar resultados
        console.clear();
        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad:", lugarSel.nombre.green);
        console.log("Lat:", lugarSel.lat);
        console.log("Long:", lugarSel.long);
        console.log("Temperatura:", clima.temp);
        console.log("Minima:", clima.min);
        console.log("Maxima:", clima.max);
        console.log("Descripccion:", clima.desc.green);
        break;

      case 2:
        i = 0;
        busquedas.historial.forEach((lugar) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
