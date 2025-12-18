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

        const button = document.getElementById('revealButton');
        const circle = document.querySelector('.progress-ring-circle');
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

        clearInterval(this.revealTimer);
        
        const button = document.getElementById('revealButton');
        const circle = document.querySelector('.progress-ring-circle');
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
    // REVELACIÓN SONORA (TTS)
    // ============================================

    revealAudio() {
        const audioReveal = document.getElementById('audioReveal');
        audioReveal.style.display = 'block';

        const gameData = App.gameData;
        const currentPlayer = gameData.players[gameData.currentPlayerIndex];

        // Preparar el texto a reproducir
        let textToSpeak;
        if (currentPlayer.isImpostor) {
            textToSpeak = 'Eres el impostor. Shh. Eres el impostor. Shh.';
        } else {
            textToSpeak = `La palabra secreta es: ${gameData.secretWord}. Repito: ${gameData.secretWord}.`;
        }

        // Reproducir con Text-to-Speech
        this.speakText(textToSpeak);
    },

    speakText(text) {
        // Cancelar cualquier audio anterior
        if (this.currentUtterance) {
            window.speechSynthesis.cancel();
        }

        // Crear utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Configurar voz en español
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
        if (spanishVoice) {
            this.currentUtterance.voice = spanishVoice;
        }
        
        // Configuración de voz
        this.currentUtterance.lang = 'es-ES';
        this.currentUtterance.rate = 0.9; // Velocidad (0.9 = un poco más lento)
        this.currentUtterance.pitch = 1.0; // Tono
        this.currentUtterance.volume = 1.0; // Volumen

        // Eventos
        this.currentUtterance.onstart = () => {
            console.log('🔊 Reproduciendo audio...');
            document.getElementById('audioStatus').querySelector('p').textContent = 'Reproduciendo audio...';
        };

        this.currentUtterance.onend = () => {
            console.log('✅ Audio finalizado');
            document.getElementById('audioStatus').querySelector('p').textContent = 'Audio finalizado';
            
            // Mostrar botón de replay
            const btnReplay = document.getElementById('btnReplay');
            btnReplay.style.display = 'block';
            
            // Ocultar animación de onda
            document.querySelector('.audio-wave').style.display = 'none';
        };

        this.currentUtterance.onerror = (error) => {
            console.error('❌ Error en TTS:', error);
            document.getElementById('audioStatus').querySelector('p').textContent = 'Error al reproducir audio';
        };

        // Reproducir
        window.speechSynthesis.speak(this.currentUtterance);
    },

    replayAudio() {
        const gameData = App.gameData;
        const currentPlayer = gameData.players[gameData.currentPlayerIndex];

        // Preparar texto
        let textToSpeak;
        if (currentPlayer.isImpostor) {
            textToSpeak = 'Eres el impostor. Shh. Eres el impostor. Shh.';
        } else {
            textToSpeak = `La palabra secreta es: ${gameData.secretWord}. Repito: ${gameData.secretWord}.`;
        }

        // Mostrar animación de onda de nuevo
        document.querySelector('.audio-wave').style.display = 'flex';
        
        // Reproducir de nuevo
        this.speakText(textToSpeak);
    },

    // ============================================
    // NAVEGACIÓN
    // ============================================

    nextPlayer() {
        // Detener cualquier audio en reproducción
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const gameData = App.gameData;
        
        // Verificar si era el último jugador
        if (gameData.currentPlayerIndex >= gameData.players.length - 1) {
            // Ir a votación
            App.navigateTo('voting');
        } else {
            // Pasar al siguiente jugador
            gameData.currentPlayerIndex++;
            
            // Resetear estado de revelación
            this.isRevealed = false;
            this.revealProgress = 0;
            
            // Re-renderizar la página
            App.render();
        }
    },

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    init() {
        // Cargar voces disponibles
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                console.log('🔊 Voces disponibles:', voices.length);
                
                const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
                console.log('🇪🇸 Voces en español:', spanishVoices.length);
            };
        }
    }
};