
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

fetch("almacen.json")
    .then(response => response.json())
    .then((data) => {
        almacen = data
    })


// EVENTOS //

// Evento calcular totales

const BtnCalcularTotales = document.getElementById(`btnCalcularTotales`)

BtnCalcularTotales.addEventListener("click", function () {


    // Sort, ordena el listado de compradores total de mayor a menor gasto    

    let quienesCompraronOrdenado = quienesCompraron.sort(function (a, b) {
        return b.sumaTotalPorComprador - a.sumaTotalPorComprador
    })
    //////////////////////----////////////////////// se sumo     document.getElementById(`listadoGastosTotalesComprador`).innerHTML = "";
    document.getElementById(`listadoGastosTotalesComprador`).innerHTML = "";
    //////////////////////----//////////////////////
    for (indice in quienesCompraronOrdenado) {
        quienesCompraronOrdenado[indice].mostrarCompraTotalComprador()
    }

})

// Evento que escucha el click de la carga de gastos

BtnAgregarGasto.addEventListener("click", function () {

    let quienCompra = InputQuienGasto.value.toLowerCase()
    quienCompra = quienCompra.charAt(0).toUpperCase() + quienCompra.slice(1)

    let queGasto = InputEnQueGasto.value
    let cuantoGasto = parseInt(InputCuantoGasto.value)

    if (!quienCompra) {
        alert(`Ups, te olvidaste cargar el campo de "Quién gastó", 
        Recordá que es necesario que los 3 campos estén completos :)`)
    }
    if (!queGasto) {
        alert(`Ups, te olvidaste cargar el campo de "En que gastó", 
        Recordá que es necesario que los 3 campos estén completos :)`)       
    }
    if (!cuantoGasto) {
        alert(`Ups, te olvidaste cargar el campo de "Cuanto gastó", 
        Recordá que es necesario que los 3 campos estén completos :)`)   
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
        divContenedor.innerHTML = `<p><b>${this.nombreComprador}</b> ingresó un gasto parcial de <b>${formatoMoneda(this.cuantoCompra)}</b> en <b>${this.queCompra}</b></p>
        `
        divContenedor.className = `listadoHorizotalGastosParciales`

        
        nuevoGastoListadoParcial.appendChild(divContenedor)

        document.getElementById(`listadoGastosParciales`).appendChild(nuevoGastoListadoParcial)
    };
}


///// Función que hace la sumatoria del gasto total de cada comprador.  

function QuienGastoJuntada(nombre, sumaTotalPorComprador) {
    this.nombreComprador = nombre;
    this.sumaTotalPorComprador = sumaTotalPorComprador;

    this.mostrarCompraTotalComprador = function () {

        const totalGastoCompradorListado = document.createElement(`li`)
        totalGastoCompradorListado.innerText = `${this.nombreComprador} gastó en total ${formatoMoneda(this.sumaTotalPorComprador)}`
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



///// borra un gasto parcial de la lista 




////// Evento del boton Agregar cantidad de personas, que dispara la sumatoria total de gastos y genera el promedio por persona


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
    //////////////////////----//////////////////////// se le sumo el innerHTML = "";
    pGastoTotal.innerHTML = "";
    //////////////////////----//////////////////////
    pGastoTotal.innerHTML = (`El total de las compras fueron ${formatoMoneda(gastoTotal)}.<br>Ingresaste que las compras se dividen en ${cantidadDePersonas} integrantes .<br>Se deben devolver $${gastoPromedioPersona.toFixed(2)} por persona.`)

    // comienza a calcular devoluciones por cada comprador

    //////////////////////----//////////////////////  se quito la linea "    const olDevolucionPorComprador = document.getElementById(`idDevolucion`)" y se la saco del for que esta abajo!
    // se le sumo el innerHTML = "";
    const olDevolucionPorComprador = document.getElementById(`idDevolucion`)
    olDevolucionPorComprador.innerHTML = "";
    //////////////////////----//////////////////////

    for (indice in quienesCompraron) {

        const olDevolucionPorComprador = document.getElementById(`idDevolucion`)

        let compradorActual = quienesCompraron[indice]

        let montoDevolver = compradorActual.sumaTotalPorComprador - gastoPromedioPersona
        const liDevolucionPorComprador = document.createElement(`li`)

        if (montoDevolver > 0) {
            liDevolucionPorComprador.innerHTML = (`» ${compradorActual.nombreComprador} debe recuperar ${formatoMoneda(montoDevolver)}`)
        } else if (montoDevolver < 0) {
            liDevolucionPorComprador.innerHTML = (`» ${compradorActual.nombreComprador} tiene que poner ${formatoMoneda(Math.abs(montoDevolver))}`)
        } else {
            liDevolucionPorComprador.innerHTML = (`» ${compradorActual.nombreComprador} no tienes que devolver ni poner dinero, salio hecho`)
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


