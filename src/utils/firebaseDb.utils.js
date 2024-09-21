
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase.utils'

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

// CRUD for comments collection

export const addComment = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "comments"), {
            name: data.name,
            email: data.email,
            content: data.content,
            attachmentUrl: data?.attachmentUrl,
            reactions: [],
            replyFlag: data.replyFlag,
            userPicture: data.photoURL,
            uploadDateTime: data.uploadDateTime
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef;
    } catch (e) {
        console.error("Error adding document: ", e);
        return ""
    }
};

export const getComments = async () => {
    const querySnapshot = await getDocs(collection(db, "comments"));
    const comments = []
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        comments.push(doc.data());
    });
    return comments;
};

export const updateComment = async (id, data) => {
    const userRef = doc(db, "comments", id);
    await updateDoc(userRef, {
        reactions: data.reactions
    });
};


export const deleteComment = async (id) => {
    await deleteDoc(doc(db, "comments", id));
};