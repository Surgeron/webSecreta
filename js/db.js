// js/db.js

// Nombre y versión de la base de datos
const DB_NAME = 'ImpostorWordDB';
const DB_VERSION = 1;
// Nombre del almacén de objetos (equivalente a una "tabla")
const CATEGORIES_STORE = 'categories';

let db;

/**
 * 1. Inicializa y abre la conexión con IndexedDB.
 * @returns {Promise<IDBDatabase>} La promesa que se resuelve con el objeto de la BD.
 */
function openDB() {
    return new Promise((resolve, reject) => {
        // Pedir abrir la BD
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Se ejecuta si la versión es diferente o si la BD se crea por primera vez
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            // Si el almacén no existe, lo creamos
            if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
                // Creamos el almacén de objetos. Usaremos el "id" de la categoría como clave primaria.
                db.createObjectStore(CATEGORIES_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };

        // Éxito al abrir
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("IndexedDB: Conexión exitosa.");
            resolve(db);
        };

        // Error al abrir
        request.onerror = (event) => {
            console.error("IndexedDB: Error al abrir", event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Función auxiliar para obtener una transacción de lectura/escritura.
 * @param {string} mode - 'readonly' o 'readwrite'.
 * @returns {IDBObjectStore} El almacén de objetos listo.
 */
function getObjectStore(mode) {
    if (!db) {
        throw new Error("Base de datos no inicializada. Llama a openDB primero.");
    }
    const transaction = db.transaction(CATEGORIES_STORE, mode);
    return transaction.objectStore(CATEGORIES_STORE);
}

// =========================================================
// OPERACIONES CRUD (Create, Read, Update, Delete)
// =========================================================

/**
 * 2. Guarda una nueva categoría o actualiza una existente.
 * @param {object} category - { id?: number, name: string, words: string[] }
 * @returns {Promise<void>}
 */
export async function saveCategory(category) {
    await openDB(); // Asegura la conexión
    return new Promise((resolve, reject) => {
        try {
            const store = getObjectStore('readwrite');
            // put() inserta si no existe el ID o actualiza si existe
            const request = store.put(category);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 3. Obtiene todas las categorías.
 * @returns {Promise<object[]>} Lista de objetos de categorías.
 */
export async function getCategories() {
    await openDB(); // Asegura la conexión
    return new Promise((resolve, reject) => {
        try {
            const store = getObjectStore('readonly');
            // getAll() recupera todos los registros
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 4. Elimina una categoría por su ID.
 * @param {number} id - El ID de la categoría a eliminar.
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
    await openDB(); // Asegura la conexión
    return new Promise((resolve, reject) => {
        try {
            const store = getObjectStore('readwrite');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        } catch (error) {
            reject(error);
        }
    });
}

// Inicializar la conexión cuando se carga el script
openDB().catch(e => console.error("Fallo la apertura inicial de la BD.", e));