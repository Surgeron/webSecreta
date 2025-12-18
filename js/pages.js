// ============================================
// DEFINICIÓN DE TODAS LAS PÁGINAS
// ============================================

const Pages = {
    // Página de Inicio (sin cambios)
    home: () => {
        return `
            <div class="container">
                <!-- Hero Section -->
                <div class="hero-section">
                    <h1 class="game-title">EL IMPOSTOR</h1>
                    <p class="game-subtitle">¿Podrás descubrir quién miente?</p>
                </div>

                <!-- Botones principales -->
                <div class="main-buttons">
                    <button class="btn-primary-custom" onclick="App.navigateTo('config')">
                        🎮 CREAR PARTIDA
                    </button>
                    <button class="btn-secondary-custom" onclick="App.navigateTo('words')">
                        📝 GESTIONAR PALABRAS
                    </button>
                </div>

                <!-- Info Cards -->
                <div class="info-cards">
                    <div class="info-card">
                        <div class="info-icon">👥</div>
                        <h3 class="info-title">3+ Jugadores</h3>
                        <p class="info-description">Ideal para jugar con amigos en la misma habitación. Que el Impostor no descubra la palabra</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🎭</div>
                        <h3 class="info-title">Encuentra al Impostor</h3>
                        <p class="info-description">Deduce quién no conoce la palabra secreta antes de que eliminen a los inocentes</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🎧</div>
                        <h3 class="info-title">Modos Visual y Sonoro</h3>
                        <p class="info-description">Elige cómo revelar los roles: viendo la pantalla o escuchando con auriculares</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>El Impostor version: 2.0 alfa-2 - Juego de deducción social</p>
                </div>
            </div>
        `;
    },

    // Página de Configuración (placeholder)
    config: async () => {
    // Cargar categorías antes de renderizar
    await WordsManager.loadCategories();
    
    // Generar opciones de categorías
    const categoriesOptions = WordsManager.categories.map(cat => 
        `<option value="${cat.id}">${cat.name} (${cat.words?.length || 0} palabras)</option>`
    ).join('');

    return `
        <div class="config-page">
            <div class="container">
                <!-- Header -->
                <div class="config-header">
                    <button class="btn-back" onclick="App.navigateTo('home')">
                        ← Volver
                    </button>
                    <h1 class="page-title">Configurar Partida</h1>
                </div>

                <!-- Formulario de configuración -->
                <div class="config-layout">
                    <!-- Formulario principal -->
                    <div class="config-form">
                        <!-- Sección: Categoría -->
                        <div class="form-section">
                            <label class="form-label">
                                <span class="label-icon">📁</span>
                                Categoría de Palabras
                            </label>
                            <select id="categorySelect" class="form-select" onchange="ConfigUI.updateConfig()">
                                <option value="">Selecciona una categoría...</option>
                                <option value="random">🎲 Aleatorio (Sorpresa)</option>
                                ${categoriesOptions}
                            </select>
                            <small class="form-hint">La palabra secreta se elegirá de esta categoría</small>
                        </div>

                        <!-- Sección: Modo de Revelación -->
                        <div class="form-section">
                            <label class="form-label">
                                <span class="label-icon">🎭</span>
                                Modo de Revelación
                            </label>
                            <div class="reveal-modes">
                                <div class="mode-option" onclick="ConfigUI.selectRevealMode('visual')">
                                    <input type="radio" name="revealMode" value="visual" id="modeVisual" checked>
                                    <label for="modeVisual" class="mode-card mode-visual">
                                        <span class="mode-icon">👁️</span>
                                        <span class="mode-title">Visual</span>
                                        <span class="mode-description">Ver en pantalla</span>
                                    </label>
                                </div>
                                <div class="mode-option" onclick="ConfigUI.selectRevealMode('sonoro')">
                                    <input type="radio" name="revealMode" value="sonoro" id="modeSonoro">
                                    <label for="modeSonoro" class="mode-card mode-sonoro">
                                        <span class="mode-icon">🎧</span>
                                        <span class="mode-title">Sonoro</span>
                                        <span class="mode-description">Escuchar con auriculares</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Cantidad de Impostores -->
                        <div class="form-section">
                            <label class="form-label">
                                <span class="label-icon">🎯</span>
                                Cantidad de Impostores
                            </label>
                            <div class="impostor-selector">
                                <button class="btn-quantity" onclick="ConfigUI.changeImpostorCount(-1)">−</button>
                                <input 
                                    type="number" 
                                    id="impostorCount" 
                                    class="input-quantity" 
                                    value="1" 
                                    min="1" 
                                    readonly
                                >
                                <button class="btn-quantity" onclick="ConfigUI.changeImpostorCount(1)">+</button>
                            </div>
                            <small class="form-hint" id="impostorHint">Mínimo 1, máximo según jugadores</small>
                        </div>

                        <!-- Sección: Jugadores -->
                        <div class="form-section">
                            <label class="form-label">
                                <span class="label-icon">👥</span>
                                Jugadores <span id="playerCount" class="player-count">(0)</span>
                            </label>
                            <div class="player-input-group">
                                <input 
                                    type="text" 
                                    id="playerNameInput" 
                                    class="form-input" 
                                    placeholder="Nombre del jugador"
                                    maxlength="20"
                                    onkeypress="if(event.key === 'Enter') ConfigUI.addPlayer()"
                                >
                                <button class="btn-add-player" onclick="ConfigUI.addPlayer()">
                                    + Agregar
                                </button>
                            </div>
                            <small class="form-hint">Mínimo 3 jugadores para empezar</small>

                            <!-- Lista de jugadores -->
                            <div id="playersList" class="players-list">
                                <div class="empty-players-message">
                                    <p>👆 Agrega jugadores para comenzar</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Panel de resumen -->
                    <div class="config-summary">
                        <h3 class="summary-title">📋 Resumen</h3>
                        
                        <div class="summary-item">
                            <span class="summary-label">Categoría:</span>
                            <span class="summary-value" id="summaryCategory">No seleccionada</span>
                        </div>

                        <div class="summary-item">
                            <span class="summary-label">Modo:</span>
                            <span class="summary-value" id="summaryMode">Visual 👁️</span>
                        </div>

                        <div class="summary-item">
                            <span class="summary-label">Impostores:</span>
                            <span class="summary-value" id="summaryImpostors">1</span>
                        </div>

                        <div class="summary-item">
                            <span class="summary-label">Jugadores:</span>
                            <span class="summary-value" id="summaryPlayers">0</span>
                        </div>

                        <div class="summary-divider"></div>

                        <div id="validationMessages" class="validation-messages"></div>

                        <button 
                            id="btnStartGame" 
                            class="btn-start-game" 
                            onclick="ConfigUI.startGame()"
                            disabled
                        >
                            🎮 Iniciar Juego
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
},

    // Página de Gestión de Palabras (COMPLETA)
    words: () => {
        return `
            <div class="words-manager-page">
                <div class="container">
                    <!-- Header -->
                    <div class="words-header">
                        <button class="btn-back" onclick="App.navigateTo('home')">
                            ← Volver
                        </button>
                        <h1 class="page-title">Gestión de Palabras</h1>
                    </div>

                    <!-- Layout de 2 columnas -->
                    <div class="words-layout">
                        <!-- Columna izquierda: Categorías -->
                        <div class="categories-panel">
                            <div class="panel-header">
                                <h2 class="panel-title">📁 Categorías</h2>
                                <button class="btn-add-category" onclick="WordsUI.showAddCategoryModal()">
                                    + Nueva
                                </button>
                            </div>

                            <!-- Lista de categorías -->
                            <div id="categoriesList" class="categories-list">
                                <div class="loading-message">Cargando categorías...</div>
                            </div>
                        </div>

                        <!-- Columna derecha: Palabras -->
                        <div class="words-panel">
                            <div class="panel-header">
                                <h2 class="panel-title" id="wordsPanelTitle">📝 Palabras</h2>
                                <button 
                                    class="btn-add-word" 
                                    id="btnAddWord"
                                    onclick="WordsUI.showAddWordModal()"
                                    disabled
                                >
                                    + Agregar
                                </button>
                            </div>

                            <!-- Lista de palabras -->
                            <div id="wordsList" class="words-list">
                                <div class="empty-message">
                                    <p>👈 Selecciona una categoría para ver sus palabras</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal para agregar/editar categoría -->
                <div id="categoryModal" class="modal-overlay" style="display: none;">
                    <div class="modal-content">
                        <h3 class="modal-title" id="categoryModalTitle">Nueva Categoría</h3>
                        <input 
                            type="text" 
                            id="categoryNameInput" 
                            class="form-input" 
                            placeholder="Nombre de la categoría"
                            maxlength="50"
                        >
                        <div class="modal-buttons">
                            <button class="btn-cancel" onclick="WordsUI.closeModals()">Cancelar</button>
                            <button class="btn-confirm" onclick="WordsUI.saveCategoryFromModal()">Guardar</button>
                        </div>
                    </div>
                </div>

                <!-- Modal para agregar/editar palabra -->
                <div id="wordModal" class="modal-overlay" style="display: none;">
                    <div class="modal-content">
                        <h3 class="modal-title" id="wordModalTitle">Nueva Palabra</h3>
                        <input 
                            type="text" 
                            id="wordInput" 
                            class="form-input" 
                            placeholder="Escribe la palabra"
                            maxlength="30"
                        >
                        <div class="modal-buttons">
                            <button class="btn-cancel" onclick="WordsUI.closeModals()">Cancelar</button>
                            <button class="btn-confirm" onclick="WordsUI.saveWordFromModal()">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};