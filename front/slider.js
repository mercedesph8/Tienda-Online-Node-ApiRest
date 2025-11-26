// Este archivo maneja el slider de imágenes del dashboard

let slideActual = 0;  
let intervaloSlider;  

function cambiarSlide(direccion) {
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    // Quitar la clase 'active' del slide actual
    slides[slideActual].classList.remove('active');
    indicadores[slideActual].classList.remove('active');
    
    // Calcular el nuevo índice
    slideActual = slideActual + direccion;
    
    // Si se pasa del último, volver al primero
    if (slideActual >= slides.length) {
        slideActual = 0;
    }
    
    // Si está antes del primero, ir al último
    if (slideActual < 0) {
        slideActual = slides.length - 1;
    }
    
    // Añadir la clase 'active' al nuevo slide
    slides[slideActual].classList.add('active');
    indicadores[slideActual].classList.add('active');
    
    // Reiniciar el auto-play
    reiniciarAutoPlay();
}


function irASlide(indice) {
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    // Quitar 'active' del slide actual
    slides[slideActual].classList.remove('active');
    indicadores[slideActual].classList.remove('active');
    
    // Cambiar al nuevo índice
    slideActual = indice;
    
    // Añadir 'active' al nuevo slide
    slides[slideActual].classList.add('active');
    indicadores[slideActual].classList.add('active');
    
    // Reiniciar el auto-play
    reiniciarAutoPlay();
}

//cambio automático
function iniciarAutoPlay() {
    intervaloSlider = setInterval(() => {
        cambiarSlide(1);  
    }, 5000);
}


function reiniciarAutoPlay() {
    // Detener el intervalo actual
    clearInterval(intervaloSlider);
    // Iniciar uno nuevo
    iniciarAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarAutoPlay();
});