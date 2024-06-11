import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVZy7wcWjBjQC6shBuXqcrH5QMPePueR0",
    authDomain: "stocksupermark.firebaseapp.com",
    projectId: "stocksupermark",
    storageBucket: "stocksupermark.appspot.com",
    messagingSenderId: "340503110669",
    appId: "1:340503110669:web:c0418c261aa2e449a2a144"
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
    await addDoc(collection(db, 'Productos'), producto);
}

export const getData = (callback) => {
    onSnapshot(collection(db, 'Productos'), callback);
}

export const remove = (id) => {
    deleteDoc(doc(db, 'Productos', id));
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
    await updateDoc(doc(db, 'Productos', id), producto);
}
