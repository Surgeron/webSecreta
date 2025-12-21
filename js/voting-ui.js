// ============================================
// INTERFAZ DE VOTACIÓN
// ============================================

const VotingUI = {
    selectedPlayer: null,

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    init() {
        console.log('🗳️ Inicializando votación...');

        // Si es una nueva ronda de votación, resetear TODO
        if (App.gameData.newVotingRound) {
            console.log('🔄 Nueva ronda de votación - Reseteando votos');
            
            // IMPORTANTE: Resetear votos de TODOS los jugadores (eliminados o no)
            App.gameData.players.forEach(player => {
                player.votes = 0;
            });
            
            // Resetear índice de votante
            App.gameData.currentVoterIndex = 0;
            App.gameData.newVotingRound = false;
            
            console.log('✅ Votos reseteados:', App.gameData.players.map(p => `${p.name}: ${p.votes}`));
        }

        // Inicializar índice de votante si no existe
        if (App.gameData.currentVoterIndex === undefined) {
            App.gameData.currentVoterIndex = 0;
        }

        console.log('Estado actual de votación:', {
            currentVoterIndex: App.gameData.currentVoterIndex,
            players: App.gameData.players.map(p => ({
                name: p.name,
                eliminated: p.eliminated || false,
                votes: p.votes
            }))
        });
    },

    // Función helper para sanitizar nombres (quitar espacios y caracteres especiales)
    sanitizeName(name) {
        return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    },

    // ============================================
    // SELECCIÓN Y VOTACIÓN
    // ============================================

    selectPlayer(playerName) {
        // Obtener solo jugadores ACTIVOS (no eliminados)
        const activePlayers = App.gameData.players.filter(p => !p.eliminated);
        
        // El votante actual es el que está en el índice actual ENTRE LOS ACTIVOS
        const currentVoter = activePlayers[App.gameData.currentVoterIndex];
        
        console.log(`🗳️ Seleccionando jugador: ${playerName}`);
        console.log(`👤 Votante actual: ${currentVoter.name}`);
        
        // No puede votarse a sí mismo
        if (playerName === currentVoter.name) {
            alert('No puedes votarte a ti mismo');
            return;
        }

        // Guardar selección
        this.selectedPlayer = playerName;

        // Resaltar jugador seleccionado
        document.querySelectorAll('.voting-player-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.getElementById(`player-${this.sanitizeName(playerName)}`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Mostrar confirmación
        document.getElementById('selectedPlayerName').textContent = playerName;
        document.getElementById('confirmVoteContainer').style.display = 'block';
    },

    cancelVote() {
        this.selectedPlayer = null;
        
        // Remover selección visual
        document.querySelectorAll('.voting-player-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Ocultar confirmación
        document.getElementById('confirmVoteContainer').style.display = 'none';
    },

    confirmVote() {
        if (!this.selectedPlayer) return;

        const activePlayers = App.gameData.players.filter(p => !p.eliminated);
        const currentVoter = activePlayers[App.gameData.currentVoterIndex];

        // Encontrar al jugador votado en la lista COMPLETA (no solo activos)
        const votedPlayer = App.gameData.players.find(p => p.name === this.selectedPlayer);
        if (votedPlayer) {
            votedPlayer.votes++;
        }

        console.log(`✅ ${currentVoter.name} votó a ${this.selectedPlayer}`);
        console.log(`📊 Votos actuales:`, App.gameData.players.filter(p => !p.eliminated).map(p => `${p.name}: ${p.votes}`));

        // Avanzar al siguiente votante
        App.gameData.currentVoterIndex++;

        // Resetear selección
        this.selectedPlayer = null;

        // Verificar si terminó la votación
        if (App.gameData.currentVoterIndex >= activePlayers.length) {
            console.log('🏁 Votación completada. Mostrando resultados...');
            // Ir a resultados
            App.navigateTo('results');
        } else {
            console.log(`➡️ Siguiente votante (${App.gameData.currentVoterIndex + 1}/${activePlayers.length})`);
            // Siguiente votante
            App.render();
        }
    },

    // ============================================
    // NUEVA RONDA
    // ============================================

    startNewVotingRound() {
        console.log('🔄 Preparando nueva ronda de votación...');
        console.log('📊 Estado antes de resetear:', {
            players: App.gameData.players.map(p => ({
                name: p.name,
                eliminated: p.eliminated || false,
                votes: p.votes
            }))
        });
        
        // Marcar que es una nueva ronda
        App.gameData.newVotingRound = true;
        
        // Volver a la página de votación
        App.navigateTo('voting');
    },

    // ============================================
    // REVANCHA Y MENÚ
    // ============================================

    rematch() {
        console.log('🔄 Iniciando revancha...');

        // Guardar configuración actual
        const savedConfig = {
            categoryId: App.gameData.category.id,
            playerNames: App.gameData.players.map(p => p.name),
            impostorCount: App.gameData.impostorCount,
            revealMode: App.gameData.revealMode
        };

        console.log('💾 Configuración guardada:', savedConfig);

        // Resetear gameData completamente
        App.gameData = {
            players: [],
            category: null,
            secretWord: null,
            impostorCount: savedConfig.impostorCount,
            revealMode: savedConfig.revealMode,
            currentPlayerIndex: 0,
            currentVoterIndex: 0
        };

        // Volver a configuración
        App.navigateTo('config');

        // Esperar a que se renderice y luego cargar datos
        setTimeout(() => {
            // Restaurar configuración en ConfigUI
            ConfigUI.players = [...savedConfig.playerNames];
            ConfigUI.impostorCount = savedConfig.impostorCount;
            ConfigUI.revealMode = savedConfig.revealMode;
            ConfigUI.selectedCategory = savedConfig.categoryId;

            // Actualizar select de categoría
            const categorySelect = document.getElementById('categorySelect');
            if (categorySelect) {
                categorySelect.value = savedConfig.categoryId;
            }

            // Actualizar radio de modo
            const modeRadio = document.getElementById(
                savedConfig.revealMode === 'visual' ? 'modeVisual' : 'modeSonoro'
            );
            if (modeRadio) {
                modeRadio.checked = true;
            }

            // Actualizar las cards de modo visualmente
            document.querySelectorAll('.mode-card').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedModeCard = document.querySelector(`.mode-${savedConfig.revealMode}`);
            if (selectedModeCard) {
                selectedModeCard.classList.add('selected');
            }

            // Actualizar contador de impostores
            const impostorInput = document.getElementById('impostorCount');
            if (impostorInput) {
                impostorInput.value = savedConfig.impostorCount;
            }

            // Renderizar jugadores y UI completa
            ConfigUI.renderPlayers();
            ConfigUI.validateAndUpdate();
            
            console.log('✅ Configuración restaurada');
        }, 100);
    }
};