import { useContext, useEffect } from "react";
import { auth, logoutUser, signInWithGooglePopup } from "../utils/firebase.utils"
import userContext from "../utils/userContext";
import Profile from "./Profile";
import toast from 'react-hot-toast';
import { onAuthStateChanged } from "firebase/auth";
const Signin = () => {
    const { user, setUser } = useContext(userContext);

    // console.log("user value", userValue)
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        // console.log(response);
        setUser(response.user)
    }
    const logout = async () => {
        const isLoggedOut = await logoutUser()
        if (isLoggedOut) {
            setUser({})
            toast('Logged out')
        }
        else toast('Error while loggin out, please try again')
    }
    useEffect(() => {
        // Listen for authentication state changes and keep the user signed in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log("User is signed in:", user);
                setUser(user)
                // Handle the signed-in user's information here
            } else {
                console.log("No user is signed in");
                setUser({})
                // Handle the case where no user is signed in
            }
        });
    }, [])
    return (
        user?.displayName ? (
            <div className="profile">
                <Profile user={user} />
                <button className="logout-btn" onClick={logout}>
                    logout
                </button>
                {/* <Toaster /> */}
            </div>
        ) :
            <div className="sign-in-btn">
                <button onClick={logGoogleUser}>Sign In With Google</button>
            </div>

    )
}
export default Signin;