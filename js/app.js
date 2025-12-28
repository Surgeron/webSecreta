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

        // Configuración pendiente de revancha
    rematchConfig: null, // AGREGAR ESTA LÍNEA

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
    // Ejecutar después de renderizar (para efectos dinámicos)
    afterRender() {
        // Ajustar viewport height
        this.setViewportHeight();
        
        // Prevenir scroll en páginas específicas en móvil
        const noScrollPages = ['reveal', 'voting', 'group_voting']; // AGREGAR 'group_voting'
        if (window.innerWidth <= 768 && noScrollPages.includes(this.currentPage)) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        
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

        // Inicializar revelación
        if (this.currentPage === 'reveal') {
            RevealUI.init();
        }

        // Inicializar votación individual
        if (this.currentPage === 'voting') {
            VotingUI.init();
        }

        // AGREGAR: Inicializar votación grupal
        if (this.currentPage === 'group_voting') {
            GroupVotingUI.init();
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


    // Ajustar altura del viewport en móviles (especialmente iOS)
    setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    },

    // Inicializar listeners globales
    initEventListeners() {
        // Ajustar altura del viewport
        this.setViewportHeight();
        
        // Re-calcular al cambiar orientación o resize
        window.addEventListener('resize', () => {
            this.setViewportHeight();
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setViewportHeight();
            }, 100);
        });
    }


};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

