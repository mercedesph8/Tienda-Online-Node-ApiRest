// Este archivo maneja la página de categorías

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();

    //Obtengo el ID de categoría desde la URL
    const idCategoria = obtenerIdCategoriaURL();

    //Cargo información de la categoríaa
    cargarInfoCategoria(idCategoria);

    //Configurar boton de cerrrar sesion
    document.getElementById('botonCerrarSesion').addEventListener('click', cerrarSesion);

    function verificarAutenticacion() {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = 'login.html';
        }
    }

    // Obtiene el ID de categoría desde la URL
    function obtenerIdCategoriaURL() {
        // Ejemplo de URL: categorias.html?id=1
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        // Convertir a número
        return parseInt(id);
    }
    //Carga la información de la categoría (nombre y descripción)
    function cargarInfoCategoria(idCategoria) {
        const tienda = JSON.parse(localStorage.getItem('tienda'));
        const categoria = tienda.categorias.find(c => c.id === idCategoria);

        if (!categoria) {
            alert('Categoría no encontrada');
            window.location.href = 'dashboard.html';
            return;
        }

        // Mostrar nombre y descripción
        document.getElementById('nombreCategoria').textContent = categoria.nombre;
        document.getElementById('descripcionCategoria').textContent = categoria.descripcion;
    }
    // Carga los productos de la categoría
    function cargarProductosCategoria(idCategoria) {
        const tienda = JSON.parse(localStorage.getItem('tienda'));

        // Filtrar productos de esta categoría
        const productosCategoria = tienda.productos.filter(p => p.id_categoria === idCategoria);

        const contenedor = document.getElementById('productosCategoria');
        contenedor.innerHTML = '';

        // Si no hay productos
        if (productosCategoria.length === 0) {
            contenedor.innerHTML = '<p>No hay productos en esta categoría</p>';
            return;
        }

        // Crear tarjetas de productos
        productosCategoria.forEach(producto => {
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
    // Agrega un producto al carrito
    function agregarAlCarrito(idProducto) {
        const tienda = JSON.parse(localStorage.getItem('tienda'));
        const producto = tienda.productos.find(p => p.id === idProducto);

        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        let carrito = JSON.parse(localStorage.getItem('carrito'));

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
    // Ver detalles de un producto
    function verProducto(idProducto) {
        let productosVistos = JSON.parse(localStorage.getItem('productosVistos'));

        if (!productosVistos.includes(idProducto)) {
            productosVistos.push(idProducto);
            localStorage.setItem('productosVistos', JSON.stringify(productosVistos));
        }

        window.location.href = `product.html?id=${idProducto}`;
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
});