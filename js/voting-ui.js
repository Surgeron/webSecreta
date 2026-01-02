// ============================================
// INTERFAZ DE VOTACIÓN SIMPLIFICADA
// ============================================

const VotingUI = {
    selectedPlayerForElimination: null,

    init() {
        console.log('🗳️ Inicializando votación simplificada...');
        
        // Inicializar número de ronda si no existe
        if (!App.gameData.roundNumber) {
            App.gameData.roundNumber = 1;
        }
        
        console.log(`📍 Ronda ${App.gameData.roundNumber}`);
    },

    // Función helper para sanitizar nombres
    sanitizeName(name) {
        return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    },

    selectPlayerForElimination(playerName) {
        console.log(`👉 Jugador seleccionado para eliminación: ${playerName}`);
        
        this.selectedPlayerForElimination = playerName;

        // Resaltar jugador seleccionado
        document.querySelectorAll('.elimination-player-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.getElementById(`elimination-player-${this.sanitizeName(playerName)}`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Mostrar confirmación
        document.getElementById('eliminationPlayerName').textContent = playerName;
        document.getElementById('eliminationConfirmContainer').style.display = 'block';
    },

    cancelElimination() {
        this.selectedPlayerForElimination = null;
        
        // Remover selección visual
        document.querySelectorAll('.elimination-player-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Ocultar confirmación
        document.getElementById('eliminationConfirmContainer').style.display = 'none';
    },

    confirmElimination() {
        if (!this.selectedPlayerForElimination) return;

        console.log(`✅ Confirmada eliminación de: ${this.selectedPlayerForElimination}`);

        // IMPORTANTE: Encontrar al jugador por nombre exacto
        const eliminatedPlayer = App.gameData.players.find(p => p.name === this.selectedPlayerForElimination);
        
        if (!eliminatedPlayer) {
            console.error('❌ No se encontró el jugador seleccionado:', this.selectedPlayerForElimination);
            alert('Error: No se pudo encontrar al jugador seleccionado');
            return;
        }

        // Limpiar cualquier flag anterior
        App.gameData.players.forEach(p => {
            p.justEliminated = false;
        });

        // Marcar al jugador como eliminado
        eliminatedPlayer.eliminated = true;
        eliminatedPlayer.justEliminated = true; // Flag temporal para mostrar en resultados

        console.log(`🎯 Jugador eliminado correctamente:`, {
            nombre: eliminatedPlayer.name,
            esImpostor: eliminatedPlayer.isImpostor,
            eliminado: eliminatedPlayer.eliminated
        });

        // Resetear selección
        this.selectedPlayerForElimination = null;

        // Ir a resultados
        App.navigateTo('results');
    },

    // Función para nueva ronda (desde resultados)
    startNewRound() {
        console.log('🔄 Iniciando nueva ronda de votación...');
        
        // Incrementar contador de rondas
        App.gameData.roundNumber = (App.gameData.roundNumber || 1) + 1;
        
        // Resetear jugador inicial para nueva selección
        App.gameData.selectedStartPlayer = null;
        
        console.log(`📍 Ahora en ronda ${App.gameData.roundNumber}`);
        
        // Ir a selección de jugador inicial
        App.navigateTo('startPlayer');
    },

    // Revancha
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
            selectedStartPlayer: null,
            roundNumber: 1
        };

        // Guardar config para restaurar
        App.rematchConfig = savedConfig;

        // Volver a configuración
        App.navigateTo('config');
    }
};