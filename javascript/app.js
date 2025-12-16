// js/app.js

// Referencia al contenedor donde se inyectará el contenido
const appContent = document.getElementById('app-content');

// Mapeo de rutas (archivos HTML)
const routes = {
    'inicio': 'paginas/inicio.html',
    'palabras': 'paginas/palabras.html',
    'configuracion': 'paginas/configuracion.html',
    // Aquí podemos añadir 'juego', 'comoJugar', etc.
};

/**
 * Función central de navegación: Carga el HTML del archivo y lo inyecta.
 * @param {string} routeKey - La clave de la ruta a cargar (ej. 'inicio').
 */
async function navigateTo(routeKey) {
    const filePath = routes[routeKey];

    if (!filePath) {
        console.error(`Ruta no definida: ${routeKey}`);
        appContent.innerHTML = `<div class="alert alert-danger">Error: Página no encontrada (${routeKey})</div>`;
        return;
    }

    try {
        // 1. Mostrar un indicador de carga (opcional)
        appContent.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-warning" role="status"></div><p class="mt-2">Cargando...</p></div>`;

        // 2. Cargar el contenido HTML del archivo
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        // 3. Inyectar el contenido en el DOM
        appContent.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error de navegación:', error);
        appContent.innerHTML = `<div class="alert alert-danger p-4">Hubo un problema al cargar la sección. Consulte la consola.</div>`;
    }
}

// Inicialización: Cargar la pantalla de inicio al cargar la página.
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('inicio');
});

// **********************************************
// Funciones de Lógica del Juego (las definiremos después)
// **********************************************

// Ejemplo de función que usaremos luego en palabras.html
function guardarPalabras() {
    // Lógica para tomar las palabras del textarea y guardarlas
    alert("Función de guardar palabras, ¡lista para ser implementada!");
}

// Ejemplo de función de configuración de partida
function cargarConfiguracion() {
    // Esta función se activará después de cargar configuracion.html
}