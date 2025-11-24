// Este archivo maneja el formulario de login y guarda los datos en localStorage
document.addEventListener('DOMContentLoaded', () => {
    //Capturamos el formulario
    const formularioLogin = document.getElementById('formularioLogin');

    formularioLogin.addEventListener('submit', async (event) => {
        event.preventDefault(); //Detenemos el comportamiento por defecto

        //Cogemos los valores de los campos del formulario
        const nombreUsuario = document.getElementById('nombreUsuario').value;
        const contrasenia = document.getElementById('contrasenia').value;

        //Enviamos los datos al servidor para validar
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreUsuario: nombreUsuario,
                contrasenia: contrasenia,
            })
        });

        //Convertimos la respuesta del servidor a Json
        const data = await response.json();
        if (response.ok) {
            //Guardamos el token en el localStorage
            localStorage.setItem('token', data.token);
            //Guardamos la tienda completa en el localStorage
            localStorage.setItem('tienda', JSON.stringify(data.tienda));

            //Si no existe el carrito, lo guardamos vacio
            if (!localStorage.getItem('carrito')) {
                localStorage.setItem('carrito', JSON.stringify([]));
            }

            //Inicializamos productos vistos vacío si no existe
            if (!localStorage.getItem('productosVistos')) {
                localStorage.setItem('productosVistos', JSON.stringify([]));
            }

             //Redirigimos al dashboard
            window.location.href = 'dashboard.html';
            
        } else {
            alert(data.message || "Credenciales incorrectas");
        }
    })
})