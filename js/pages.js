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
                        <p class="info-description">Multijugador local para jugar con amigos en la misma habitación</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🎭</div>
                        <h3 class="info-title">Encuentra al Impostor</h3>
                        <p class="info-description">Deduce quién no conoce la palabra secreta antes de que te descubran</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🎧</div>
                        <h3 class="info-title">Modos Visual y Sonoro</h3>
                        <p class="info-description">Elige cómo revelar los roles: viendo la pantalla o escuchando con auriculares</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>El Impostor v1.0 - Juego de deducción social</p>
                </div>
            </div>
        `;
    },

    // Página de Configuración (placeholder)
    config: () => {
        return `
            <div class="container">
                <div class="hero-section">
                    <h1 class="game-title">CONFIGURACIÓN</h1>
                    <p class="game-subtitle">Próximamente...</p>
                    <button class="btn-secondary-custom" onclick="App.navigateTo('home')">
                        ← Volver al inicio
                    </button>
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