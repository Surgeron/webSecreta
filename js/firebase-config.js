// ============================================
// CONFIGURACIÓN DE FIREBASE v8 (Sin módulos)
// ============================================

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCW3DyswiJYIeqs9bld4NkkX35knhI55nA",
  authDomain: "bd-impostor-surgeron.firebaseapp.com",
  projectId: "bd-impostor-surgeron",
  storageBucket: "bd-impostor-surgeron.firebasestorage.app",
  messagingSenderId: "1020302604136",
  appId: "1:1020302604136:web:73517d27c630e0e69008dd",
  measurementId: "G-0V9XLZMHTC"
};

// Variables globales
window.db = null;
window.firebaseInitialized = false;

function initFirebase() {
    try {
        // Verificar que Firebase esté cargado
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK no está cargado. Verifica que los scripts estén en index.html');
            return false;
        }

        console.log('🔄 Inicializando Firebase...');

        // Inicializar Firebase App
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase App inicializado');
        } else {
            console.log('✅ Firebase App ya estaba inicializado');
        }

        // Inicializar Firestore
        window.db = firebase.firestore();
        window.firebaseInitialized = true;
        
        console.log('✅ Firestore inicializado correctamente');
        console.log('✅ window.db disponible:', window.db);
        
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error);
        console.error('📋 Detalles del error:', error.message);
        
        // Mostrar detalles del error
        if (error.code) {
            console.error('Código de error:', error.code);
        }
        
        return false;
    }
}

// Esperar a que el DOM esté listo antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
} else {
    initFirebase();
}