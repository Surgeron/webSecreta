// Función simple para cambiar entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = ['menu-principal', 'config-partida', 'gestor-categorias', 'reglas'];
    sections.forEach(id => {
        document.getElementById(id).classList.add('d-none');
    });

    // Mostrar la seleccionada
    document.getElementById(sectionId).classList.remove('d-none');
}

// Marcador de posición para la lógica de inicio
function iniciarJuego() {
    const numJugadores = document.getElementById('total-jugadores').value;
    const categoria = document.getElementById('select-categoria').value;
    
    console.log(`Iniciando juego para ${numJugadores} jugadores en categoría ${categoria}`);
    // Aquí llamaremos a la lógica de reparto de palabras más adelante
}