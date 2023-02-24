////////////////////// MODO DARK //////////////////////

const botonModoOscuro = document.getElementById(`IdBotonModoOscuro`);
const body = document.getElementById(`IdBody`);


disparoModoOscuro();

botonModoOscuro.addEventListener("click", e => {
    body.classList.toggle(`darkmode`);
    store(body.classList.contains(`darkmode`))

    // If que cambia el texto de botón
    if (botonModoOscuro.innerText == `Modo Oscuro`)
        botonModoOscuro.innerText = `Modo Oscuro Activado`;
    else {
        botonModoOscuro.innerText = `Modo Oscuro`;
    }

});

function disparoModoOscuro() {
    const darkmode = localStorage.getItem(`darkmode`)

    if (!darkmode) {
        store(`false`)


    } else if (darkmode == `true`) {
        body.classList.add(`darkmode`)
    }
}

// Demuestra el true o false en el Local Storage y mantiene el estado del modo al cerrar la pestaña 

function store(value) {
    localStorage.setItem(`darkmode`, value)


}