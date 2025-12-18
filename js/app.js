// js/app.js

/**
 * Función para cargar contenido HTML dinámicamente en un contenedor.
 * @param {string} tabId - El ID del tab (ej: 'juego' o 'categorias').
 * @param {string} componentPath - La ruta al archivo HTML del componente.
 * @param {function} callback - Función a ejecutar después de cargar el contenido.
 */
async function loadComponent(tabId, componentPath, callback = null) {
    const container = document.getElementById(tabId);
    if (!container) return; // Salir si el contenedor no existe

    try {
        // 1. Realizar la petición Fetch para obtener el contenido
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        // 2. Insertar el contenido en el contenedor
        container.innerHTML = htmlContent;
        
        // 3. Ejecutar la función de inicialización específica (si existe)
        if (callback) {
            callback();
        }

    } catch (error) {
        console.error("Fallo al cargar el componente:", error);
        container.innerHTML = `<p class="alert alert-danger">Error: No se pudo cargar la interfaz. ${error.message}</p>`;
    }
}


// Importar las funciones CRUD de IndexedDB
import { saveCategory, getCategories, deleteCategory } from './db.js';
import { setupGame } from './game-logic.js';

// =========================================================
// INICIALIZACIÓN Y EVENTOS DE CARGA
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const mainTab = document.getElementById('mainTab');

    if (mainTab) {
        // Mapeo de tabs a componentes y callbacks
        const tabMap = {
            'juego-tab': { 
                path: 'components/game-config.html', 
                callback: initializeGameConfig 
            },
            'categorias-tab': { 
                path: 'components/category-manager.html', 
                callback: initializeCategoryManager 
            }
        };

        // 1. Escuchar el evento 'shown.bs.tab' para la carga DINÁMICA
        mainTab.addEventListener('shown.bs.tab', (event) => {
            const activeTabId = event.target.id;
            const targetPaneId = event.target.getAttribute('data-bs-target').substring(1); // ej: 'juego'

            if (tabMap[activeTabId]) {
                const { path, callback } = tabMap[activeTabId];
                // Llama a loadComponent SÓLO cuando se cambia de pestaña
                loadComponent(targetPaneId, path, callback);
            }
        });
        
        // 2. Cargar el componente inicial (JUEGO) al iniciar la página
        // Esto asegura que la pestaña activa tenga su contenido inmediatamente.
        loadComponent('juego', 'components/game-config.html', initializeGameConfig)
            .catch(error => console.error("Fallo la carga inicial del componente de juego:", error));
            
        // Si tienes problemas de rutas, revisa la consola del navegador (F12) 
        // para ver errores 404 de archivos HTML.
    }
});

// =========================================================
// FUNCIONES DE INICIALIZACIÓN DE COMPONENTES (Stubs)
// =========================================================

// =========================================================
// MÓDULO: CONFIGURACIÓN DE JUEGO (Necesita las categorías)
// =========================================================

/**
 * Actualiza el elemento <select> de la configuración de juego con las categorías.
 */
function updateCategorySelect(categories) {
    const select = document.getElementById('select-categoria');
    if (!select) return;

    select.innerHTML = '';
    
    if (categories.length === 0) {
        select.innerHTML = '<option value="" disabled selected>No hay categorías. Crea una primero.</option>';
        document.getElementById('iniciar-juego').disabled = true;
    } else {
        select.innerHTML = '<option value="" disabled selected>--- SELECCIONA UNA CATEGORÍA ---</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id; // Usamos el ID de IndexedDB como valor
            option.textContent = `${cat.name} (${cat.words.length} palabras)`;
            select.appendChild(option);
        });
        document.getElementById('iniciar-juego').disabled = false;
    }
}
function updateImpostorMax() {
    const numJugadoresInput = document.getElementById('num-jugadores');
    const numImpostoresInput = document.getElementById('num-impostores');
    const maxLabel = document.getElementById('max-impostores-label');

    if (numJugadoresInput && numImpostoresInput && maxLabel) {
        let jugadores = parseInt(numJugadoresInput.value) || 3;
        
        // Asegurar que el mínimo sea 3 (validación JS adicional)
        if (jugadores < 3) {
            jugadores = 3;
            numJugadoresInput.value = 3;
        }
        
        // Máximo de impostores = Jugadores - 1 (siempre debe haber al menos 1 Agente)
        const maxImpostores = jugadores > 1 ? jugadores - 1 : 1; 

        // Actualizar el DOM
        numImpostoresInput.max = maxImpostores;
        maxLabel.textContent = maxImpostores;

        // Si el valor actual de impostores excede el nuevo máximo, corregirlo
        if (parseInt(numImpostoresInput.value) > maxImpostores) {
            numImpostoresInput.value = maxImpostores;
        }
        // Asegurar que el mínimo sea 1
        if (parseInt(numImpostoresInput.value) < 1) {
             numImpostoresInput.value = 1;
        }
    }
}

