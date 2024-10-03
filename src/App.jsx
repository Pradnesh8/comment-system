import { useEffect, useState } from 'react'
import './App.css'
import userContext from './utils/userContext'
import appContext from './utils/appContext'
import SignIn from './components/Signin'
import CommentPostContainer from './components/CommentPostContainer'

import { Toaster } from 'react-hot-toast';


function App() {
  const [user, setUser] = useState({})
  const [commentMode, setCommentMode] = useState("latest")

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
        <appContext.Provider value={{ commentMode, setCommentMode }}>
          <CommentPostContainer />
        </appContext.Provider>
        <Toaster />
      </>
    </userContext.Provider>
  )
}

export default App
