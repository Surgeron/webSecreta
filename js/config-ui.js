// ============================================
// INTERFAZ DE CONFIGURACIÓN DE PARTIDA
// ============================================

const ConfigUI = {
    players: [],
    impostorCount: 1,
    selectedCategory: null,
    revealMode: 'visual',

    // Inicialización
    async init() {
        // Cargar categorías si no están cargadas
        if (WordsManager.categories.length === 0) {
            await WordsManager.loadCategories();
        }

        // Verificar si hay una configuración de revancha pendiente
        if (App.rematchConfig) {
            console.log('🎮 Detectada configuración de revancha');
            this.restoreConfig(App.rematchConfig);
            // Limpiar el flag
            App.rematchConfig = null;
        } else {
            // Reiniciar estado normal
            this.players = [];
            this.impostorCount = 1;
            this.selectedCategory = null;
            this.revealMode = 'visual';
            this.updateUI();
        }
    },

    // ============================================
    // GESTIÓN DE CATEGORÍA
    // ============================================

    updateConfig() {
        const categorySelect = document.getElementById('categorySelect');
        this.selectedCategory = categorySelect.value;
        this.validateAndUpdate();
    },

    // ============================================
    // MODO DE REVELACIÓN
    // ============================================

    selectRevealMode(mode) {
        this.revealMode = mode;
        
        // Actualizar radio button
        const radio = document.getElementById(mode === 'visual' ? 'modeVisual' : 'modeSonoro');
        if (radio) radio.checked = true;

        // Actualizar estilos visuales
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`.mode-${mode}`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        this.validateAndUpdate();
    },

    // ============================================
    // GESTIÓN DE IMPOSTORES
    // ============================================

    changeImpostorCount(delta) {
        const newCount = this.impostorCount + delta;
        const maxImpostors = Math.max(1, this.players.length - 2);

        if (newCount >= 1 && newCount <= maxImpostors) {
            this.impostorCount = newCount;
            document.getElementById('impostorCount').value = newCount;
            this.validateAndUpdate();
        }
    },

   updateImpostorLimits() {
        const hint = document.getElementById('impostorHint');
        
        // Validar que el elemento existe
        if (!hint) {
            console.warn('⚠️ Elemento impostorHint no encontrado');
            return;
        }
        
        const maxImpostors = Math.max(1, this.players.length - 2);
        
        if (this.players.length < 3) {
            hint.textContent = 'Agrega al menos 3 jugadores primero';
            hint.style.color = '#ef4444';
        } else {
            hint.textContent = `Mínimo 1, máximo ${maxImpostors}`;
            hint.style.color = '#06b6d4';
        }

        // Ajustar si el count actual excede el máximo
        if (this.impostorCount > maxImpostors) {
            this.impostorCount = maxImpostors;
            const impostorInput = document.getElementById('impostorCount');
            if (impostorInput) {
                impostorInput.value = maxImpostors;
            }
        }
    },

    // ============================================
    // GESTIÓN DE JUGADORES
    // ============================================

    addPlayer() {
        const input = document.getElementById('playerNameInput');
        const name = input.value.trim();

        // Validaciones
        if (!name) {
            alert('Por favor ingresa un nombre');
            return;
        }

        if (this.players.includes(name)) {
            alert('Este jugador ya fue agregado');
            return;
        }

        if (this.players.length >= 20) {
            alert('Máximo 20 jugadores');
            return;
        }

        // Agregar jugador
        this.players.push(name);
        input.value = '';
        input.focus();

        this.updateImpostorLimits();
        this.renderPlayers();
        this.validateAndUpdate();
    },

    removePlayer(index) {
        this.players.splice(index, 1);
        this.updateImpostorLimits();
        this.renderPlayers();
        this.validateAndUpdate();
    },

    renderPlayers() {
        const container = document.getElementById('playersList');
        const countElement = document.getElementById('playerCount');

        // Validar que los elementos existen
        if (!container || !countElement) {
            console.warn('⚠️ Elementos del DOM no encontrados aún');
            return;
        }

        countElement.textContent = `(${this.players.length})`;

        if (this.players.length === 0) {
            container.innerHTML = `
                <div class="empty-players-message">
                    <p>👆 Agrega jugadores para comenzar</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.players.map((player, index) => `
            <div class="player-item">
                <span class="player-number">${index + 1}</span>
                <span class="player-name">${player}</span>
                <button class="btn-remove-player" onclick="ConfigUI.removePlayer(${index})" title="Eliminar">
                    ✕
                </button>
            </div>
        `).join('');
    },

    // ============================================
    // VALIDACIÓN Y ACTUALIZACIÓN DE UI
    // ============================================

    validateAndUpdate() {
        this.updateSummary();
        this.updateValidation();
    },

    updateSummary() {
        // Validar que los elementos existen
        const summaryCategory = document.getElementById('summaryCategory');
        const summaryMode = document.getElementById('summaryMode');
        const summaryImpostors = document.getElementById('summaryImpostors');
        const summaryPlayers = document.getElementById('summaryPlayers');
        
        if (!summaryCategory || !summaryMode || !summaryImpostors || !summaryPlayers) {
            console.warn('⚠️ Elementos del resumen no encontrados');
            return;
        }
        
        // Actualizar categoría
        if (this.selectedCategory === 'random') {
            summaryCategory.textContent = '🎲 Aleatorio';
            summaryCategory.style.color = '#06b6d4';
        } else if (this.selectedCategory) {
            const category = WordsManager.categories.find(c => c.id === this.selectedCategory);
            summaryCategory.textContent = category ? category.name : 'No seleccionada';
            summaryCategory.style.color = '#ffffff';
        } else {
            summaryCategory.textContent = 'No seleccionada';
            summaryCategory.style.color = '#666';
        }

        // Actualizar modo
        summaryMode.textContent = this.revealMode === 'visual' ? 'Visual 👁️' : 'Sonoro 🎧';

        // Actualizar impostores
        summaryImpostors.textContent = this.impostorCount;

        // Actualizar jugadores
        summaryPlayers.textContent = this.players.length;
    },

    updateValidation() {
        const messagesContainer = document.getElementById('validationMessages');
        const btnStartGame = document.getElementById('btnStartGame');
        
        // Validar que los elementos existen
        if (!messagesContainer || !btnStartGame) {
            console.warn('⚠️ Elementos de validación no encontrados');
            return;
        }
        
        const errors = [];

        // Validar categoría
        if (!this.selectedCategory) {
            errors.push('⚠️ Selecciona una categoría');
        } else if (this.selectedCategory !== 'random') {
            const category = WordsManager.categories.find(c => c.id === this.selectedCategory);
            if (!category || !category.words || category.words.length === 0) {
                errors.push('⚠️ La categoría no tiene palabras');
            }
        } else {
            // Validar que haya al menos una categoría con palabras para modo aleatorio
            const categoriesWithWords = WordsManager.categories.filter(c => c.words && c.words.length > 0);
            if (categoriesWithWords.length === 0) {
                errors.push('⚠️ No hay categorías con palabras para modo aleatorio');
            }
        }

        // Validar jugadores
        if (this.players.length < 3) {
            errors.push('⚠️ Se necesitan mínimo 3 jugadores');
        }

        // Validar impostores
        const maxImpostors = this.players.length - 2;
        if (this.players.length >= 3 && this.impostorCount > maxImpostors) {
            errors.push(`⚠️ Máximo ${maxImpostors} impostores con ${this.players.length} jugadores`);
        }

        // Mostrar errores o mensaje de éxito
        if (errors.length > 0) {
            messagesContainer.innerHTML = errors.map(err => 
                `<div class="validation-error">${err}</div>`
            ).join('');
            btnStartGame.disabled = true;
        } else {
            messagesContainer.innerHTML = `
                <div class="validation-success">
                    ✅ Todo listo para jugar
                </div>
            `;
            btnStartGame.disabled = false;
        }
    },

    // ============================================
    // INICIAR JUEGO
    // ============================================

   startGame() {
        // Validar una última vez
        if (this.players.length < 3) {
            alert('Se necesitan mínimo 3 jugadores');
            return;
        }

        if (!this.selectedCategory) {
            alert('Selecciona una categoría');
            return;
        }

        // Determinar categoría final (si es random, elegir una)
        let finalCategory = this.selectedCategory;
        if (this.selectedCategory === 'random') {
            const categoriesWithWords = WordsManager.categories.filter(
                c => c.words && c.words.length > 0
            );
            if (categoriesWithWords.length === 0) {
                alert('No hay categorías con palabras disponibles');
                return;
            }
            const randomCat = categoriesWithWords[Math.floor(Math.random() * categoriesWithWords.length)];
            finalCategory = randomCat.id;
        }

        // Obtener palabra secreta
        const secretWord = WordsManager.getRandomWord(finalCategory);
        if (!secretWord) {
            alert('No se pudo obtener una palabra de la categoría');
            return;
        }

        // Crear array de índices para mezclar
        const indices = Array.from({ length: this.players.length }, (_, i) => i);
        
        // Mezclar índices usando Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Los primeros N índices mezclados serán los impostores
        const impostorIndices = new Set(indices.slice(0, this.impostorCount));
        
        // Asignar roles a los jugadores en su orden original
        const playersWithRoles = this.players.map((name, index) => ({
            name: name,
            isImpostor: impostorIndices.has(index),
            votes: 0,
            eliminated: false // AGREGAR: inicializar como no eliminado
        }));

        console.log('🎲 Roles asignados:');
        playersWithRoles.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}: ${p.isImpostor ? '🎭 IMPOSTOR' : '📝 Jugador'}`);
        });

        // IMPORTANTE: Guardar configuración COMPLETA en App
        App.gameData = {
        category: WordsManager.categories.find(c => c.id === finalCategory),
        secretWord: secretWord,
        players: playersWithRoles,
        revealMode: this.revealMode,
        impostorCount: this.impostorCount,
        currentPlayerIndex: 0,
        selectedStartPlayer: null,
        roundNumber: 1 // AGREGAR: Inicializar contador de rondas
    };

        console.log('🎮 Juego iniciado:', App.gameData);

        // Navegar a revelación
        App.navigateTo('reveal');
    },

    // ============================================
    // UTILIDADES
    // ============================================

    updateUI() {
    // Validar que estamos en la página correcta antes de actualizar
        if (App.currentPage !== 'config') {
            console.warn('⚠️ No estamos en la página de configuración');
            return;
        }
        
        // Validar que los elementos principales existen
        if (!document.getElementById('playersList') || !document.getElementById('playerCount')) {
            console.warn('⚠️ Esperando a que el DOM esté listo...');
            return;
        }
        
        this.renderPlayers();
        this.updateImpostorLimits();
        this.validateAndUpdate();
    },

    // ============================================
// RESTAURAR CONFIGURACIÓN (para revancha)
// ============================================

    restoreConfig(config) {
        console.log('🔄 Restaurando configuración:', config);
        
        // Restaurar datos internos
        this.players = [...config.playerNames];
        this.impostorCount = config.impostorCount;
        this.revealMode = config.revealMode;
        this.selectedCategory = config.categoryId;

        // Actualizar select de categoría
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categorySelect.value = config.categoryId;
        }

        // Actualizar radio de modo
        const modeRadio = document.getElementById(
            config.revealMode === 'visual' ? 'modeVisual' : 'modeSonoro'
        );
        if (modeRadio) {
            modeRadio.checked = true;
        }

        // Actualizar las cards de modo visualmente
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedModeCard = document.querySelector(`.mode-${config.revealMode}`);
        if (selectedModeCard) {
            selectedModeCard.classList.add('selected');
        }

        // Actualizar contador de impostores
        const impostorInput = document.getElementById('impostorCount');
        if (impostorInput) {
            impostorInput.value = config.impostorCount;
        }

        // Actualizar UI completa
        this.updateUI();
        
        console.log('✅ Configuración restaurada exitosamente');
    },
};