/** Inicializa la lógica para la configuración de la partida. */
export function initializeGameConfig() {
    console.log("Configuración de juego inicializada.");
    
    // 1. Asegurar que las categorías se carguen en el select
    loadAndRenderCategories(); // Esto también llama a updateCategorySelect
    
    // 2. Añadir el evento al botón INICIAR JUEGO
    document.getElementById('iniciar-juego').addEventListener('click', handleStartGame);
    
    // 3. Añadir listener para actualizar el max de impostores dinámicamente
    const numJugadoresInput = document.getElementById('num-jugadores');
    if (numJugadoresInput) {
        // Ejecutar la función inmediatamente al cargar
        updateImpostorMax(); 
        // Ejecutar la función cada vez que cambia el valor del input
        numJugadoresInput.addEventListener('input', updateImpostorMax);
    }
}

// Función de marcador de posición para iniciar el juego (lo haremos después)
async function handleStartGame() {
    const numJugadores = parseInt(document.getElementById('num-jugadores').value);
    const numImpostores = parseInt(document.getElementById('num-impostores').value);
    const categoriaId = document.getElementById('select-categoria').value;
    
    // CAPTURAR EL MODO DE REVELACIÓN
    const modoRevelacion = document.querySelector('input[name="revelacion-mode"]:checked').value;

    // --- Validación ---
    if (isNaN(numJugadores) || numJugadores < 3) {
        alert("El número de jugadores debe ser al menos 3.");
        return;
    }
    if (isNaN(numImpostores) || numImpostores < 1) {
        alert("Debe haber al menos 1 impostor.");
        return;
    }
    if (numImpostores >= numJugadores) {
        alert("La cantidad de impostores no puede ser igual o mayor al número de agentes (jugadores - 1).");
        return;
    }
    if (!categoriaId) {
        alert("Debes seleccionar una categoría para empezar el juego.");
        return;
    }

    // ⛔ NUEVA VALIDACIÓN: Bloquear el modo 'sonoro'
    if (modoRevelacion === 'sonoro') {
        alert("El modo 'Sonoro' aún no está disponible en esta versión. Por favor, selecciona el modo 'Clásico' para iniciar la partida.");
        return; // Detiene la ejecución de la función
    }

    // --- Si la validación es exitosa, preparamos el juego ---
    console.log(`Iniciando juego: ${numJugadores} jugadores, ${numImpostores} impostores, Modo: ${modoRevelacion}, Categoría ID: ${categoriaId}`);
    
    // 1. Obtener los detalles de la categoría seleccionada
    const categories = await getCategories();
    const selectedCategory = categories.find(c => c.id == categoriaId); // Usar == para comparar number con string
    
    if (!selectedCategory || selectedCategory.words.length < 3) {
        alert("La categoría seleccionada no es válida o tiene muy pocas palabras.");
        return;
    }

    // 2. Preparar los datos del juego y pasar a la lógica principal
    const gameConfig = {
        jugadores: numJugadores,
        impostores: numImpostores,
        categoria: selectedCategory,
        modo: modoRevelacion
    };

    // La siguiente función es la que debemos crear:
    showRoleRevealScreen(gameConfig);
}

// =========================================================
// MÓDULO: GESTOR DE CATEGORÍAS
// =========================================================

/**
 * Renderiza la lista de categorías guardadas en la interfaz.
 * @param {object[]} categories - La lista de categorías.
 */
