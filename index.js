/*CONFIGURACION GENERAL DEL SIMON*/

const opciones = {
  top_left: {
    id: "top_left"
  },
  top_right: {
    id: "top_right"
  },
  bottom_left: {
    id: "bottom_left"
  },
  bottom_right: {
    id: "bottom_right"
  },
};

const estadoJuego = {
  intervalos: {
    inicio: 1000,
    paso: 500
  },
  segundosInicio: 3,
  interaciones: false,
  secuenciaJuego: [],
  secuenciaUsuario: [],
  nivelJuego: 0,
  nivelUsuario: 0,
  opciones,
};

/*REFERENCIAS DEL DOM*/

const botonesDelJuego = document.querySelectorAll(".simon-button");

/*HELP METHODS PARA INTERACTUAR CON EL DOM*/

const activarElemento = (elementoDOM) => {
  elementoDOM.classList.add("active");
}

const mostrarElemento = (elementoDOM) => {
  elementoDOM.classList.add("show");
  elementoDOM.classList.remove("hide");
}

const desactivarElemento = (elementoDOM) => {
  elementoDOM.classList.remove("active");
}

const ocultarElemento = (elementoDOM) => {
  elementoDOM.classList.add("hide");
  elementoDOM.classList.remove("show");
}

const activarElementos = (elementos) => {
  elementos.forEach(activarElemento);
};

const desactivarElementos = (elementos) => {
  elementos.forEach(desactivarElemento);
};

const obtenerElementoDom = (id) => {
  return window.document.getElementById(id);
};

/*INTERACCIONES*/

const activarInteracciones = () => {
  const elementoApp = obtenerElementoDom("app");
  elementoApp.classList.remove("app-background-dark");

  const elementoTexto = obtenerElementoDom("turno_texto");
  mostrarElemento(elementoTexto);
  elementoTexto.textContent = "tu turno";

  
  estadoJuego.interaciones = true;
};

const desactivarInteracciones = () => {
  const elementoApp = obtenerElementoDom("app");
  elementoApp.classList.add("app-background-dark");

  const elementoTexto = obtenerElementoDom("turno_texto");
  ocultarElemento(elementoTexto);

  estadoJuego.interaciones = false;
};

/*ACCION DEL MODAL PARA INICIAR EL JUEGO*/

const accionModalInicio = () => {
  ///OBTENCION DEL NOMBRE DEL USER.
  const inputDom = obtenerElementoDom("nombre_jugador");
  const nombreJugador = inputDom.value;

  ///VALIDACION: SI CARGO O NO ALGUN DATO PREVIAMENTE.
  const permitirAcceso = nombreJugador.length;
  
  if (permitirAcceso) {
    ///OCULTA EL MODAL DE INICIO.
    const elementoModalInicio = obtenerElementoDom("inicio_juego");
    ocultarElemento(elementoModalInicio);

    ///MUESTRA EL NOMBRE EN PANTALLA Y LO ALMACENA EN EL LOCALSTORAGE.
    const elementoNombre = obtenerElementoDom("nombre_usuario");
    elementoNombre.textContent = nombreJugador;
    window.localStorage.setItem("nombre", nombreJugador);
    
    ///COMIENZA EL SIMON.
    inicializacion();
  }
};


/*REINICIO DEL JUEGO*/

const accionModalFin = () => {
  ///SE OCULTA EL MODAL DEL FINAL.
  const elementoModalFinal = obtenerElementoDom("fin_juego");
  ocultarElemento(elementoModalFinal);

  ///INICIA EL JUEGO NUEVAMENTE.
  inicializacion();
};

/*BOTON DE JUEGO DEL USER*/

const clickBoton = (id) => {
  if (!estadoJuego.interaciones) {
    return;
  }

  ///SE GUARDA EN LA SECUENCIA DEL USER EL ID SELECCIONADO.
  estadoJuego.secuenciaUsuario.push(id);
  
  ///SE OBTIENE EL ID DEL PASO DE LA SECUENCIA DEL JUEGO Y LA DEL USER, LUEGO COMPARA AMBAS.
  const secuenciaJuegoEstaEtapa = estadoJuego.secuenciaJuego[estadoJuego.nivelUsuario];
  const secuenciaUsuarioEstaEtapa = estadoJuego.secuenciaUsuario[estadoJuego.nivelUsuario];
  
  ///COMPARA SECUENCIA DE USER Y SECUENCIA DE JUEGO.
  if (secuenciaJuegoEstaEtapa === secuenciaUsuarioEstaEtapa) {
    ///INCREMENTA NIVEL DE USER.
    estadoJuego.nivelUsuario = estadoJuego.nivelUsuario + 1;
  } else {
    ///OCULTA EL JUEGO.
    const elementoJuego = obtenerElementoDom("juego");
    ocultarElemento(elementoJuego);

    ///DESACTIVA INTERACCIONES.
    desactivarInteracciones();

    ///MODAL DEL FIN APARECE.
    const elementoModalFinal = obtenerElementoDom("fin_juego");
    mostrarElemento(elementoModalFinal);

    ///MUESTRA PUNTAJE FINAL.
    const puntajeDom = obtenerElementoDom("puntaje");
    puntajeDom.textContent = `Tu puntaje es ${estadoJuego.nivelJuego}`;

    return;
  }
  
  ///VERIFICA SI EL NIVEL DEL USER Y EL DEL JUEGO ESTAN EN EL MISMO NIVEL.
  if (estadoJuego.nivelJuego === estadoJuego.nivelUsuario) {
    ///INTERACCIONES OFF.
    desactivarInteracciones();
    
    ///RESETEA LA SECUENCIA DEL USUARIO.
    estadoJuego.secuenciaUsuario = [];
    
    ///RESETEA NIVEL DEL USUARIO.
    estadoJuego.nivelUsuario = 0;

    ///COMIENZA A REPRODUCIRSE UNA NUEVA SECUENCIA.
    reproducirSecuencia();
  }
};

