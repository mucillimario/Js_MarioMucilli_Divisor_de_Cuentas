fetch("json/almacen.json")
.then(response => response.json())
.then((data) => {
    console.log(data)

    for(let listaComprasCargadas of data){
        let almacenCompras = document.getElementById("hola01")
        let opcion = document.createElement("option")
        opcion.innerHTML = `${listaComprasCargadas.titulo}`
        opcion.value = `${listaComprasCargadas.titulo}`
almacenCompras.appendChild(opcion)
    }

})

const optionselect = document.getElementById(`hola01`)

optionselect.addEventListener("change", function(){
    const opcionSelccionada = optionselect.value
    const InputEnQueGasto = document.getElementById(`idQueGasto`)
    InputEnQueGasto.value = opcionSelccionada

})
