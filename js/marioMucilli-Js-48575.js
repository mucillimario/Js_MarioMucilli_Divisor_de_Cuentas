
/////////// DECLARACIONES DEL PROGRAMA ///////////
let almacen = []
let cuantosCompraron = 0;
let quienesCompraron = [];
let compras = [];
let cantidadDePersonas = 0; // Total de personas a dividir los gastos
let gastoPromedioPersona = 0;
let gastoTotal = 0;

/// DECLARACIONES PARA CONECTAR AL DOM ///

// 1- Carga de gastos por comprador 
const InputQuienGasto = document.getElementById(`idQuienGasto`)
const InputEnQueGasto = document.getElementById(`idQueGasto`)
const InputCuantoGasto = document.getElementById(`idCuantoGasto`)
const BtnAgregarGasto = document.getElementById(`btnAgregrarGasto`)

// 2 - Carga de cantidad de participantes en la reunion
const InputCantidadDePersonas = document.getElementById(`idCantidadDePersonas`)
const BtnCantidadDePersonas = document.getElementById(`btnCargarCantidadDePersonas`)


// cargar el json para el swal

fetch("json/almacen.json")
    .then(response => response.json())
    .then((data) => {
        almacen = data
    })


// PASO 01 - Ingreso de los gastos //

// Evento que escucha el click de la carga de gastos

BtnAgregarGasto.addEventListener("click", function () {

    let quienCompra = InputQuienGasto.value.toLowerCase()
    quienCompra = quienCompra.charAt(0).toUpperCase() + quienCompra.slice(1)

    let queGasto = InputEnQueGasto.value
    let cuantoGasto = parseInt(InputCuantoGasto.value)


    if (!quienCompra || !queGasto || isNaN(cuantoGasto) || cuantoGasto < 0) {
        alert(`Ups, algún campo está incompleto o el monto ingresado es negativo.
        » Quien gastó -> ingresar letras.
        » En que gastó -> ingresar letras.
        » Cuanto gastó -> solo se puede ingresar números positivos.`)
        return; 
    }

    if (quienCompra && queGasto && cuantoGasto) {
        let compraActual = new CompradorJuntada(quienCompra, queGasto, cuantoGasto);
        compraActual.mostrarDatosCompra();
        compras.push(compraActual)

        //agregar gasto por persona

        //buscamos en la lista de compradores el comprador
        let indiceComprador = quienesCompraron.findIndex(function (actualComprador) {
            return actualComprador.nombreComprador == quienCompra
        })

        // controlamos si el comprador está en el lista
        if (indiceComprador != -1) {
            // si lo encuntra se suma el gasto
            quienesCompraron[indiceComprador].sumaTotalPorComprador += cuantoGasto
        } else {
            quienesCompraron.push(new QuienGastoJuntada(quienCompra, cuantoGasto))
        }

        InputEnQueGasto.value = ""
        InputCuantoGasto.value = ""

        // swal
        let imagen = almacen.find(item => item.titulo == queGasto).imagen
        Swal.fire({
            title: 'Exito',
            text: 'Gasto Ingresado.',
            imageUrl: imagen,
            imageWidth: 150,
            imageHeight: 150,
            imageAlt: 'Custom image',
            position: 'bottom',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
            width: 220,
            height: 100,
            position: 'bottom-end',
            target: document.getElementById('form-modal'),
        })
    }
})

// // Función que contiene un objeto comprador.
function CompradorJuntada(nombre, que, cuanto) {
    this.nombreComprador = nombre;
    this.queCompra = que;
    this.cuantoCompra = cuanto;
    this.id = `${Math.random()}`;

    this.mostrarDatosCompra = function () {

        const nuevoGastoListadoParcial = document.createElement(`li`)
        let divContenedor = document.createElement(`div`)
        divContenedor.innerHTML = `<h6><b>${this.nombreComprador}</b> gastó <b>${formatoMoneda(this.cuantoCompra)}</b> en <b>${this.queCompra}</b></h6>
        `
        divContenedor.className = `listadoHorizotalGastosParciales`

        nuevoGastoListadoParcial.appendChild(divContenedor)
        document.getElementById(`listadoGastosParciales`).appendChild(nuevoGastoListadoParcial)
    };
}

// PASO 02 - Proceso de los gastos //


// Evento calcular totales

const BtnCalcularTotales = document.getElementById(`btnCalcularTotales`)

