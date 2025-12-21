// ============================================
// INTERFAZ DE CONFIGURACIÓN DE PARTIDA
// ============================================

const ConfigUI = {
    players: [],
    impostorCount: 1,
    selectedCategory: null,
    revealMode: 'visual',

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    async init() {
        // Cargar categorías si no están cargadas
        if (WordsManager.categories.length === 0) {
            await WordsManager.loadCategories();
        }

        // Reiniciar estado
        this.players = [];
        this.impostorCount = 1;
        this.selectedCategory = null;
        this.revealMode = 'visual';

        this.updateUI();
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
        const maxImpostors = Math.max(1, this.players.length - 2);
        const hint = document.getElementById('impostorHint');
        
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
            document.getElementById('impostorCount').value = maxImpostors;
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
        // Actualizar categoría
        const summaryCategory = document.getElementById('summaryCategory');
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
        const summaryMode = document.getElementById('summaryMode');
        summaryMode.textContent = this.revealMode === 'visual' ? 'Visual 👁️' : 'Sonoro 🎧';

        // Actualizar impostores
        document.getElementById('summaryImpostors').textContent = this.impostorCount;

        // Actualizar jugadores
        document.getElementById('summaryPlayers').textContent = this.players.length;
    },

    updateValidation() {
        const messagesContainer = document.getElementById('validationMessages');
        const btnStartGame = document.getElementById('btnStartGame');
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
            votes: 0
        }));

        console.log('🎲 Roles asignados:');
        playersWithRoles.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}: ${p.isImpostor ? '🎭 IMPOSTOR' : '📝 Jugador'}`);
        });

        // Guardar configuración en App
        App.gameData = {
            category: WordsManager.categories.find(c => c.id === finalCategory),
            secretWord: secretWord,
            players: playersWithRoles,
            revealMode: this.revealMode,
            impostorCount: this.impostorCount,
            currentPlayerIndex: 0
        };

        console.log('🎮 Juego iniciado:', App.gameData);

        // Navegar a revelación
        App.navigateTo('reveal');
    },

    // ============================================
    // UTILIDADES
    // ============================================

    updateUI() {
        this.renderPlayers();
        this.updateImpostorLimits();
        this.validateAndUpdate();
    }
};