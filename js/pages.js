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


    // Página de Votación
    voting: () => {
        const gameData = App.gameData;
        
        // Inicializar índice de votante si no existe
        if (gameData.currentVoterIndex === undefined) {
            gameData.currentVoterIndex = 0;
        }
        
        // IMPORTANTE: Solo jugadores ACTIVOS (no eliminados)
        const activePlayers = gameData.players.filter(p => !p.eliminated);
        
        // El votante actual es del array de ACTIVOS
        const currentVoter = activePlayers[gameData.currentVoterIndex];
        
        // Helper para sanitizar nombres
        const sanitizeName = (name) => name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

        return `
            <div class="voting-page">
                <div class="container">
                    <!-- Header de votación -->
                    <div class="voting-header">
                        <div class="voting-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(gameData.currentVoterIndex / activePlayers.length) * 100}%"></div>
                            </div>
                            <div class="progress-text">
                                Voto ${gameData.currentVoterIndex + 1} de ${activePlayers.length}
                            </div>
                        </div>

                        <h1 class="voting-title">Turno de Votar</h1>
                        <h2 class="voter-name">${currentVoter.name}</h2>
                        <p class="voting-instruction">Selecciona a quién crees que es el impostor</p>
                    </div>

                    <!-- Lista de jugadores para votar (SOLO ACTIVOS) -->
                    <div class="players-voting-grid">
                        ${activePlayers.map((player, index) => {
                            const isCurrentVoter = player.name === currentVoter.name;
                            const sanitizedName = sanitizeName(player.name);
                            
                            return `
                                <div class="voting-player-card ${isCurrentVoter ? 'current-voter' : ''}" 
                                    onclick="${isCurrentVoter ? '' : "VotingUI.selectPlayer('" + player.name + "')"}"
                                    id="player-${sanitizedName}">
                                    <div class="player-avatar">${player.name.charAt(0).toUpperCase()}</div>
                                    <div class="player-vote-name">${player.name}</div>
                                    ${player.votes > 0 ? `<div class="vote-count">${player.votes} 🗳️</div>` : ''}
                                    ${isCurrentVoter ? '<div class="current-voter-badge">Tú</div>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Botón de confirmar voto (oculto hasta seleccionar) -->
                    <div id="confirmVoteContainer" style="display: none;">
                        <div class="vote-confirmation">
                            <p class="confirm-text">¿Votar a <span id="selectedPlayerName" class="selected-name"></span>?</p>
                            <div class="confirm-buttons">
                                <button class="btn-cancel-vote" onclick="VotingUI.cancelVote()">Cancelar</button>
                                <button class="btn-confirm-vote" onclick="VotingUI.confirmVote()">✓ Confirmar Voto</button>
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
        
        // IMPORTANTE: Solo jugadores ACTIVOS (no eliminados)
        const activePlayers = gameData.players.filter(p => !p.eliminated);
        
        console.log('📊 Calculando resultados...');
        console.log('Jugadores activos:', activePlayers.map(p => `${p.name}: ${p.votes} votos`));
        
        // Calcular jugador más votado
        const maxVotes = Math.max(...activePlayers.map(p => p.votes));
        const playersWithMaxVotes = activePlayers.filter(p => p.votes === maxVotes);
        
        console.log(`🎯 Máximo de votos: ${maxVotes}`);
        console.log(`👥 Jugadores con más votos:`, playersWithMaxVotes.map(p => p.name));
        
        // Si hay empate, elegir uno al azar
        const eliminatedPlayer = playersWithMaxVotes[Math.floor(Math.random() * playersWithMaxVotes.length)];
        
        // Marcar como eliminado
        if (!eliminatedPlayer.eliminated) {
            eliminatedPlayer.eliminated = true;
            console.log(`❌ ${eliminatedPlayer.name} ha sido eliminado`);
        }
        
        // Verificar condiciones de victoria/derrota
        const remainingPlayers = gameData.players.filter(p => !p.eliminated);
        const remainingImpostors = remainingPlayers.filter(p => p.isImpostor).length;
        const remainingInnocents = remainingPlayers.filter(p => !p.isImpostor).length;
        
        console.log(`📊 Estado del juego:`);
        console.log(`   Jugadores restantes: ${remainingPlayers.length}`);
        console.log(`   Impostores restantes: ${remainingImpostors}`);
        console.log(`   Inocentes restantes: ${remainingInnocents}`);
        
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
                                <div class="eliminated-votes">${eliminatedPlayer.votes} votos</div>
                                
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
                                    </div>
                                </div>
                                `
                            }
                        </div>

                        <!-- Botones de acción -->
                        <div class="results-actions">
                            ${gameStatus === 'continue'
                                ? `
                                <button class="btn-next-round" onclick="VotingUI.startNewVotingRound()">
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
}