function renderCategoryList(categories) {
    const listContainer = document.getElementById('lista-categorias');
    if (!listContainer) return;

    if (categories.length === 0) {
        listContainer.innerHTML = '<p class="text-center text-info mt-4">Aún no hay categorías. ¡Crea una nueva!</p>';
        return;
    }

    listContainer.innerHTML = '';
    
    // Crear una card de Bootstrap por cada categoría
    categories.forEach(cat => {
        const wordCount = cat.words ? cat.words.length : 0;
        const card = document.createElement('div');
        card.className = 'card bg-dark border-secondary mb-3';
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title text-warning">${cat.name}</h5>
                    <p class="card-text text-muted">${wordCount} Palabras</p>
                </div>
                <div>
                    <button class="btn btn-outline-info btn-sm edit-btn me-2" data-id="${cat.id}">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${cat.id}">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
    
    // Añadir eventos a los nuevos botones
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEditCategory));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteCategory));
}

/**
 * Carga las categorías desde IndexedDB y las renderiza.
 */
async function loadAndRenderCategories() {
    try {
        const categories = await getCategories();
        renderCategoryList(categories);
        // También actualizamos el selector de categorías en la pestaña de juego.
        updateCategorySelect(categories); 
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        document.getElementById('lista-categorias').innerHTML = 
            '<p class="alert alert-danger mt-4">Error al cargar la base de datos de categorías.</p>';
    }
}

/**
 * Maneja el envío del formulario para crear o editar una categoría.
 */
async function handleCategoryFormSubmit(event) {
    event.preventDefault();
    
    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value.trim();
    const wordsText = document.getElementById('category-words').value.trim();
    
    // Convertir el texto de palabras en un array, limpiando espacios y vacíos.
    const words = wordsText.split(/[\n,]/)
                           .map(w => w.trim().toUpperCase())
                           .filter(w => w.length > 0);
    
    if (words.length < 5) {
        alert("Una categoría debe tener al menos 5 palabras.");
        return;
    }

    const category = {
        name: name,
        words: words
    };

    // Si categoryId existe, es una edición
    if (categoryId) {
        category.id = parseInt(categoryId);
    }

    try {
        await saveCategory(category);
        
        // Cerrar el modal y recargar la lista
        const modalElement = document.getElementById('newCategoryModal');
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();

        loadAndRenderCategories();
    } catch (error) {
        console.error("Error al guardar la categoría:", error);
        alert("Ocurrió un error al guardar la categoría.");
    }
}

/**
 * Prepara el modal para la edición.
 */
async function handleEditCategory(event) {
    const id = parseInt(event.currentTarget.getAttribute('data-id'));
    // Utilizamos getCategories, pero si tu base de datos crece, sería mejor una función getCategoryById
    const allCategories = await getCategories(); 
    const category = allCategories.find(c => c.id === id);

    if (category) {
        // --- 1. Cargar Datos en el Formulario ---
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        // Juntar el array de palabras en un string separado por coma y espacio para el textarea
        document.getElementById('category-words').value = category.words.join(', '); 
        
        // --- 2. Cambiar Títulos del Modal a Modo Edición ---
        document.getElementById('newCategoryModalLabel').textContent = `Editar Categoría: ${category.name}`;
        document.getElementById('save-category-btn').textContent = 'Actualizar Categoría';
        
        // --- 3. Forzar Apertura del Modal de Bootstrap ---
        const modalElement = document.getElementById('newCategoryModal');
        // Usamos la instancia de Bootstrap para manejar la apertura
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        
        // Antes de mostrar, aseguramos que la clase de edición esté puesta
        modalElement.setAttribute('data-editing', 'true');
        
        modal.show();
    }
}

/**
 * Maneja la eliminación de una categoría.
 */
async function handleDeleteCategory(event) {
    const id = parseInt(event.currentTarget.getAttribute('data-id'));
    const name = event.currentTarget.closest('.card').querySelector('.card-title').textContent;

    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"? Esta acción es irreversible.`)) {
        try {
            await deleteCategory(id);
            loadAndRenderCategories();
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            alert("Ocurrió un error al eliminar la categoría.");
        }
    }
}

