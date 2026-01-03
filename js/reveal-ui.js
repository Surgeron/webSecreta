// ============================================
// INTERFAZ DE REVELACIÓN DE ROLES
// ============================================

const RevealUI = {
    revealTimer: null,
    revealProgress: 0,
    revealDuration: 1500, // 1.5 segundos mantener presionado
    isRevealed: false,
    audioContext: null,
    currentUtterance: null,

    // ============================================
    // REVELACIÓN CON BOTÓN PRESIONADO
    // ============================================

    startReveal() {
        if (this.isRevealed) return;

        console.log('🔒 Iniciando revelación...');

        const button = document.getElementById('revealButton');
        const circle = document.querySelector('.progress-ring-circle');
        
        if (!button || !circle) {
            console.error('❌ No se encontraron elementos del botón');
            return;
        }
        
        const circumference = 2 * Math.PI * 56; // radio = 56

        button.classList.add('revealing');
        
        const startTime = Date.now();
        
        this.revealTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            this.revealProgress = Math.min(elapsed / this.revealDuration, 1);
            
            // Actualizar anillo de progreso
            const offset = circumference * (1 - this.revealProgress);
            circle.style.strokeDashoffset = offset;
            
            // Si completó el tiempo, revelar
            if (this.revealProgress >= 1) {
                this.completeReveal();
            }
        }, 16); // ~60fps
    },

    cancelReveal() {
        if (this.isRevealed) return;

        console.log('❌ Cancelando revelación...');

        clearInterval(this.revealTimer);
        
        const button = document.getElementById('revealButton');
        const circle = document.querySelector('.progress-ring-circle');
        
        if (!button || !circle) {
            console.warn('⚠️ No se encontraron elementos para cancelar');
            return;
        }
        
        const circumference = 2 * Math.PI * 56;
        
        button.classList.remove('revealing');
        
        // Resetear progreso con animación
        circle.style.transition = 'stroke-dashoffset 0.3s ease';
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            circle.style.transition = '';
        }, 300);
        
        this.revealProgress = 0;
    },

    completeReveal() {
        clearInterval(this.revealTimer);
        this.isRevealed = true;

        const button = document.getElementById('revealButton');
        const roleArea = document.getElementById('roleRevealArea');
        const btnNext = document.getElementById('btnNextPlayer');

        // Ocultar botón de revelar
        button.style.display = 'none';

        // Mostrar área de revelación
        roleArea.style.display = 'block';

        // Revelar según el modo
        const gameData = App.gameData;
        if (gameData.revealMode === 'visual') {
            this.revealVisual();
        } else {
            this.revealAudio();
        }

        // Mostrar botón de siguiente jugador
        setTimeout(() => {
            btnNext.style.display = 'block';
            btnNext.disabled = false;
        }, 500);
    },

    // ============================================
    // REVELACIÓN VISUAL
    // ============================================

    revealVisual() {
        const visualReveal = document.getElementById('visualReveal');
        visualReveal.style.display = 'block';
        
        // Animación de entrada
        setTimeout(() => {
            visualReveal.classList.add('revealed');
        }, 100);
    },
