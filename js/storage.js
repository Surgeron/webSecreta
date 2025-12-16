import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Guarda una palabra en una categoría específica en Firebase
 */
export async function guardarPalabraEnFirebase(categoria, palabra) {
    const categoriaRef = doc(db, "categorias", categoria);
    
    try {
        // Usamos setDoc con merge para que cree la categoría si no existe
        await setDoc(categoriaRef, {
            palabras: arrayUnion(palabra)
        }, { merge: true });
        
        console.log("Palabra guardada con éxito");
        return true;
    } catch (error) {
        console.error("Error al guardar:", error);
        return false;
    }
}

/**
 * Obtiene todas las categorías y sus palabras
 */
export async function obtenerCategoriasFirebase() {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    const categorias = [];
    querySnapshot.forEach((doc) => {
        categorias.push({ id: doc.id, ...doc.data() });
    });
    return categorias;
}