/**
 * Prepara el modal para crear una nueva categoría.
 */
function setupNewCategoryModal(modalElement) {
    // Al abrir el modal, forzamos a que esté en modo CREAR (limpiamos el formulario)
    modalElement.addEventListener('show.bs.modal', (event) => {
        // Obtenemos el elemento que disparó el evento (el botón)
        const relatedButton = event.relatedTarget; 
        
        // Si el botón que disparó el modal NO es un botón de edición, limpiamos.
        // Si no hay botón (se dispara desde JS en handleEditCategory), NO limpiamos.
        if (relatedButton && relatedButton.id === 'nueva-categoria-btn') {
            document.getElementById('category-form').reset();
            document.getElementById('category-id').value = '';
            document.getElementById('newCategoryModalLabel').textContent = 'Crear Nueva Categoría';
            document.getElementById('save-category-btn').textContent = 'Guardar Categoría';
        }
        // Si se abre desde handleEditCategory (sin relatedTarget o desde el botón editar), no hacemos nada
        // ya que handleEditCategory ya cargó los datos.
    });
    
    // Y siempre reseteamos cuando se oculta (para la próxima vez)
    modalElement.addEventListener('hidden.bs.modal', () => {
        document.getElementById('category-form').reset();
    });
}

/**
 * Inicializa la lógica para el gestor de categorías. (La función llamada por loadComponent)
 */
export function initializeCategoryManager() {
    console.log("Gestor de categorías inicializado.");
    
    // 1. Añadir el listener para el formulario
    document.getElementById('category-form').addEventListener('submit', handleCategoryFormSubmit);

    // 2. Configurar el modal para que se limpie al abrir
    const modalElement = document.getElementById('newCategoryModal');
    if(modalElement) {
        setupNewCategoryModal(modalElement);
    }
    
    // 3. Cargar y renderizar la lista inicial
    loadAndRenderCategories();
}

// =========================================================
// MÓDULO: Roles
// =========================================================

