// ============================================
// INTERFAZ DE SELECCIÓN DE JUGADOR INICIAL
// ============================================

const StartPlayerUI = {
    init() {
        console.log('🎲 Inicializando selección de jugador inicial...');
    },

    reselectPlayer() {
        // Seleccionar otro jugador aleatorio
        const gameData = App.gameData;
        const activePlayers = gameData.players.filter(p => !p.eliminated);
        
        // Filtrar el jugador actual para elegir uno diferente
        const otherPlayers = activePlayers.filter(p => p.name !== gameData.selectedStartPlayer.name);
        
        if (otherPlayers.length > 0) {
            const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            gameData.selectedStartPlayer = randomPlayer;
            App.render();
        } else {
            alert('No hay otros jugadores disponibles');
        }
    },

    startDiscussion() {
        console.log('💬 Iniciando discusión...');
        // Ir directamente a votación
        App.navigateTo('voting');
    }
};