// Este archivo maneja la página del carrito de compras

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar autenticación
    verificarAutenticacion();

    // 2. Cargar productos del carrito
    cargarCarrito();

    // 3. Configurar botones
    document.getElementById('botonRealizarCompra').addEventListener('click', realizarCompra);
    document.getElementById('botonVaciarCarrito').addEventListener('click', vaciarCarrito);
    document.getElementById('botonCerrarSesion').addEventListener('click', cerrarSesion);
});
// Verifica que el usuario esté autenticado
function verificarAutenticacion() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
    }
}

// Carga los productos del carrito desde localStorage
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('productosCarrito');

    contenedor.innerHTML = '';

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <a href="dashboard.html" class="btn-ir-tienda">Ir a la Tienda</a>
            </div>
        `;

        // Deshabilitar botón de compra
        document.getElementById('botonRealizarCompra').disabled = true;
        document.getElementById('botonVaciarCarrito').disabled = true;

        return;
    }
    // Crear tarjetas para cada producto
    carrito.forEach((producto, index) => {
        const tarjeta = crearTarjetaCarrito(producto, index);
        contenedor.appendChild(tarjeta);
    });

    // Actualizar resumen
    actualizarResumen();
}
// tarjeta para un producto en el carrito
function crearTarjetaCarrito(producto, index) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'item-carrito';

    const subtotal = (producto.precio * producto.cantidad).toFixed(2);

    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-carrito">
        <div class="info-carrito">
            <h4>${producto.nombre}</h4>
            <p class="precio-unitario">Precio: ${producto.precio.toFixed(2)}€</p>
        </div>
        <div class="cantidad-carrito">
            <button class="btn-cantidad" onclick="decrementarCantidad(${index})">-</button>
            <span class="numero-cantidad">${producto.cantidad}</span>
            <button class="btn-cantidad" onclick="incrementarCantidad(${index})">+</button>
        </div>
        <div class="subtotal-carrito">
            <p class="precio-subtotal">${subtotal}€</p>
        </div>
        <button onclick="eliminarProducto(${index})" class="btn-eliminar">X</button>
    `;

    return tarjeta;
}
// Incrementa la cantidad de un producto
function incrementarCantidad(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito[index].cantidad++;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

// Decrementa la cantidad de un producto
function decrementarCantidad(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    }
}
// Elimina un producto del carrito
function eliminarProducto(index) {
    const confirmar = confirm('¿Eliminar este producto del carrito?');
    
    if (confirmar) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    }
}

// Vacía todo el carrito
function vaciarCarrito() {
    const confirmar = confirm('¿Estás seguro de que quieres vaciar el carrito?');

    if (confirmar) {
        localStorage.setItem('carrito', JSON.stringify([]));
        cargarCarrito();
    }
}
// Actualiza el resumen del carrito
function actualizarResumen() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Calcular total de productos
    const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

    // Calcular precio total
    const totalPrecio = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    // Mostrar en el HTML
    document.getElementById('totalProductos').textContent = totalProductos;
    document.getElementById('totalPrecio').textContent = totalPrecio.toFixed(2) + '€';
}

// Realiza la compra enviando el carrito al servidor
async function realizarCompra() {
    const token = localStorage.getItem('token');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Enviar carrito al servidor para validación
    const response = await fetch('http://localhost:3000/api/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            carrito: carrito
        })
    });

    const data = await response.json();

    if (response.ok) {
        // Compra exitosa
        alert(`¡Compra realizada con éxito!\nTotal: ${data.precioTotal}€`);

        // Vaciar el carrito
        localStorage.setItem('carrito', JSON.stringify([]));
        cargarCarrito();
    } else {
        // Error en la validación
        alert(`Error: ${data.message}\n${data.errores ? data.errores.join('\n') : ''}`);
    }
}
// Cierra la sesión del usuario
function cerrarSesion() {
    const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');

    if (confirmar) {
        localStorage.removeItem('token');
        localStorage.removeItem('tienda');
        localStorage.removeItem('carrito');
        localStorage.removeItem('productosVistos');

        window.location.href = 'login.html';
    }
}


