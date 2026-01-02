// ============================================
// INTERFAZ DE VOTACIÓN GRUPAL
// ============================================

const GroupVotingUI = {
    selectedPlayer: null,

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    init() {
        console.log('👥 Inicializando votación grupal...');
        this.selectedPlayer = null;
    },

    // ============================================
    // SELECCIÓN Y ELIMINACIÓN
    // ============================================

    selectPlayer(playerName) {
        console.log(`👤 Seleccionado: ${playerName}`);
        
        // Guardar selección
        this.selectedPlayer = playerName;

        // Resaltar jugador seleccionado
        document.querySelectorAll('.group-player-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const sanitizeName = (name) => name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const selectedCard = document.getElementById(`player-${sanitizeName(playerName)}`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Mostrar confirmación
        document.getElementById('selectedPlayerName').textContent = playerName;
        document.getElementById('confirmEliminationContainer').style.display = 'flex';
    },

    cancelSelection() {
        this.selectedPlayer = null;
        
        // Remover selección visual
        document.querySelectorAll('.group-player-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Ocultar confirmación
        document.getElementById('confirmEliminationContainer').style.display = 'none';
    },

    confirmElimination() {
        if (!this.selectedPlayer) return;

        console.log(`❌ Eliminando a: ${this.selectedPlayer}`);

        // Encontrar al jugador y marcarlo como eliminado
        const eliminatedPlayer = App.gameData.players.find(p => p.name === this.selectedPlayer);
        if (eliminatedPlayer) {
            eliminatedPlayer.eliminated = true;
            // Darle todos los votos para que aparezca en resultados
            eliminatedPlayer.votes = 999;
        }

        // Resetear selección
        this.selectedPlayer = null;

        // Ir a resultados
        App.navigateTo('results');
    }
};