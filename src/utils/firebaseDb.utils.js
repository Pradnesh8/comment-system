
import { collection, addDoc } from "firebase/firestore";
import { db } from './utils/firebase.utils'

export const addData = async () => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: "John Doe",
            email: "john@example.com"
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
};

export const updateData = async (id) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
        email: "new-email@example.com"
    });
};


export const deleteData = async (id) => {
    await deleteDoc(doc(db, "users", id));
};

