// js/game-logic.js

/**
 * Prepara la partida: elige la palabra clave y asigna roles aleatoriamente.
 * @param {object} config - La configuración del juego.
 * @returns {object} El objeto de estado de la partida inicializado.
 */
export function setupGame(config) {
    const { jugadores, impostores, categoria } = config;

    // 1. Seleccionar la Palabra Clave aleatoriamente
    const randomIndex = Math.floor(Math.random() * categoria.words.length);
    const palabraClave = categoria.words[randomIndex];

    // 2. Asignar Roles
    const roles = [];
    
    // Asignar roles de Impostor
    for (let i = 0; i < impostores; i++) {
        roles.push('IMPOSTOR');
    }
    // Asignar roles de Agente (Ciudadano)
    const agentes = jugadores - impostores;
    for (let i = 0; i < agentes; i++) {
        roles.push('AGENTE');
    }

    // 3. Mezclar los roles (Algoritmo Fisher-Yates)
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // 4. Construir el estado inicial del juego
    const gameState = {
        config: config,
        palabraClave: palabraClave,
        categoriaNombre: categoria.name,
        rolesAsignados: roles, // Array con los roles mezclados
        currentPlayerIndex: 0  // El índice del jugador que toca revelar su rol
    };

    return gameState;
}