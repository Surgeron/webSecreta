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

    // Página de Gestión de Palabras (placeholder)
    words: () => {
        return `
            <div class="container">
                <div class="hero-section">
                    <h1 class="game-title">GESTIÓN DE PALABRAS</h1>
                    <p class="game-subtitle">Próximamente...</p>
                    <button class="btn-secondary-custom" onclick="App.navigateTo('home')">
                        ← Volver al inicio
                    </button>
                </div>
            </div>
        `;
    }
};