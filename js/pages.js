// ============================================
// DEFINICIÓN DE TODAS LAS PÁGINAS
// ============================================

const Pages = {
    // Página de Inicio
    home: () => {
        return `
            <div class="container">
                <!-- Hero Section -->
                <div class="hero-section">
                    <h1 class="game-title">EL IMPOSTOR</h1>
                    <p class="game-subtitle">¿Podrás descubrir al mentiroso?</p>
                </div>

                <!-- Botones principales -->
                <div class="main-buttons">
                    <button class="btn-primary-custom" onclick="App.navigateTo('config')">
                        🎮 CREAR PARTIDA
                    </button>
                    <button class="btn-secondary-custom" onclick="App.navigateTo('words')">
                        📝 GESTIONAR BANCO DE PALABRAS
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
                        <p class="info-description">Jugadores: Deduzcan quién no conoce la palabra secreta.</p>
                        <p class="info-description">Impostor: Deduce la palabra secreta y engaña a todos.</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🔎</div>
                        <h3 class="info-title">Pistas Rebuscadas</h3>
                        <p class="info-description">Deben decir pistas relacionadas con la palabra secreta. Deben ser lo suficientemente rebuscadas para no dar pistas al impostor. Pero cuidado, puedes sabotearte solo</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🎧</div>
                        <h3 class="info-title">Modos Visual y Sonoro</h3>
                        <p class="info-description">Elige cómo revelar los roles: viendo la pantalla o escuchando con auriculares</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>El Impostor v3.0 - By: Surgeron</p>
                    <p>Derechos Reservados: Carpincho Software 2025</p>
                </div>
            </div>
        `;
    },

    // Página de Configuración
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
                                            <span class="mode-description">Ves tu rol en pantalla. Evita a los upitis</span>
                                        </label>
                                    </div>
                                    <div class="mode-option" onclick="ConfigUI.selectRevealMode('sonoro')">
                                        <input type="radio" name="revealMode" value="sonoro" id="modeSonoro">
                                        <label for="modeSonoro" class="mode-card mode-sonoro">
                                            <span class="mode-icon">🎧</span>
                                            <span class="mode-title">Sonoro</span>
                                            <span class="mode-description">Escuchas tu rol. (Usar Auriculares)</span>
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

    // Página de Gestión de Palabras
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
    },

    // Página de Revelación de Roles
    reveal: () => {
        const gameData = App.gameData;
        const currentPlayer = gameData.players[gameData.currentPlayerIndex];
        const isLastPlayer = gameData.currentPlayerIndex === gameData.players.length - 1;

        return `
            <div class="reveal-page">
                <div class="container">
                    <!-- Indicador de progreso -->
                    <div class="reveal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((gameData.currentPlayerIndex + 1) / gameData.players.length) * 100}%"></div>
                        </div>
                        <div class="progress-text">
                            Jugador ${gameData.currentPlayerIndex + 1} de ${gameData.players.length}
                        </div>
                    </div>

                    <!-- Información del jugador -->
                    <div class="reveal-content">
                        <div class="player-turn-card">
                            <h2 class="turn-title">Turno de</h2>
                            <h1 class="player-name-big">${currentPlayer.name}</h1>
                            <p class="turn-instruction">
                                ${gameData.revealMode === 'visual' 
                                    ? '👁️ Mantén presionado el botón para ver tu rol' 
                                    : '🎧 Conecta tus auriculares y mantén presionado para escuchar'}
                            </p>
                        </div>

                        <!-- Botón de revelación (mantener presionado) -->
                        <div class="reveal-button-container">
                            <button 
                                id="revealButton" 
                                class="btn-reveal"
                                onmousedown="RevealUI.startReveal()"
                                onmouseup="RevealUI.cancelReveal()"
                                onmouseleave="RevealUI.cancelReveal()"
                                ontouchstart="RevealUI.startReveal()"
                                ontouchend="RevealUI.cancelReveal()"
                            >
                                <div class="reveal-icon">🔒</div>
                                <div class="reveal-text">Mantén Presionado</div>
                                <div class="reveal-progress-ring">
                                    <svg class="progress-ring" width="120" height="120">
                                        <circle 
                                            class="progress-ring-circle" 
                                            stroke="#06b6d4" 
                                            stroke-width="4" 
                                            fill="transparent" 
                                            r="56" 
                                            cx="60" 
                                            cy="60"
                                            style="stroke-dasharray: 351.858; stroke-dashoffset: 351.858;"
                                        />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        <!-- Área de revelación (oculta inicialmente) -->
                        <div id="roleRevealArea" class="role-reveal-area" style="display: none;">
                            <!-- Modo Visual -->
                            <div id="visualReveal" class="visual-reveal" style="display: none;">
                                <div class="role-card ${currentPlayer.isImpostor ? 'impostor-card' : 'player-card'}">
                                    ${currentPlayer.isImpostor 
                                        ? `
                                        <div class="role-icon impostor-icon">🎭</div>
                                        <h2 class="role-title impostor-title">ERES EL IMPOSTOR</h2>
                                        <p class="role-message">Que no te descubran 🤫</p>
                                        `
                                        : `
                                        <div class="role-icon player-icon">📝</div>
                                        <h2 class="role-title">La palabra es:</h2>
                                        <div class="secret-word">${gameData.secretWord}</div>
                                        <p class="role-message">Categoría: ${gameData.category.name}</p>
                                        `
                                    }
                                </div>
                            </div>

                            <!-- Modo Sonoro -->
                            <div id="audioReveal" class="audio-reveal" style="display: none;">
                                <div class="audio-card">
                                    <div class="audio-icon">🎧</div>
                                    <div class="audio-status" id="audioStatus">
                                        <div class="audio-wave">
                                            <span></span><span></span><span></span><span></span><span></span>
                                        </div>
                                        <p>Reproduciendo audio...</p>
                                    </div>
                                    <button class="btn-replay" id="btnReplay" onclick="RevealUI.replayAudio()" style="display: none;">
                                        🔄 Volver a escuchar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Botón siguiente jugador (deshabilitado inicialmente) -->
                        <button 
                            id="btnNextPlayer" 
                            class="btn-next-player" 
                            onclick="RevealUI.nextPlayer()"
                            disabled
                            style="display: none;"
                        >
                            ${isLastPlayer ? '✅ Ir a Votación' : '➡️ Siguiente Jugador'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Página de Votación Simplificada
    voting: () => {
        const gameData = App.gameData;
        
        // Solo jugadores activos
        const activePlayers = gameData.players.filter(p => !p.eliminated);

        return `
            <div class="voting-page voting-simplified">
                <div class="container">
                    <div class="voting-header">
                        <h1 class="voting-title">Votación</h1>
                        <div class="players-remaining">
                            <span class="remaining-icon">👥</span>
                            <span class="remaining-text">${activePlayers.length} jugadores restantes</span>
                        </div>
                    </div>

                    <div class="players-elimination-grid">
                        ${activePlayers.map((player) => {
                            const sanitizeName = (name) => name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
                            const sanitizedName = sanitizeName(player.name);
                            
                            return `
                                <div class="elimination-player-card" 
                                    onclick="VotingUI.selectPlayerForElimination('${player.name}')"
                                    id="elimination-player-${sanitizedName}">
                                    <div class="elimination-avatar">${player.name.charAt(0).toUpperCase()}</div>
                                    <div class="elimination-player-name">${player.name}</div>
                                    <div class="elimination-icon">❌</div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Confirmación de eliminación -->
                    <div id="eliminationConfirmContainer" style="display: none;">
                        <div class="elimination-confirmation">
                            <p class="elimination-confirm-text">
                                ¿Eliminar a <span id="eliminationPlayerName" class="elimination-name"></span>?
                            </p>
                            <div class="elimination-buttons">
                                <button class="btn-cancel-elimination" onclick="VotingUI.cancelElimination()">
                                    Cancelar
                                </button>
                                <button class="btn-confirm-elimination" onclick="VotingUI.confirmElimination()">
                                    ✓ Confirmar Eliminación
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Página de Resultados
    results: () => {
        const gameData = App.gameData;
        
        // IMPORTANTE: Obtener el jugador que fue marcado como eliminado en la votación
        const eliminatedPlayer = gameData.players.find(p => p.justEliminated);
        
        if (!eliminatedPlayer) {
            console.error('❌ No se encontró jugador eliminado');
            return '<div style="text-align: center; padding: 100px; color: #ef4444;">Error: No se encontró jugador eliminado</div>';
        }
        
        // Limpiar el flag temporal
        eliminatedPlayer.justEliminated = false;
        
        // Verificar condiciones de victoria/derrota
        const remainingPlayers = gameData.players.filter(p => !p.eliminated);
        const remainingImpostors = remainingPlayers.filter(p => p.isImpostor).length;
        const remainingInnocents = remainingPlayers.filter(p => !p.isImpostor).length;
        
        // Obtener TODOS los impostores del juego
        const allImpostors = gameData.players.filter(p => p.isImpostor);
        
        console.log(`📊 Estado del juego:`);
        console.log(`   Jugadores restantes: ${remainingPlayers.length}`);
        console.log(`   Impostores restantes: ${remainingImpostors}`);
        console.log(`   Inocentes restantes: ${remainingInnocents}`);
        console.log(`   Eliminado: ${eliminatedPlayer.name} (${eliminatedPlayer.isImpostor ? 'IMPOSTOR' : 'Inocente'})`);
        
        let gameStatus = 'continue';
        
        if (remainingImpostors === 0) {
            gameStatus = 'players_win';
            console.log('🎉 ¡Ganaron los jugadores!');
        } else if (remainingImpostors >= remainingInnocents) {
            gameStatus = 'impostors_win';
            console.log('😈 ¡Ganaron los impostores!');
        } else {
            gameStatus = 'continue';
            console.log('🔄 El juego continúa...');
        }

        return `
            <div class="results-page">
                <div class="container">
                    <!-- Resultado de la votación -->
                    <div class="results-content">
                        <h1 class="results-title">📊 Resultado de la Votación</h1>
                        
                        <!-- Jugador eliminado -->
                        <div class="eliminated-reveal">
                            <div class="eliminated-card ${eliminatedPlayer.isImpostor ? 'was-impostor' : 'was-innocent'}">
                                <div class="eliminated-avatar">${eliminatedPlayer.name.charAt(0).toUpperCase()}</div>
                                <h2 class="eliminated-name">${eliminatedPlayer.name}</h2>
                                
                                <div class="role-reveal">
                                    ${eliminatedPlayer.isImpostor 
                                        ? `
                                        <div class="role-icon impostor-icon">🎭</div>
                                        <h3 class="role-result impostor-result">¡ERA EL IMPOSTOR!</h3>
                                        `
                                        : `
                                        <div class="role-icon innocent-icon">😇</div>
                                        <h3 class="role-result innocent-result">Era Inocente...</h3>
                                        `
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Resultado del juego -->
                        <div class="game-result">
                            ${gameStatus === 'players_win' 
                                ? `
                                <div class="victory-card players-victory">
                                    <div class="victory-icon">🎉</div>
                                    <h2 class="victory-title">¡GANARON LOS JUGADORES!</h2>
                                    <p class="victory-message">Todos los impostores han sido eliminados</p>
                                    <div class="victory-details">
                                        <p>Palabra secreta: <strong>${gameData.secretWord}</strong></p>
                                        <p>Categoría: ${gameData.category.name}</p>
                                        <p>Rondas jugadas: <strong>${gameData.roundNumber || 1}</strong></p>
                                        
                                        <!-- Lista de impostores -->
                                        <div class="impostors-reveal">
                                            <h4 class="impostors-title">Los impostores eran:</h4>
                                            <div class="impostors-list">
                                                ${allImpostors.map(imp => `
                                                    <div class="impostor-item ${imp.eliminated ? 'eliminated' : 'survived'}">
                                                        <span class="impostor-avatar">${imp.name.charAt(0).toUpperCase()}</span>
                                                        <span class="impostor-name">${imp.name}</span>
                                                        ${imp.eliminated ? '<span class="impostor-status">❌ Eliminado</span>' : '<span class="impostor-status survived">✓ Sobrevivió</span>'}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                : gameStatus === 'impostors_win'
                                ? `
                                <div class="victory-card impostors-victory">
                                    <div class="victory-icon">😈</div>
                                    <h2 class="victory-title">¡GANARON LOS IMPOSTORES!</h2>
                                    <p class="victory-message">Los impostores han igualado o superado a los jugadores</p>
                                    <div class="victory-details">
                                        <p>Impostores restantes: <strong>${remainingImpostors}</strong></p>
                                        <p>Jugadores restantes: <strong>${remainingInnocents}</strong></p>
                                        <p>Palabra secreta era: <strong>${gameData.secretWord}</strong></p>
                                        <p>Rondas jugadas: <strong>${gameData.roundNumber || 1}</strong></p>
                                        
                                        <!-- Lista de impostores -->
                                        <div class="impostors-reveal">
                                            <h4 class="impostors-title">Los impostores fueron:</h4>
                                            <div class="impostors-list">
                                                ${allImpostors.map(imp => `
                                                    <div class="impostor-item ${imp.eliminated ? 'eliminated' : 'survived'}">
                                                        <span class="impostor-avatar">${imp.name.charAt(0).toUpperCase()}</span>
                                                        <span class="impostor-name">${imp.name}</span>
                                                        ${imp.eliminated ? '<span class="impostor-status">❌ Eliminado</span>' : '<span class="impostor-status survived">👑 Ganador</span>'}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                : `
                                <div class="continue-card">
                                    <div class="continue-icon">🔄</div>
                                    <h2 class="continue-title">El Juego Continúa</h2>
                                    <p class="continue-message">Aún quedan impostores entre ustedes</p>
                                    <div class="remaining-info">
                                        <div class="info-item">
                                            <span class="info-label">Jugadores restantes:</span>
                                            <span class="info-value">${remainingPlayers.length}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Impostores restantes:</span>
                                            <span class="info-value">${remainingImpostors}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Ronda:</span>
                                            <span class="info-value">${gameData.roundNumber || 1}</span>
                                        </div>
                                    </div>
                                </div>
                                `
                            }
                        </div>

                        <!-- Botones de acción -->
                        <div class="results-actions">
                            ${gameStatus === 'continue'
                                ? `
                                <button class="btn-next-round" onclick="VotingUI.startNewRound()">
                                    ➡️ Nueva Ronda de Votación
                                </button>
                                `
                                : `
                                <button class="btn-rematch" onclick="VotingUI.rematch()">
                                    🔄 Revancha
                                </button>
                                <button class="btn-main-menu" onclick="App.navigateTo('home')">
                                    🏠 Menú Principal
                                </button>
                                `
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

   // Página de Selección de Jugador Inicial
    startPlayer: () => {
        const gameData = App.gameData;
        
        // Seleccionar jugador aleatorio si no está seleccionado
        if (!gameData.selectedStartPlayer) {
            const activePlayers = gameData.players.filter(p => !p.eliminated);
            const randomPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];
            gameData.selectedStartPlayer = randomPlayer;
        }

        const currentRound = gameData.roundNumber || 1;

        return `
            <div class="start-player-page">
                <div class="container">
                    <div class="start-player-content">
                        ${currentRound > 1 ? `<div class="round-indicator">Ronda ${currentRound}</div>` : ''}
                        
                        <h1 class="start-title">¿Quién empieza?</h1>
                        
                        <div class="random-player-reveal">
                            <div class="player-selected-card">
                                <div class="selected-icon">🎲</div>
                                <div class="selected-avatar">${gameData.selectedStartPlayer.name.charAt(0).toUpperCase()}</div>
                                <h2 class="selected-name">${gameData.selectedStartPlayer.name}</h2>
                                <p class="selected-message">¡Empieza dando una pista!</p>
                            </div>
                        </div>

                        <div class="start-instructions">
                            <div class="instruction-card">
                                <div class="instruction-icon">💬</div>
                                <p>Cada jugador da una pista sobre la palabra (o finge conocerla)</p>
                            </div>
                            <div class="instruction-card">
                                <div class="instruction-icon">🤔</div>
                                <p>Discutan entre todos para encontrar al impostor</p>
                            </div>
                            <div class="instruction-card">
                                <div class="instruction-icon">🗳️</div>
                                <p>Voten al jugador más sospechoso</p>
                            </div>
                        </div>

                        <div class="start-actions">
                            <button class="btn-reselect" onclick="StartPlayerUI.reselectPlayer()">
                                🔄 Elegir otro jugador
                            </button>
                            <button class="btn-start-discussion" onclick="StartPlayerUI.startDiscussion()">
                                ✅ Empezar ${currentRound > 1 ? 'Ronda' : 'Discusión'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

};