/*OBTENCION DE ELEMENTOS ALEATORIOS*/

const obtenerElementoAleatorio = () => {
  const opcionesIds = Object.keys(estadoJuego.opciones);
  const idAleatorio = opcionesIds[Math.floor(Math.random() * opcionesIds.length)];
  
  return estadoJuego.opciones[idAleatorio];
};

/*FUNCION DE REPRODUCCION DE SECUENCIA*/

const reproducirSecuencia = () => {
  ///VARIABLE PASOS (COMIENZO DE SECUENCIA).
  let paso = 0;
  
  ///AGREGA ID A LA SECUENCIA E INCREMENTA. 
  estadoJuego.secuenciaJuego.push(obtenerElementoAleatorio().id);
  estadoJuego.nivelJuego = estadoJuego.nivelJuego + 1;

  ///DEFINE INTERVALO PARA MOSTRAR CADA PASO Y OCULTARLO.
  const intervalo = setInterval(() => {
    ///VARIABLE QUE GENERA LA PAUSA ENTRE PASOS.
    const pausaPaso = paso % 2 === 1;
    ///VARIABLE QUE DETERMINA SI ES EL ULTIMO PASO.
    const finReprodduccion = paso === (estadoJuego.secuenciaJuego.length * 2);

    if (pausaPaso) {
      ///DESACTIVA TODOS LOS BOTONES DEL JUEGO.
      desactivarElementos(botonesDelJuego);
      
      ///INCREMENTA EL PASO.
      paso++;

      return;
    }

    if (finReprodduccion) {
      ///ELIMINA INTERVALO.
      clearInterval(intervalo);
      
      ///DESACTIVA TODOS LOS BOTONES DEL JUEGO.
      desactivarElementos(botonesDelJuego);
      
      /// ACTIVA INTERACCIONES DEL USER.
      activarInteracciones();

      return;
    }

    ///OBTIENE LA REFERENCIA DEL DOM PERTENECIENTE AL PASO DE SECUENCIA (LA ENCIENDE)
    const id = estadoJuego.secuenciaJuego[paso / 2];
    const referenciaDOM = obtenerElementoDom(id);
    activarElemento(referenciaDOM)
  
    ///INCREMENTA UN PASO.
    paso++;
  }, estadoJuego.intervalos.paso);
};

/*INICIALIZACION DEL JUEGO*/

const inicializacion = () => {
  ///VARIABLE PERTENECIENTE A LOS SEGUNDOS PREVIOS A COMENZAR.
  let segundosInicio = estadoJuego.segundosInicio;

  ///RESETEA EL JUEGO.
  estadoJuego.secuenciaJuego = [];
  estadoJuego.secuenciaUsuario = [];
  estadoJuego.nivelJuego = 0;
  estadoJuego.nivelUsuario = 0;
  
  ///HTML DEL JUEGO VISIBLE.
  const elementoJuego = obtenerElementoDom("juego");
  mostrarElemento(elementoJuego);

  ///ACTUALIZA EL CONTADOR.
  const elementoCuentaRegresiva = obtenerElementoDom("cuenta_regresiva");
  mostrarElemento(elementoCuentaRegresiva);
  elementoCuentaRegresiva.textContent = segundosInicio;
  
  /// INTERVALO PARA EL TIEMPO ANTES DE COMENZAR A JUGAR.
  const intervalo = setInterval(() => {
    ///DESCUENTA 1 SEG.
    segundosInicio--;

    ///ACTUALIZA EL CONTADOR.
    elementoCuentaRegresiva.textContent = segundosInicio;

    if (segundosInicio === 0) {
      ///OCULTA EL CONTADOR.
      ocultarElemento(elementoCuentaRegresiva);

      ///REPRODUCE LA PRIMER SECUENCIA.
      reproducirSecuencia();

      ///ELIMINA INTERVALO.
      clearInterval(intervalo);
    }
  }, estadoJuego.intervalos.inicio);
};


const nombreJugadorStorage = window.localStorage.getItem("nombre");
const elementoNombre = obtenerElementoDom("nombre_jugador");
elementoNombre.value = nombreJugadorStorage || "";
