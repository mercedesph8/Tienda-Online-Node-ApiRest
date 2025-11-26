// Este archivo maneja la página del dashboard

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar autenticación
    verificarAutenticacion();
    
    // 2. Cargar categorías en el header (menú horizontal)
    cargarCategoriasMenu();
    
    // 3. Cargar categorías con imágenes (sección principal)
    cargarCategoriasConImagenes();
    
    // 4. Cargar productos destacados (solo 4)
    cargarProductosDestacados();
    
    // 5. Configurar botón cerrar sesión
    document.getElementById('botonCerrarSesion').addEventListener('click', cerrarSesion);
});

// Verifica que el usuario esté autenticado
function verificarAutenticacion() {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = 'login.html';
    }
}

//Cargar las categorías del Menu
function cargarCategoriasMenu() {
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
// Cargar las categorías con imágenes
function cargarCategoriasConImagenes() {
    const tienda = JSON.parse(localStorage.getItem('tienda'));
    const contenedor = document.getElementById('listadoCategorias');
    
    contenedor.innerHTML = '';
    
    // Imágenes ilustrativas para cada categoría
    const imagenesCategoria = {
        1: '/imagenes/slider2.jpg',  // Pan de Trigo
        2: '/imagenes/slider2.jpg',  // Centeno
        3: '/imagenes/slider2.jpg',  // Espelta
        4: '/imagenes/slider2.jpg',  // Sin Gluten
        5: '/imagenes/slider2.jpg'   // Especiales
    };
    
    tienda.categorias.forEach(categoria => {
        const tarjeta = crearTarjetaCategoriaConImagen(categoria, imagenesCategoria);
        contenedor.appendChild(tarjeta);
    });
}
//Tarjeta de categoría con imagen
function crearTarjetaCategoriaConImagen(categoria, imagenes) {
    const enlace = document.createElement('a');
    enlace.href = `categories.html?id=${categoria.id}`;
    enlace.className = 'tarjeta-categoria-imagen';
    
    // Obtener la imagen correspondiente o usar una por defecto
    const imagenUrl = imagenes[categoria.id] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400';
    
    enlace.innerHTML = `
        <img src="${imagenUrl}" alt="${categoria.nombre}">
        <div class="categoria-info">
            <h3>${categoria.nombre}</h3>
            <p>${categoria.descripcion}</p>
        </div>
    `;
    
    return enlace;
}

//Cargar productos destacados
function cargarProductosDestacados() {
    const tienda = JSON.parse(localStorage.getItem('tienda'));
    const contenedor = document.getElementById('productosDestacados');
    
    contenedor.innerHTML = '';
    
    // Filtrar solo los productos destacados
    const productosDestacados = tienda.productos.filter(producto => producto.destacado === true);
    
    // Limitar a los primeros 4 productos
    const primeros4 = productosDestacados.slice(0, 4);
    
    primeros4.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto);
        contenedor.appendChild(tarjeta);
    });
}

// Crea una tarjeta del producto
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';
    
    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="contenido-tarjeta">
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
            <div class="precio">${producto.precio.toFixed(2)}€</div>
            <div class="botones-tarjeta">
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al Carrito
                </button>
                <button class="btn-ver-detalles" onclick="verProducto(${producto.id})">
                    Ver Detalles
                </button>
            </div>
        </div>
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