async function loadGameComponent(componentPath, callback = null) {
    const mainContainer = document.querySelector('main.container');
    if (!mainContainer) return;

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Error al cargar la vista de juego: ${response.statusText}`);
        
        // Reemplazar el contenido del main
        mainContainer.innerHTML = await response.text();
        
        if (callback) {
            callback();
        }
    } catch (error) {
        console.error("Fallo al cargar la vista de juego:", error);
        mainContainer.innerHTML = `<p class="alert alert-danger">Error: No se pudo cargar la interfaz de juego. ${error.message}</p>`;
    }
}


// Almacena el estado del juego globalmente
let currentGameState = null;

// Duración de la pulsación para el modo clásico (milisegundos)
const REVEAL_DURATION = 1000; 
let pressTimer = null;

/**
 * Función principal para iniciar la secuencia de revelación de roles.
 */
function showRoleRevealScreen(gameConfig) {
    currentGameState = setupGame(gameConfig);
    
    loadGameComponent('components/role-reveal.html', initializeRoleRevealLogic);
}

/**
 * Inicializa los listeners y el estado de la pantalla de revelación.
 */
function initializeRoleRevealLogic() {
    if (!currentGameState) return;

    const { jugadores, modo } = currentGameState.config;
    document.getElementById('mode-display').textContent = modo.toUpperCase();
    
    const touchArea = document.getElementById('touch-area');
    const nextBtn = document.getElementById('next-player-btn');

    // 1. AÑADIR LISTENER DEL BOTÓN DE PASAR (Solo una vez)
    if (nextBtn) {
        nextBtn.style.display = 'none'; // Aseguramos que está oculto al inicio
        nextBtn.addEventListener('click', nextPlayer);
    }

    // 2. Configurar la lógica de interacción del touchArea
    if (touchArea) {
        // Inicializar el primer jugador
        updateRevealScreen(currentGameState.currentPlayerIndex);
        // Agregar listeners para el modo de revelación
        if (modo === 'clasico') {
            // Modo Clásico: Tocar y mantener
            touchArea.addEventListener('mousedown', startPressTimer);
            touchArea.addEventListener('mouseup', cancelPressTimer);
            touchArea.addEventListener('mouseleave', cancelPressTimer);
            // Soporte táctil
            touchArea.addEventListener('touchstart', startPressTimer);
            touchArea.addEventListener('touchend', cancelPressTimer);
        } else if (modo === 'sonoro') {
            // Modo Sonoro: Un solo toque
            touchArea.addEventListener('click', revealRole);
            document.getElementById('reveal-prompt').querySelector('p').textContent = 'Toca la pantalla para revelar tu rol por voz.';
        }
    }
    
    // Listener para el botón de "Siguiente Jugador"
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPlayer);
    }
}

/**
 * Muestra el rol en pantalla (usado para ambos modos).
 * @param {boolean} silent - Si es true, omite la lectura de texto (usado en modo clásico).
 */
function revealRole(silent = true) {
    const roleDisplay = document.getElementById('role-display');
    const prompt = document.getElementById('reveal-prompt');
    
    // Obtener el rol y detalles para el jugador actual
    const rol = currentGameState.rolesAsignados[currentGameState.currentPlayerIndex];
    const word = currentGameState.palabraClave;
    const categoryName = currentGameState.categoriaNombre;

    // Actualizar la interfaz
    document.getElementById('assigned-role').textContent = rol;
    document.getElementById('category-name').textContent = categoryName;
    document.getElementById('secret-word').textContent = word;

    // Estilos basados en el rol
    const roleEl = document.getElementById('assigned-role');
    roleEl.className = 'display-3 fw-bold';
    if (rol === 'IMPOSTOR') {
        roleEl.classList.add('text-danger');
        document.getElementById('agent-info').style.display = 'none';
        roleEl.textContent = 'Eres el IMPOSTOR 😈';
    } else {
        roleEl.classList.add('text-success');
        document.getElementById('agent-info').style.display = 'block';
        roleEl.textContent = 'Normal 🕵️‍♂️';
    }

    // Ocultar el prompt y mostrar el rol
    prompt.style.display = 'none';
    roleDisplay.style.display = 'block';

    // Mostrar el botón de siguiente jugador
    document.getElementById('next-player-btn').style.display = 'block';
    
    // --- PUNTO CLAVE: DESACTIVAR EL ÁREA DE TOQUE ---
    const touchArea = document.getElementById('touch-area');
    
    // Remover todos los listeners
    touchArea.removeEventListener('mousedown', startPressTimer);
    touchArea.removeEventListener('mouseup', cancelPressTimer);
    touchArea.removeEventListener('mouseleave', cancelPressTimer);
    touchArea.removeEventListener('touchstart', startPressTimer);
    touchArea.removeEventListener('touchend', cancelPressTimer);
    touchArea.onclick = null; // Desactivar el modo sonoro
}

// =========================================================
// LÓGICA DE INTERACCIÓN POR MODO
// =========================================================

// --- Modo Clásico (Mantener pulsado) ---
function startPressTimer(event) {
    // Evita que el click se procese si se mueve el dedo (en táctil)
    event.preventDefault(); 
    
    // Si ya hay un timer, cancelarlo para evitar duplicados
    if (pressTimer) clearTimeout(pressTimer); 
    
    // Iniciar timer
    pressTimer = setTimeout(() => {
        // Ejecutar revelación si se mantuvo pulsado el tiempo suficiente
        revealRole(true); // silent=true para no hablar
    }, REVEAL_DURATION);
}

function cancelPressTimer() {
    // Si se suelta antes del tiempo, cancelar
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
}


// --- Modo Sonoro (Voz) ---
function speakRole(rol, word, categoryName) {
    // API de Sintetizador de Voz del Navegador
    const synth = window.speechSynthesis;
    if (!synth) {
        console.warn("Speech Synthesis API no soportada por este navegador.");
        return;
    }
    
    let text = `Tu rol es ${rol}. `;
    if (rol === 'AGENTE') {
        text += `La palabra clave es ${word}. `;
    } else {
        text += `Eres el Impostor. Debes adivinar la palabra clave.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Configurar idioma a español
    
    synth.speak(utterance);
}

// =========================================================
// LÓGICA DE TRANSICIÓN DE JUGADORES
// =========================================================

/**
 * Prepara la pantalla para el siguiente jugador o termina la fase.
 */
