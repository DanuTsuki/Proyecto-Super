import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, updateDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyBEhGwEx7ZjGym0OqosDOWGFwX0GI-hhiQ",
  authDomain: "supermarket-d9d88.firebaseapp.com",
  projectId: "supermarket-d9d88",
  storageBucket: "supermarket-d9d88.appspot.com",
  messagingSenderId: "437951303291",
  appId: "1:437951303291:web:f88732e29fd62475729cde"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const save = async (producto) => {
    
    let imageUrl = "";
    if (producto.imagen) {
        const storageRef = ref(storage, `images/${producto.imagen.name}`);
        await uploadBytes(storageRef, producto.imagen);
        imageUrl = await getDownloadURL(storageRef); 
    }
    producto.imagenUrl = imageUrl;
    delete producto.imagen; 
    await addDoc(collection(db, 'Productos'), producto);
}

export const getData = (callback) => {
    onSnapshot(collection(db, 'Productos'), callback);
}

export const remove = (id) => {
    return deleteDoc(doc(db, 'Productos', id));
}

export const getDocumento = (id) => getDoc(doc(db, 'Productos', id));

export const update = async (id, producto) => {
    let imageUrl = producto.imagenUrl || "";
    if (producto.imagen) {
        const storageRef = ref(storage, `images/${producto.imagen.name}`);
        await uploadBytes(storageRef, producto.imagen);
        imageUrl = await getDownloadURL(storageRef); 
    }
    producto.imagenUrl = imageUrl;
    delete producto.imagen; 
    await updateDoc(doc(db, 'Productos', id), producto);
}

export const getStorageRef = () => {
    return ref(storage);
}

export const verificarCodigoUnico = async (codigo) => {
    const q = query(collection(db, 'Productos'), where('codigo', '==', codigo));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}
