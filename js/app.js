// ============================================
// APLICACIÓN PRINCIPAL Y SISTEMA DE NAVEGACIÓN
// ============================================

const App = {
    // Estado actual de la aplicación
    currentPage: 'home',
    
    // Datos de la partida
    gameData: {
        players: [],
        category: null,
        impostorCount: 1,
        revealMode: 'visual' // 'visual' o 'sonoro'
    },

    // Inicializar la aplicación
    init() {
        this.render();
        this.initEventListeners();
    },

    // Navegar a una página
    navigateTo(page) {
        if (Pages[page]) {
            this.currentPage = page;
            this.render();
        } else {
            console.error(`Página "${page}" no encontrada`);
        }
    },

    // Renderizar la página actual
    render() {
        const appContainer = document.getElementById('app');
        if (appContainer && Pages[this.currentPage]) {
            appContainer.innerHTML = Pages[this.currentPage]();
            this.afterRender();
        }
    },

    // Ejecutar después de renderizar (para efectos dinámicos)
    afterRender() {
    // Efecto de paralaje con el mouse (solo en página de inicio)
    if (this.currentPage === 'home') {
        this.initParallaxEffect();
    }
    
    // Inicializar gestión de palabras
    if (this.currentPage === 'words') {
        WordsUI.init();
    }
},

    // Efecto de paralaje en las cards
    initParallaxEffect() {
        const handleMouseMove = (e) => {
            const cards = document.querySelectorAll('.info-card');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            cards.forEach((card, index) => {
                const speed = (index + 1) * 2;
                const xOffset = (x - 0.5) * speed;
                const yOffset = (y - 0.5) * speed;
                card.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
    },

    // Inicializar listeners globales
    initEventListeners() {
        // Aquí irán eventos globales si son necesarios
    }
};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

