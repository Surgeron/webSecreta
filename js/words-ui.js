// ============================================
// INTERFAZ DE USUARIO PARA GESTIÓN DE PALABRAS
// ============================================

const WordsUI = {
    currentCategoryId: null,
    editingCategoryId: null,
    editingWord: null,

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    async init() {
        await WordsManager.loadCategories();
        this.renderCategories();
    },

    // ============================================
    // RENDERIZADO DE CATEGORÍAS
    // ============================================

    renderCategories() {
        const container = document.getElementById('categoriesList');
        if (!container) return;

        if (WordsManager.categories.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    <p>No hay categorías aún</p>
                    <p class="empty-hint">Crea tu primera categoría para empezar</p>
                </div>
            `;
            return;
        }

        container.innerHTML = WordsManager.categories.map(category => `
            <div class="category-item ${this.currentCategoryId === category.id ? 'active' : ''}" 
                 onclick="WordsUI.selectCategory('${category.id}')">
                <div class="category-info">
                    <span class="category-name">${category.name}</span>
                    <span class="category-count">${category.words?.length || 0} palabras</span>
                </div>
                <div class="category-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); WordsUI.editCategory('${category.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="event.stopPropagation(); WordsUI.deleteCategory('${category.id}')" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    },

    // ============================================
    // RENDERIZADO DE PALABRAS
    // ============================================

    renderWords() {
        const container = document.getElementById('wordsList');
        const titleElement = document.getElementById('wordsPanelTitle');
        const btnAddWord = document.getElementById('btnAddWord');

        if (!this.currentCategoryId) {
            container.innerHTML = `
                <div class="empty-message">
                    <p>👈 Selecciona una categoría para ver sus palabras</p>
                </div>
            `;
            titleElement.textContent = '📝 Palabras';
            btnAddWord.disabled = true;
            return;
        }

        const category = WordsManager.categories.find(c => c.id === this.currentCategoryId);
        if (!category) return;

        titleElement.textContent = `📝 Palabras - ${category.name}`;
        btnAddWord.disabled = false;

        if (!category.words || category.words.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    <p>No hay palabras en esta categoría</p>
                    <p class="empty-hint">Agrega la primera palabra</p>
                </div>
            `;
            return;
        }

        container.innerHTML = category.words.map(word => `
            <div class="word-item">
                <span class="word-text">${word}</span>
                <div class="word-actions">
                    <button class="btn-icon" onclick="WordsUI.editWord('${word}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="WordsUI.deleteWord('${word}')" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    },

    // ============================================
    // ACCIONES DE CATEGORÍAS
    // ============================================

    selectCategory(categoryId) {
        this.currentCategoryId = categoryId;
        WordsManager.selectCategory(categoryId);
        this.renderCategories();
        this.renderWords();
    },

    showAddCategoryModal() {
        this.editingCategoryId = null;
        document.getElementById('categoryModalTitle').textContent = 'Nueva Categoría';
        document.getElementById('categoryNameInput').value = '';
        document.getElementById('categoryModal').style.display = 'flex';
        document.getElementById('categoryNameInput').focus();
    },

    editCategory(categoryId) {
        const category = WordsManager.categories.find(c => c.id === categoryId);
        if (!category) return;

        this.editingCategoryId = categoryId;
        document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
        document.getElementById('categoryNameInput').value = category.name;
        document.getElementById('categoryModal').style.display = 'flex';
        document.getElementById('categoryNameInput').focus();
    },

    async saveCategoryFromModal() {
        const name = document.getElementById('categoryNameInput').value.trim();
        
        if (!name) {
            alert('Por favor ingresa un nombre para la categoría');
            return;
        }

        let result;
        if (this.editingCategoryId) {
            result = await WordsManager.updateCategory(this.editingCategoryId, name);
        } else {
            result = await WordsManager.createCategory(name);
        }

        if (result.success) {
            this.renderCategories();
            this.closeModals();
        } else {
            alert('Error: ' + result.error);
        }
    },

    async deleteCategory(categoryId) {
        const category = WordsManager.categories.find(c => c.id === categoryId);
        if (!category) return;

        const confirmMessage = category.words?.length > 0
            ? `¿Eliminar "${category.name}" y sus ${category.words.length} palabras?`
            : `¿Eliminar la categoría "${category.name}"?`;

        if (!confirm(confirmMessage)) return;

        const result = await WordsManager.deleteCategory(categoryId);
        
        if (result.success) {
            if (this.currentCategoryId === categoryId) {
                this.currentCategoryId = null;
            }
            this.renderCategories();
            this.renderWords();
        } else {
            alert('Error: ' + result.error);
        }
    },

    // ============================================
    // ACCIONES DE PALABRAS
    // ============================================

    showAddWordModal() {
        if (!this.currentCategoryId) return;

        this.editingWord = null;
        document.getElementById('wordModalTitle').textContent = 'Nueva Palabra';
        document.getElementById('wordInput').value = '';
        document.getElementById('wordModal').style.display = 'flex';
        document.getElementById('wordInput').focus();
    },

    editWord(word) {
        this.editingWord = word;
        document.getElementById('wordModalTitle').textContent = 'Editar Palabra';
        document.getElementById('wordInput').value = word;
        document.getElementById('wordModal').style.display = 'flex';
        document.getElementById('wordInput').focus();
    },

    async saveWordFromModal() {
        const word = document.getElementById('wordInput').value.trim();
        
        if (!word) {
            alert('Por favor ingresa una palabra');
            return;
        }

        let result;
        if (this.editingWord) {
            result = await WordsManager.updateWord(this.currentCategoryId, this.editingWord, word);
        } else {
            result = await WordsManager.addWord(this.currentCategoryId, word);
        }

        if (result.success) {
            this.renderWords();
            this.closeModals();
        } else {
            alert('Error: ' + result.error);
        }
    },

    async deleteWord(word) {
        if (!confirm(`¿Eliminar la palabra "${word}"?`)) return;

        const result = await WordsManager.removeWord(this.currentCategoryId, word);
        
        if (result.success) {
            this.renderWords();
        } else {
            alert('Error: ' + result.error);
        }
    },

    // ============================================
    // UTILIDADES
    // ============================================

    closeModals() {
        document.getElementById('categoryModal').style.display = 'none';
        document.getElementById('wordModal').style.display = 'none';
    }
};

// Cerrar modales al presionar Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        WordsUI.closeModals();
    }
});

// Cerrar modales al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        WordsUI.closeModals();
    }
});