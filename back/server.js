const express = require("express"); //framework Express para crear el servidor web
const crypto = require("crypto"); //para encriptar
const cors = require("cors"); //para permitir peticiones desde el front
const path = require("path");
const fs = require("fs"); // Necesario para leer archivos json

const app = express(); //Creamos la aplicación express
app.use(express.json()); //Para que convierta los archivos json en JS y pueda manejarlos
app.use(cors()); //Habilitamos CORS para todas las rutas

const frontPath = path.join(__dirname, '../front'); //Definimos la ruta del front
app.use(express.static(frontPath)); //Servimos los archivos estáticos del front

// Ruta raíz que redirige al login
app.get('/', (req, res) => {
    res.redirect('/login.html');
});


//Clave secreta para firmar los tokens JWT
const SECRET_KEY = "mi_clave_secreta";
const PORT = process.env.PORT || 3000; //Le dice que use el puerto que está en la variable de entorno PORT y si no existe, usa el puerto 3000

function base64UrlEncode(data) {
    return Buffer.from(data).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function base64UrlDecode(data) {
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(data, 'base64').toString('utf8');
}

function crearJWT(payload) {
    const header = {
        alg: "HS256",
        typ: 'JWT'
    };
    
    const headerCodificado = base64UrlEncode(JSON.stringify(header));
    const payloadCodificado = base64UrlEncode(JSON.stringify(payload));

    const firma = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(`${headerCodificado}.${payloadCodificado}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return `${headerCodificado}.${payloadCodificado}.${firma}`;
}

function verificarJWT(token) {
    const partes = token.split('.');
    
    if (partes.length !== 3) {
        return null;
    }
    
    const [headerCodificado, payloadCodificado, firmaRecibida] = partes;

    const firmaEsperada = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(`${headerCodificado}.${payloadCodificado}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    if (firmaRecibida !== firmaEsperada) {
        return null;
    }

    const payload = JSON.parse(base64UrlDecode(payloadCodificado));
    return payload;
}


//Para cargar los datos de los archivos JSON

// Leer usuarios desde usuarios.json
const usuarios = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'usuarios.json'), 'utf-8')
);

// Leer tienda desde tienda.json
const tienda = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tienda.json'), 'utf-8')
);

//Endpoint de login que 
 app.post('/api/login', (req, res) => {
    const { nombreUsuario, contrasenia } = req.body;

    // Buscar usuario en el array cargado de usuarios.json
    const usuario = usuarios.find(user =>
        user.nombreUsuario === nombreUsuario && user.contrasenia === contrasenia
    );

    // Si no existe, error 401
    if (!usuario) {
        return res.status(401).json({
            message: "Credenciales incorrectas"
        });
    }

    // Si existe, crear el token
    const payload = {
        nombreUsuario: usuario.nombreUsuario,
        fechaExpiracion: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
    };

    const token = crearJWT(payload);

    //La respuesta es el token y la tienda completa
 res.json({
        message: 'Autenticación correcta',
        token: token,
        tienda: tienda 
    });
});

// Endpoint del Carrito (Tiene que verificar precios antes de procesar la compra)
app.post('/api/carrito', (req,res) => {
   //Verificamos que el header existe, si no existe, error 
    const autenticacionHeader = req.header ['autorizathion'];
     if (!autenticacionHeader) {
        return res.status(403).json({
            message: "No tienes permisos para acceder"
        });
    }

    const token = autenticacionHeader.split(' ')[1]; //Separo y cojo la segunda parte (el token)
    const payload = verificarJWT(token);
    //Si el payload es inválido,error
     if (!payload) {
        return res.status(403).json({
            message: 'Token inválido o expirado'
        });
    }
     //Si no, recibo el carrito del cliente
     const { carrito} = req.body;

     //Verifico los productos del carrito
     let precioTotal = 0;
     let hayErrores = false;
     const errores = [];
     
     carrito.forEach(item => {
        //Busco el producto real de la tienda
        const productoReal = tienda.productos.find (p => p.id === item.id);
        //Si el producto no existe o el precio no coincide,error
        if (!productoReal) {
            hayErrores = true;
            errores.push(`El producto con ID ${item.id} no existe.`);
        } else if (productoReal.precio !== item.precio) { //Esto es porque el precio peude haber sido manipulado desde el front
            hayErrores = true;
            errores.push(`El precio del producto con ID ${item.id} ha cambiado. Precio actual: ${productoReal.precio}`);
        }else {//Si todo esta bien, sumo el precio al total
            precioTotal += productoReal.precio * item.cantidad;
        }
     });

     //Si ha habido errores, los envío
     if (hayErrores) {
        return res.status(400).json({
            message: 'Errores en el carrito',
            errores: errores
        });
     }
     //Si todo ha ido bien, confirmo la compra
     res.json({
        message: 'Gracias por su compra',
        precioTtotal: precioTotal.toFixed(2),//Formateo a 2 decimales, devuelve string
        usuario: payload.nombreUsuario
     });
});
    
// Arrancar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`${usuarios.length} usuarios cargados`);
    console.log(`${tienda.categorias.length} categorías y ${tienda.productos.length} productos disponibles`);
});