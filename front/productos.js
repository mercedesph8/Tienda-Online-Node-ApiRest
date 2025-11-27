// Este archivo maneja la página de detalle de producto

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar autenticación
    verificarAutenticacion();

    // 2. Obtener ID del producto desde la URL
    const idProducto = obtenerIdProductoURL();

    // 3. Guardar en productos vistos
    guardarProductoVisto(idProducto);

    // 4. Cargar información del producto
    cargarDetalleProducto(idProducto);

    // 6. Configurar botón de agregar al carrito
    document.getElementById('botonAgregarCarrito').addEventListener('click', () => {
        agregarAlCarrito(idProducto);
    });
    // 7. Configurar botón de cerrar sesión
    document.getElementById('botonCerrarSesion').addEventListener('click', cerrarSesion);
});

// Verifica que el usuario esté autenticado
function verificarAutenticacion() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
    }
}

// Obtiene el ID del producto desde la URL
function obtenerIdProductoURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return parseInt(id);
}

// Guarda el producto en la lista de productos vistos
function guardarProductoVisto(idProducto) {
    let productosVistos = JSON.parse(localStorage.getItem('productosVistos'));

    // Solo agregar si no está ya en la lista
    if (!productosVistos.includes(idProducto)) {
        productosVistos.push(idProducto);
        localStorage.setItem('productosVistos', JSON.stringify(productosVistos));
    }
}
// Carga la información detallada del producto
function cargarDetalleProducto(idProducto) {
    const tienda = JSON.parse(localStorage.getItem('tienda'));
    const producto = tienda.productos.find(p => p.id === idProducto);

    if (!producto) {
        alert('Producto no encontrado');
        window.location.href = 'dashboard.html';
        return;
    }

    // Obtener nombre de la categoría
    const categoria = tienda.categorias.find(c => c.id === producto.id_categoria);

    // Mostrar información en el HTML
    document.getElementById('imagenProducto').src = producto.imagen;
    document.getElementById('imagenProducto').alt = producto.nombre;
    document.getElementById('nombreProducto').textContent = producto.nombre;
    document.getElementById('categoriaProducto').textContent = categoria ? categoria.nombre : 'Sin categoría';
    document.getElementById('descripcionProducto').textContent = producto.descripcion;
    document.getElementById('precioProducto').textContent = producto.precio.toFixed(2);
}

// Agrega el producto al carrito
function agregarAlCarrito(idProducto) {
    const tienda = JSON.parse(localStorage.getItem('tienda'));
    const producto = tienda.productos.find(p => p.id === idProducto);

    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.nombre} agregado al carrito`);
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
