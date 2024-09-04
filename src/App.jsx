import { useEffect, useState } from 'react'
import './App.css'
import userContext from './utils/userContext'
import Header from './components/Header'
import SignIn from './components/Signin'
import CommentPost from './components/CommentPost'
import { collection, addDoc } from "firebase/firestore";
import { db } from './utils/firebase.utils'

function App() {
  const [user, setUser] = useState({})

  const addData = async () => {
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

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  };

  const updateData = async (id) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      email: "new-email@example.com"
    });
  };


  const deleteData = async (id) => {
    await deleteDoc(doc(db, "users", id));
  };

  useEffect(() => {
    addData();
    console.log("Fired query to firestore")
  }, [])
  /***
   * 
● Google Authentication: Ensure users can sign in with Google to post comments.
● Comment Input Box: Validate rich text formatting (bold, italic, underline, hyperlink),
file attachments (image), and user tagging.
● Comment Features: Check each comment displays profile picture, name, text,
reactions with counts, reply option, time, “show more/less” for long comments, and
attached file thumbnails.
● Sorting and Pagination: Verify comments can be sorted by latest and popular, and
pagination displays only 8 comments per page with controls.
Components:
  - Comment Dashboard
    - Header : 
      - Comments (count of comments)
      - tabs [latest | popular] (latest : default)
    - Comment Post :
      - content [text] [bold, italic, underline, hyperlink,emojis]
      - attachment [image/user tagging] [thumbnail]
      - show more / less (for long comments)
      - emoji button
      - reply button
      - time when posted
    - Reply box:
      - content [text] [bold, italic, underline, hyperlink,emojis]
      - user tagging
      - emoji button
      - reply button
   * 
  */
  return (
    // Dashboard component
    <userContext.Provider value={{ user, setUser }}>
      <>
        <SignIn />
        <div className='container'>
          <Header />
          <CommentPost />
        </div>
      </>
    </userContext.Provider>
  )
}

export default App
