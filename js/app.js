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
   async init() {
    await this.render();
    this.initEventListeners();
},

    // Navegar a una página
    async navigateTo(page) {
    if (Pages[page]) {
        this.currentPage = page;
        await this.render();
    } else {
        console.error(`Página "${page}" no encontrada`);
    }
},

    // Renderizar la página actual
async render() {
    const appContainer = document.getElementById('app');
    if (appContainer && Pages[this.currentPage]) {
        // Mostrar loading mientras se carga
        appContainer.innerHTML = '<div style="text-align: center; padding: 100px; color: #06b6d4; font-size: 1.5rem;">Cargando...</div>';
        
        // Obtener contenido de la página (puede ser asíncrono)
        const pageContent = await Pages[this.currentPage]();
        
        // Renderizar el contenido
        appContainer.innerHTML = pageContent;
        
        // Ejecutar acciones post-render
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

        // Inicializar configuración de partida
        if (this.currentPage === 'config') {
            ConfigUI.init();
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

