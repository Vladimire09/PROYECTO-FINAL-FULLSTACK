let juegoActual = {}; 

function entrar() {
    var usuario = document.getElementById("inputUsuario").value;
    var contra = document.getElementById("inputPassword").value;

    if (usuario.trim() === "" || contra.trim() === "") {
        alert("Por favor completa los campos.");
        return;
    }

    localStorage.setItem("nombreGuardado", usuario);
    window.location.href = "TodoGaming.HTML";
}

function cargarPerfil() {
    var usuario = localStorage.getItem("nombreGuardado");
    if (document.getElementById("mostrarNombre") && usuario) {
        document.getElementById("mostrarNombre").innerText = usuario;
    }
}


function abrirModal(titulo, precio, imagen, descripcion) {
    
    juegoActual = { nombre: titulo, precio: precio, img: imagen };

    document.getElementById("m-titulo").innerText = titulo;
    document.getElementById("m-precio").innerText = (precio === 0) ? "Gratis" : "Mex $" + precio;
    document.getElementById("m-desc").innerText = descripcion;
    document.getElementById("m-img").src = imagen;

    document.getElementById("miModal").style.display = "flex";
}


function cerrarModal() {
    document.getElementById("miModal").style.display = "none";
}


function agregarDesdeModal() {
    agregarAlCarrito(juegoActual.nombre, juegoActual.precio);
    cerrarModal();
}

function agregarADeseos() {
    let lista = JSON.parse(localStorage.getItem('miListaDeseos')) || [];

    let existe = lista.find(j => j.nombre === juegoActual.nombre);
    
    if (existe) {
        alert("Ya está en tu lista de deseos");
    } else {
        lista.push(juegoActual);
        localStorage.setItem('miListaDeseos', JSON.stringify(lista));
        alert("Agregado a tu Lista de Deseos");
    }
}

function agregarAlCarrito(nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('miCarrito')) || [];
    carrito.push({ nombre: nombre, precio: precio });
    localStorage.setItem('miCarrito', JSON.stringify(carrito));
    alert("¡" + nombre + " agregado al carrito!");
}
