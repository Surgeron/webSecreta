// ============================================
// GESTOR DE PALABRAS Y CATEGORÍAS (CRUD)
// ============================================

const WordsManager = {
    // Colecciones de Firebase
    CATEGORIES_COLLECTION: 'categories',

    // Estado local
    categories: [],
    selectedCategory: null,
    isLoading: false,

    // Verificar que Firebase esté listo
    checkFirebase() {
        if (!window.firebaseInitialized || !window.db) {
            console.error('❌ Firebase no está inicializado');
            alert('Error: No se pudo conectar con Firebase. Verifica la consola.');
            return false;
        }
        return true;
    },

    // ============================================
    // CRUD DE CATEGORÍAS
    // ============================================

    // Crear nueva categoría
    async createCategory(name) {
        if (!this.checkFirebase()) return { success: false, error: 'Firebase no inicializado' };
        
        try {
            this.isLoading = true;
            const categoryData = {
                name: name.trim(),
                words: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await window.db.collection(this.CATEGORIES_COLLECTION).add(categoryData);
            console.log('✅ Categoría creada con ID:', docRef.id);
            
            await this.loadCategories();
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error al crear categoría:', error);
            return { success: false, error: error.message };
        } finally {
            this.isLoading = false;
        }
    },

    // Leer todas las categorías
    async loadCategories() {
        if (!this.checkFirebase()) return [];
        
        try {
            this.isLoading = true;
            
            console.log('🔄 Cargando categorías desde Firebase...');
            
            const snapshot = await window.db.collection(this.CATEGORIES_COLLECTION)
                .orderBy('createdAt', 'desc')
                .get();

            this.categories = [];
            snapshot.forEach(doc => {
                this.categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log(`✅ ${this.categories.length} categorías cargadas`);
            return this.categories;
        } catch (error) {
            console.error('❌ Error al cargar categorías:', error);
            
            // Si es error de índice, dar instrucciones
            if (error.code === 'failed-precondition') {
                console.error('⚠️ Necesitas crear un índice en Firestore.');
                console.error('Haz clic en el enlace que aparece en el error anterior.');
            }
            
            return [];
        } finally {
            this.isLoading = false;
        }
    },

    // Actualizar nombre de categoría
    async updateCategory(categoryId, newName) {
        if (!this.checkFirebase()) return { success: false, error: 'Firebase no inicializado' };
        
        try {
            await window.db.collection(this.CATEGORIES_COLLECTION).doc(categoryId).update({
                name: newName.trim()
            });
            
            await this.loadCategories();
            return { success: true };
        } catch (error) {
            console.error('❌ Error al actualizar categoría:', error);
            return { success: false, error: error.message };
        }
    },

    // Eliminar categoría
    async deleteCategory(categoryId) {
        if (!this.checkFirebase()) return { success: false, error: 'Firebase no inicializado' };
        
        try {
            await window.db.collection(this.CATEGORIES_COLLECTION).doc(categoryId).delete();
            
            if (this.selectedCategory?.id === categoryId) {
                this.selectedCategory = null;
            }
            
            await this.loadCategories();
            return { success: true };
        } catch (error) {
            console.error('❌ Error al eliminar categoría:', error);
            return { success: false, error: error.message };
        }
    },

    // ============================================
    // CRUD DE PALABRAS
    // ============================================

    // Agregar palabra a una categoría
   async addWord(categoryId, word) {
    if (!this.checkFirebase()) return { success: false, error: 'Firebase no inicializado' };
    
    try {
        const wordTrimmed = word.trim().toUpperCase(); // ← CAMBIO: toLowerCase() por toUpperCase()
        
        // Verificar que la palabra no exista ya
        const category = this.categories.find(c => c.id === categoryId);
        if (category && category.words && category.words.includes(wordTrimmed)) {
            return { success: false, error: 'La palabra ya existe en esta categoría' };
        }

        await window.db.collection(this.CATEGORIES_COLLECTION).doc(categoryId).update({
            words: firebase.firestore.FieldValue.arrayUnion(wordTrimmed)
        });
        
        await this.loadCategories();
        return { success: true };
    } catch (error) {
        console.error('❌ Error al agregar palabra:', error);
        return { success: false, error: error.message };
    }
    },

    // Eliminar palabra de una categoría
    async removeWord(categoryId, word) {
        if (!this.checkFirebase()) return { success: false, error: 'Firebase no inicializado' };
        
        try {
            await window.db.collection(this.CATEGORIES_COLLECTION).doc(categoryId).update({
                words: firebase.firestore.FieldValue.arrayRemove(word)
            });
            
            await this.loadCategories();
            return { success: true };
        } catch (error) {
            console.error('❌ Error al eliminar palabra:', error);
            return { success: false, error: error.message };
        }
    },

    // Actualizar palabra
    async updateWord(categoryId, oldWord, newWord) {
    if (!this.checkFirebase()) return { success: false, error: 'Firebase no inicializado' };
    
    try {
        const newWordTrimmed = newWord.trim().toUpperCase(); // ← CAMBIO: toLowerCase() por toUpperCase()
        
        // Eliminar la palabra vieja y agregar la nueva
        const categoryRef = window.db.collection(this.CATEGORIES_COLLECTION).doc(categoryId);
        
        await categoryRef.update({
            words: firebase.firestore.FieldValue.arrayRemove(oldWord)
        });
        
        await categoryRef.update({
            words: firebase.firestore.FieldValue.arrayUnion(newWordTrimmed)
        });
        
        await this.loadCategories();
        return { success: true };
    } catch (error) {
        console.error('❌ Error al actualizar palabra:', error);
        return { success: false, error: error.message };
    }
},

    // ============================================
    // UTILIDADES
    // ============================================

    // Seleccionar categoría actual
    selectCategory(categoryId) {
        this.selectedCategory = this.categories.find(c => c.id === categoryId);
        return this.selectedCategory;
    },

    // Obtener palabra aleatoria de una categoría
    getRandomWord(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category || !category.words || category.words.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * category.words.length);
        return category.words[randomIndex];
    },

    // Obtener categoría aleatoria
    getRandomCategory() {
        if (this.categories.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * this.categories.length);
        return this.categories[randomIndex];
    }
};