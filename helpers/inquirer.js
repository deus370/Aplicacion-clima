const inquirer = require("inquirer");
require("colors");

const menuOpt = [
  {
    type: "list",
    name: "opcion",
    message: "Elija una opcion",
    choices: [
      {
        value: 1,
        name: `${"1.-".green}Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.-".green}Historial`,
      },
      {
        value: 0,
        name: `${"0.-".green}Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("=========================".green);
  console.log(" Seleccione una opcion".white);
  console.log("=========================\n".green);

  const { opcion } = await inquirer.prompt(menuOpt);
  return opcion;
};

const pausa = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"ENTER".green} para continuar`,
    },
  ];
  console.log("\n");
  await inquirer.prompt(question);
};

const leerInput = async (mensaje) => {
  const question = [
    {
      type: "input",
      name: "ciudad",
      mensaje,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { ciudad } = await inquirer.prompt(question);
  return ciudad;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: "0",
    name: `0`.green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione una ubicacion",
      choices,
    },
  ];
  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (msg) => {
  const pregunta = [
    {
      type: "confirm",
      name: "ok",
      message: msg,
    },
  ];

  const { ok } = await inquirer.prompt(pregunta);
  return ok;
};

const mostrarEstado = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const idx = `${i + 1}`.green;

    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccionados",
      choices,
    },
  ];
  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarEstado,
};