// ============================================
// REVELACIÓN SONORA (TTS con ResponsiveVoice)
// ============================================

    revealAudio() {
        const audioReveal = document.getElementById('audioReveal');
        audioReveal.style.display = 'block';

        const gameData = App.gameData;
        const currentPlayer = gameData.players[gameData.currentPlayerIndex];

        // Preparar el texto a reproducir
        let textToSpeak;
        if (currentPlayer.isImpostor) {
            textToSpeak = 'Eres el impostor. Repito. Eres el impostor. Repito.';
        } else {
            // Para palabras: decir naturalmente
            textToSpeak = `La palabra secreta es: ${gameData.secretWord}. Repito: ${gameData.secretWord}.`;
        }

        // Reproducir con ResponsiveVoice
        this.speakTextResponsive(textToSpeak);
    },

    speakTextResponsive(text) {
        // Detener cualquier audio anterior
        if (typeof responsiveVoice !== 'undefined') {
            responsiveVoice.cancel();
        }

        const statusElement = document.getElementById('audioStatus');
        const btnReplay = document.getElementById('btnReplay');
        const audioWave = document.querySelector('.audio-wave');

        // Callback cuando empieza
        const onStart = () => {
            console.log('🔊 Reproduciendo audio...');
            if (statusElement) {
                statusElement.querySelector('p').textContent = 'Reproduciendo audio...';
            }
            if (audioWave) {
                audioWave.style.display = 'flex';
            }
        };

        // Callback cuando termina
        const onEnd = () => {
            console.log('✅ Audio finalizado');
            if (statusElement) {
                statusElement.querySelector('p').textContent = 'Audio finalizado';
            }
            if (btnReplay) {
                btnReplay.style.display = 'block';
            }
            if (audioWave) {
                audioWave.style.display = 'none';
            }
        };

        // Parámetros de voz
        const voiceParams = {
            pitch: 1,           // Tono normal
            rate: 0.9,          // Velocidad un poco más lenta
            volume: 1,          // Volumen máximo
            onstart: onStart,
            onend: onEnd,
            onerror: (error) => {
                console.error('❌ Error en TTS:', error);
                if (statusElement) {
                    statusElement.querySelector('p').textContent = 'Error al reproducir audio';
                }
            }
        };

        // Reproducir con voz en español
        // Opciones de voces en español:
        // - 'Spanish Latin American Female' (Latinoamericano)
        // - 'Spanish Female' (España)
        // - 'Spanish Male' (España)
        
        if (typeof responsiveVoice !== 'undefined') {
            responsiveVoice.speak(text, 'Spanish Latin American Female', voiceParams);
        } else {
            console.error('❌ ResponsiveVoice no está disponible');
            alert('Error: Sistema de audio no disponible');
        }
    },

    replayAudio() {
        const gameData = App.gameData;
        const currentPlayer = gameData.players[gameData.currentPlayerIndex];

        // Preparar texto
        let textToSpeak;
        if (currentPlayer.isImpostor) {
            textToSpeak = 'Eres el impostor. Repito. Eres el impostor.';
        } else {
            textToSpeak = `La palabra secreta es: ${gameData.secretWord}. Repito: ${gameData.secretWord}.`;
        }

        // Mostrar animación de onda de nuevo
        const audioWave = document.querySelector('.audio-wave');
        if (audioWave) {
            audioWave.style.display = 'flex';
        }
        
        // Ocultar botón de replay mientras reproduce
        const btnReplay = document.getElementById('btnReplay');
        if (btnReplay) {
            btnReplay.style.display = 'none';
        }
        
        // Reproducir de nuevo
        this.speakTextResponsive(textToSpeak);
    },

    // Actualizar también nextPlayer para detener audio
    nextPlayer() {
        console.log('➡️ Pasando al siguiente jugador...');
        
        // Detener cualquier audio en reproducción (ResponsiveVoice)
        if (typeof responsiveVoice !== 'undefined' && responsiveVoice.isPlaying()) {
            responsiveVoice.cancel();
        }
        
        // También detener Web Speech API por si acaso
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const gameData = App.gameData;
        
        // Verificar si era el último jugador
        if (gameData.currentPlayerIndex >= gameData.players.length - 1) {
            console.log('✅ Último jugador - Ir a selección de jugador inicial');
            App.navigateTo('startPlayer');
        } else {
            console.log(`🔄 Siguiente jugador (${gameData.currentPlayerIndex + 1} → ${gameData.currentPlayerIndex + 2})`);
            gameData.currentPlayerIndex++;
            
            // Resetear estado de revelación
            this.revealTimer = null;
            this.revealProgress = 0;
            this.isRevealed = false;
            this.currentUtterance = null;
            
            // Re-renderizar la página
            App.render();
        }
    },
    // ============================================
    // NAVEGACIÓN
    // ============================================

    nextPlayer() {
        console.log('➡️ Pasando al siguiente jugador...');
        
        // Detener cualquier audio en reproducción
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const gameData = App.gameData;
        
        // Verificar si era el último jugador
        if (gameData.currentPlayerIndex >= gameData.players.length - 1) {
            console.log('✅ Último jugador - Ir a selección de jugador inicial');
            // Ir a selección de jugador inicial en lugar de votación directa
            App.navigateTo('startPlayer');
        } else {
            console.log(`🔄 Siguiente jugador (${gameData.currentPlayerIndex + 1} → ${gameData.currentPlayerIndex + 2})`);
            // Pasar al siguiente jugador
            gameData.currentPlayerIndex++;
            
            // Resetear estado de revelación
            this.revealTimer = null;
            this.revealProgress = 0;
            this.isRevealed = false;
            this.currentUtterance = null;
            
            // Re-renderizar la página
            App.render();
        }
    },

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    init() {
        console.log('🎭 Inicializando revelación...');
        
        // Resetear todo el estado
        this.revealTimer = null;
        this.revealProgress = 0;
        this.isRevealed = false;
        this.currentUtterance = null;
        
        // Detener cualquier audio previo (ambos sistemas)
        if (typeof responsiveVoice !== 'undefined' && responsiveVoice.isPlaying()) {
            responsiveVoice.cancel();
        }
        
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        console.log('✅ RevealUI inicializado correctamente');
    },
};