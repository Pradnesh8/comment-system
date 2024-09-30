
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, increment, writeBatch } from "firebase/firestore";
import { db } from './firebase.utils'
export const getEmojiText = (emoji) => {
    switch (emoji) {
        case '👍':
            return 'like';
        case '😍':
            return 'love';
        case '👏':
            return 'clap';
        case '😂':
            return 'laugh';
        case '😈':
            return 'devil';
    }
}
export const addUserData = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            userPicture: data.photoURL
        });
        console.log("Document written with ID: ", docRef.id);
        return true
    } catch (e) {
        console.error("Error adding document: ", e);
        return false
    }
};

export const getUserData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
};

export const getUserDataByEmail = async (email) => {
    try {
        // const userRef = await getDocs(collection(db, "users"));
        // const q = query(userRef, where("email", "==", email));
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        console.log("query res to find user by email", querySnapshot);
        return querySnapshot.docs.length > 0;
    } catch (err) {
        console.log("Error finding user", err)
        return false
    }
    // querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`);
    // });
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
        const findUserByMail = await getUserDataByEmail(data.email);
        console.log("found mail", findUserByMail);
        if (!findUserByMail) {
            const res = await addUserData(data)
            console.log("added user", res)
            if (!res) return ""
        }
        const docRef = await addDoc(collection(db, "comments"), {
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            content: data.content,
            attachmentUrl: data?.attachmentUrl,
            // reactions: [],
            // emojis count
            like_count: 0,
            love_count: 0,
            clap_count: 0,
            laugh_count: 0,
            devil_count: 0,
            parentPostId: data.parentPostId,
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
    // const querySnapshot = await getDocs(collection(db, "comments"));
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('replyFlag', '==', false));  // Query based on email
    const comments = []
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        comments.push(doc.data());
    });
    return comments;
};

export const getReplyCommentsByParentId = async (data) => {
    console.log('1')
    const commentsRef = collection(db, 'comments');
    console.log('2', data)

    const q = query(commentsRef, where('parentPostId', '==', data.parentPostId));  // Query based on email
    console.log('3')
    const querySnapshot = await getDocs(q);
    console.log('4')
    const comments = []
    if (querySnapshot.empty) {
        console.log('No matching documents found.');
        return comments;
    }
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

export const updateReactionCount = async (data) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('id', '==', data.postid));  // Query based on email
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('No matching documents found.');
        return false;
    }
    const getEmojiTextVal = getEmojiText(data.emoji)
    const inputObj = {}
    inputObj[`${getEmojiTextVal}_count`] = increment(1);
    // Loop through matching documents and increment the value
    // querySnapshot.forEach(async (doc) => {
    try {
        for (const doc of querySnapshot.docs) {
            await updateDoc(doc.ref, inputObj);
            console.log(`Document with ID: ${doc.id} updated, reaction count incremented.`);
        }
        return true;
    } catch (error) {
        console.error('Error updating document: ', error);
        return false
    }
    // });
};

export const decrementReactionCount = async (data) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('id', '==', data.postid));  // Query based on email
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('No matching documents found.');
        return;
    }
    const getEmojiTextVal = getEmojiText(data.emoji)
    const inputObj = {}
    inputObj[`${getEmojiTextVal}_count`] = increment(-1);
    // Loop through matching documents and increment the value
    // querySnapshot.forEach(async (doc) => {
    try {
        for (const doc of querySnapshot.docs) {
            await updateDoc(doc.ref, inputObj);
            console.log(`Document with ID: ${doc.id} updated, reaction count decremented.`);
        }
        return true
    } catch (error) {
        console.error('Error updating document: ', error);
        return false
    }
    // });
}



export const deleteComment = async (id) => {
    await deleteDoc(doc(db, "comments", id));
};


// CRUD for reactions collection

export const addReaction = async (data) => {
    try {
        const findUserByMail = await getUserDataByEmail(data.email);
        console.log("found mail", findUserByMail);
        if (!findUserByMail) {
            const res = await addUserData(data)
            console.log("added user", res)
            if (!res) return ""
        }
        // check if reaction 
        const inputObj = {
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            // emojis count
            reaction: getEmojiText(data.emoji),
            postid: data?.postid
            // uploadDateTime: data.uploadDateTime
        }
        console.log("INPUTOBJ", inputObj)
        const docRef = await addDoc(collection(db, "reactions"), inputObj);
        console.log("Document written with ID: ", docRef.id);
        return docRef;
    } catch (e) {
        console.error("Error adding document: ", e);
        return ""
    }
};

export const getReactions = async (data) => {
    try {
        const q = query(collection(db, "reactions"), where("email", "==", data.email), where('postid', '==', data.postid));
        const querySnapshot = await getDocs(q);
        const reactions = []
        // const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            console.log('No matching documents found.');
            return "";
        }

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            reactions.push(doc.data());
        });
        return reactions[0]?.reaction || "";
    } catch (err) {
        console.log("Error fetching reaction of user")
        return ""
    }
};

export const deleteReaction = async (data) => {
    // const reactionRef = db.collection('reactions');
    const q = query(collection(db, "reactions"), where("email", "==", data.email), where('postid', '==', data.postid));
    // const query = reactionRef
    //     .where('email', '==', data.email)
    //     .where('postid', '==', data.postid)

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('No matching documents found.');
        return false;
    }

    try {
        // Firestore doesn't have a direct deleteMany or deleteAll. We have to delete documents individually.
        const batch = writeBatch(db);  // Use batch to perform atomic deletes.

        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);  // Add each document to the batch for deletion.
        });

        await batch.commit();  // Commit the batch deletion.

        console.log('Deleted matching documents.');
        return true;
    } catch (error) {
        console.error('Error deleting documents:', error);
        return false;
    }
}
