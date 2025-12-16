// js/db.js (¡Ahora usa Firestore!)

import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // ¡Usar la URL completa aquí!

// Nombre de la colección (equivalente a la "tabla") en Firestore
const CATEGORIES_COLLECTION = 'categories';
const categoriesCollection = collection(db, CATEGORIES_COLLECTION);

// =========================================================
// OPERACIONES CRUD CON FIRESTORE
// =========================================================

/**
 * 1. Guarda una nueva categoría o actualiza una existente.
 * @param {object} category - { id?: string, name: string, words: string[] }
 * @returns {Promise<void>}
 */
export async function saveCategory(category) {
    // Si la categoría tiene un ID, es una ACTUALIZACIÓN
    if (category.id) {
        // Excluir el 'id' al actualizar, ya que no es parte del documento en Firestore
        const { id, ...dataToUpdate } = category; 
        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        await updateDoc(categoryRef, dataToUpdate);
        console.log(`Firestore: Categoría actualizada (ID: ${id})`);
    } else {
        // Si no tiene ID, es una NUEVA CATEGORÍA
        await addDoc(categoriesCollection, {
            name: category.name,
            words: category.words
        });
        console.log("Firestore: Nueva categoría guardada.");
    }
}

/**
 * 2. Obtiene todas las categorías.
 * @returns {Promise<object[]>} Lista de objetos de categorías.
 */
export async function getCategories() {
    const snapshot = await getDocs(categoriesCollection);
    
    // Mapear los documentos de Firestore a objetos JavaScript, 
    // añadiendo el ID de Firestore como propiedad 'id'
    const categories = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
    }));
    
    console.log(`Firestore: ${categories.length} categorías cargadas.`);
    return categories;
}

/**
 * 3. Elimina una categoría por su ID.
 * @param {string} id - El ID de Firestore de la categoría a eliminar.
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(categoryRef);
    console.log(`Firestore: Categoría eliminada (ID: ${id}).`);
}

/**
 * 4. Obtiene una categoría por su ID (útil para el juego)
 * NOTA: Esta función es menos eficiente que getCategories si solo la usas para una.
 * Pero la mantendremos simple para esta versión, ya que getCategories carga todo.
 */
export async function getCategoryById(id) {
    const categories = await getCategories();
    return categories.find(c => c.id === id);
}