BtnCalcularTotales.addEventListener("click", function () {


    // Sort, ordena el listado de compradores total de mayor a menor gasto    

    let quienesCompraronOrdenado = quienesCompraron.sort(function (a, b) {
        return b.sumaTotalPorComprador - a.sumaTotalPorComprador
    })

    document.getElementById(`listadoGastosTotalesComprador`).innerHTML = "";
    document.getElementById(`idGastoTotal`).innerHTML = "";
    document.getElementById(`idDevolucion`).innerHTML = ""



    for (indice in quienesCompraronOrdenado) {
        quienesCompraronOrdenado[indice].mostrarCompraTotalComprador()
    }

})

///// Función que hace la sumatoria del gasto total de cada comprador.  

function QuienGastoJuntada(nombre, sumaTotalPorComprador) {
    this.nombreComprador = nombre;
    this.sumaTotalPorComprador = sumaTotalPorComprador;

    this.mostrarCompraTotalComprador = function () {

        const totalGastoCompradorListado = document.createElement(`li`)
        totalGastoCompradorListado.innerHTML = `<h6><b>${this.nombreComprador}</b> gastó en total <b>${formatoMoneda(this.sumaTotalPorComprador)}</b></h6>`
        document.getElementById(`listadoGastosTotalesComprador`).appendChild(totalGastoCompradorListado)
    };
}

///////////// borra los ol de gastos parciales y actualiza el total

function borrarTodo() {
    document.getElementById(`listadoGastosParciales`).innerHTML = ""
    document.getElementById(`listadoGastosTotalesComprador`).innerHTML = ""
    document.getElementById(`idGastoTotal`).innerHTML = ""
    document.getElementById(`idDevolucion`).innerHTML = ""
    cuantosCompraron = 0;
    quienesCompraron = [];
    compras = [];
    cantidadDePersonas = 0; // Total de personas a dividir los gastos
    gastoPromedioPersona = 0;
    gastoTotal = 0;
}

btnBorrarTODO.addEventListener("click", borrarTodo)


// PASO 03 - Devoluciones //

// Evento que escucha el click de la carga de cantidad de personas

BtnCantidadDePersonas.addEventListener("click", function () {

    let gastoTotal = 0

    for (indice in quienesCompraron) {
        gastoTotal += quienesCompraron[indice].sumaTotalPorComprador
    }

    cantidadDePersonas = parseInt(InputCantidadDePersonas.value)

    let gastoPromedioPersona = gastoTotal / cantidadDePersonas

    // renderizar el gasto por persona, cuando click en boton "calcular" 

    const pGastoTotal = document.getElementById(`idGastoTotal`)

    pGastoTotal.innerHTML = "";

    pGastoTotal.innerHTML = (
        `<h6>» El total de las compras fueron<b> ${formatoMoneda(gastoTotal)}</b>.
    <br>» Ingresaste que las compras se dividen en <b>${cantidadDePersonas}</b> integrantes.
    <br>» Cada integrante debe poner <b>$${gastoPromedioPersona.toFixed(2)}</b> en la mesa.</h6>
    <br>» Se deben devolver <b>$${gastoPromedioPersona.toFixed(2)}</b> por persona.</h6>
        `)



    // comienza a calcular devoluciones por cada comprador

    const olDevolucionPorComprador = document.getElementById(`idDevolucion`)
    olDevolucionPorComprador.innerHTML = "";


    for (indice in quienesCompraron) {

        const olDevolucionPorComprador = document.getElementById(`idDevolucion`)

        let compradorActual = quienesCompraron[indice]

        let montoDevolver = compradorActual.sumaTotalPorComprador - gastoPromedioPersona
        const liDevolucionPorComprador = document.createElement(`li`)

        if (montoDevolver > 0) {
            liDevolucionPorComprador.innerHTML = (`<h6><b>» ${compradorActual.nombreComprador} debe recuperar ${formatoMoneda(montoDevolver)}</b></h6>`)
        } else if (montoDevolver < 0) {
            liDevolucionPorComprador.innerHTML = (`<h6><b>» ${compradorActual.nombreComprador} tiene que poner ${formatoMoneda(Math.abs(montoDevolver))}</b</h6>`)
        } else {
            liDevolucionPorComprador.innerHTML = (`<h6><b>» ${compradorActual.nombreComprador} no hace falta ningún movimiento, salio hecho</b</h6>`)
        }

        olDevolucionPorComprador.appendChild(liDevolucionPorComprador)

    }
})

// Funcion que formatea nuevo a moneda.

function formatoMoneda(moneda) {
    return '$ ' + moneda.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}



// Demuestra el true o false en el Local Storage y mantiene el estado del modo al cerrar la pestaña 

function store(value) {
    localStorage.setItem(`darkmode`, value)
}

