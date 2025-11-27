# Panadería Masa&Madre - Tienda Online

Aplicación web de comercio electrónico para una panadería artesanal, desarrollada con Node.js, Express y JavaScript.

## Descripción

Tienda online completa con sistema de autenticación JWT, gestión de carrito de compras y validación de precios en el servidor para garantizar la seguridad de las transacciones.

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **JWT (JSON Web Token)** - Sin usar librerías externas

### Frontend
- **HTML5** 
- **JavaScript (ES6+)** - Para la lógica del cliente
- **SCSS/SASS** - Para los estilos
- **LocalStorage** - Almacenamiento en el navegador

### Herramientas de Desarrollo
- **npm** - Gestor de paquetes
- **Git** - Control de versiones


## Credenciales de Prueba
```
Usuario: admin
Contraseña: admin123

Usuario: usuario1
Contraseña: 1111

Usuario: usuario2
Contraseña: 2222

```

## Funcionalidades

### Autenticación y Seguridad
- ✅ Sistema de login con JWT personalizado (sin librerías externas)
- ✅ Tokens con expiración de 1 hora
- ✅ Verificación de autenticación en todas las páginas protegidas
- ✅ Validación de precios en el servidor para evitar manipulación

### Catálogo de Productos
- ✅ Dashboard con slider automático de imágenes
- ✅ Productos destacados en la página principal
- ✅ Navegación por categorías con imágenes
- ✅ Página de detalle de producto con información completa
- ✅ Sistema de productos vistos recientemente

### Carrito de Compras
- ✅ Agregar productos al carrito desde cualquier página
- ✅ Modificar cantidades (+/-)
- ✅ Eliminar productos individuales
- ✅ Vaciar carrito completo
- ✅ Cálculo automático de subtotales y total
- ✅ Resumen del pedido sticky

### Proceso de Compra
- ✅ Validación de precios en el servidor antes de procesar
- ✅ Verificación de existencia de productos
- ✅ Detección de intentos de manipulación de precios
- ✅ Confirmaciones de acciones importantes


## Autora
Mercedes Peña


## Licencia

Este proyecto es de uso educativo para la asignatura de Desarrollo Web.
