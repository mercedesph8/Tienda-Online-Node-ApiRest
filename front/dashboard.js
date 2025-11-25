// Este archivo maneja la página del dashboard

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar autenticación
    verificarAutenticacion();

    // 2. Cargar productos destacados
    cargarProductosDestacados();

    // 3. Cargar categorías
    cargarCategorias();

    // 4. Configurar botón de cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
});

// Verifica que el usuario esté autenticado
function verificarAutenticacion() {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = 'login.html';
    }
}

// Carga los productos destacados desde localStorage
function cargarProductosDestacados() {
    const tienda = JSON.parse(localStorage.getItem('tienda'));

    // Filtrar solo productos destacados
    const productosDestacados = tienda.productos.filter(p => p.destacado === true);

    // Obtener el contenedor
    const contenedor = document.getElementById('productosDestacados');
    contenedor.innerHTML = ''; // Limpiar contenido

    // Crear tarjetas de productos
    productosDestacados.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto);
        contenedor.appendChild(tarjeta);
    });
}

// Crea una tarjeta HTML para un producto
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';

    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto">
        <h4>${producto.nombre}</h4>
        <p class="descripcion">${producto.descripcion}</p>
        <p class="precio">${producto.precio.toFixed(2)}€</p>
        <button class="boton-agregar" onclick="agregarAlCarrito(${producto.id})">
            Agregar al Carrito
        </button>
        <button class="boton-ver" onclick="verProducto(${producto.id})">
            Ver Detalles
        </button>
    `;

    return tarjeta;
}

// Carga las categorías desde localStorage
function cargarCategorias() {
    const tienda = JSON.parse(localStorage.getItem('tienda'));

    const contenedor = document.getElementById('menuCategorias');
    contenedor.innerHTML = '';

    tienda.categorias.forEach(categoria => {
        const enlace = document.createElement('a');
        enlace.href = `categories.html?id=${categoria.id}`;
        enlace.textContent = categoria.nombre;

        contenedor.appendChild(enlace);
    });
}

// Agrega un producto al carrito
function agregarAlCarrito(idProducto) {
    const tienda = JSON.parse(localStorage.getItem('tienda'));
    const producto = tienda.productos.find(p => p.id === idProducto);

    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem('carrito'));

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        // Si ya existe en el carrito, incrementar cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregar nuevo producto
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.nombre} agregado al carrito`);
}

// Ver detalles de un producto
function verProducto(idProducto) {
    // Guardar producto en productos vistos
    let productosVistos = JSON.parse(localStorage.getItem('productosVistos'));

    // Solo agregar si no está ya en la lista
    if (!productosVistos.includes(idProducto)) {
        productosVistos.push(idProducto);
        localStorage.setItem('productosVistos', JSON.stringify(productosVistos));
    }

    // Redirigir a página de producto
    window.location.href = `productos.html?id=${idProducto}`;
}

// Cierra la sesión del usuario
function cerrarSesion() {
    const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');

    if (confirmar) {
        // Limpiar TODO el localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('tienda');
        localStorage.removeItem('carrito');
        localStorage.removeItem('productosVistos');

        // Redirigir al login
        window.location.href = 'login.html';
    }
}