function nextPlayer() {
    // 1. Ocultar el botón inmediatamente
    const nextBtn = document.getElementById('next-player-btn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
    
    currentGameState.currentPlayerIndex++;
    
    // Verificar si el juego ha terminado (todos los jugadores han visto su rol)
    if (currentGameState.currentPlayerIndex >= currentGameState.config.jugadores) {
        
        // --- CAMBIO CLAVE: Cargar la pantalla de juego iniciado ---
        loadGameComponent('components/game-started.html', initializeGameStartedScreen); 
        return;
    }

    // Reiniciar la pantalla para el siguiente jugador
    updateRevealScreen(currentGameState.currentPlayerIndex);
}

/**
 * Resetea la interfaz para el siguiente jugador.
 */
function updateRevealScreen(playerIndex) {
    const playerNumber = playerIndex + 1;
    const touchArea = document.getElementById('touch-area');
    const nextBtn = document.getElementById('next-player-btn');
    const modo = currentGameState.config.modo;

    if (!touchArea) {
        // MUY IMPORTANTE: Este es el check que fallaba anteriormente.
        console.error("No se encontró el touchArea en el DOM.");
        return; 
    }

    document.getElementById('player-number').textContent = playerNumber;
    document.getElementById('game-progress').textContent = `${playerNumber}/${currentGameState.config.jugadores} Jugadores`;
    
    // Resetear las secciones
    document.getElementById('role-display').style.display = 'none';
    document.getElementById('reveal-prompt').style.display = 'block';
    
    // OCULTAR EL BOTÓN DE PASAR
    if (nextBtn) {
        nextBtn.style.display = 'none'; 
    }

    // --- PUNTO CLAVE: LIMPIEZA DE LISTENERS ---
    
    // 1. Remover todos los listeners posibles del MODO CLÁSICO
    touchArea.removeEventListener('mousedown', startPressTimer);
    touchArea.removeEventListener('mouseup', cancelPressTimer);
    touchArea.removeEventListener('mouseleave', cancelPressTimer);
    touchArea.removeEventListener('touchstart', startPressTimer);
    touchArea.removeEventListener('touchend', cancelPressTimer);
    
    // 2. Remover el listener del MODO SONORO
    // Para remover un listener añadido con una función anónima (como click: () => revealRole(false)), 
    // es mejor usar una función nombrada, pero por simplicidad, si el modo es SONORO, 
    // limpiaremos cualquier listener click.
    // **Nota:** Si solo tienes un `click` listener, puedes usar `touchArea.onclick = null;`
    // En este caso, lo reinstalamos en el paso 3.

    // 3. REINSTALAR LISTENERS según el modo
    if (modo === 'clasico') {
        touchArea.addEventListener('mousedown', startPressTimer);
        touchArea.addEventListener('mouseup', cancelPressTimer);
        touchArea.addEventListener('mouseleave', cancelPressTimer);
        touchArea.addEventListener('touchstart', startPressTimer);
        touchArea.addEventListener('touchend', cancelPressTimer);
        document.getElementById('reveal-prompt').querySelector('p').textContent = 'Toca y mantén pulsada la pantalla para revelar tu rol.';
        // Aseguramos que el listener de click (sonoro) no esté presente
        touchArea.onclick = null;
    } else if (modo === 'sonoro') {
        // Reinstalamos el evento click, usando la función nombrada para evitar problemas de referencias
        touchArea.onclick = () => revealRole(false);
        document.getElementById('reveal-prompt').querySelector('p').textContent = 'Toca la pantalla para revelar tu rol por voz.';
    }
}


// =========================================================
// juego iniciado, proximamente sistema de votación
// =========================================================}

/**
 * Inicializa la lógica de la pantalla simple "Juego Iniciado".
 */
function initializeGameStartedScreen() {
    console.log("Juego iniciado. Esperando a que los jugadores regresen al menú.");
    
    const goHomeBtn = document.getElementById('go-home-btn');
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', goToHome);
    }
}

/**
 * Función que regresa al usuario a la pantalla principal.
 */
function goToHome() {
    // Simplemente recargamos la página para volver al index y su flujo de carga inicial
    location.reload(); 
}