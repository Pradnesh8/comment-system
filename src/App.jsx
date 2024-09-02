import { useState } from 'react'
import './App.css'
import SignIn from './components/Signin'
import userContext from './utils/userContext'

function App() {
  const [user, setUser] = useState({})
  return (
    <userContext.Provider value={{ user, setUser }}>
      <SignIn />
    </userContext.Provider>
  )
}

export default App
