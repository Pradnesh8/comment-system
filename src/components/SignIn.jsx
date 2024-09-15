import { useContext } from "react";
import { signInWithGooglePopup } from "../utils/firebase.utils"
import userContext from "../utils/userContext";
import Profile from "./Profile";
const SignIn = () => {
    const { user, setUser } = useContext(userContext);
    // console.log("user value", userValue)
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
        setUser(response.user)
    }
    return (
        user?.displayName ? (
            <div className="profile">
                <Profile user={user} />
                <button className="logout-btn" onClick={() => setUser({})}>
                    logout
                </button>
            </div>
        ) :
            <div className="sign-in-btn">
                <button onClick={logGoogleUser}>Sign In With Google</button>
            </div>

    )
}
export default SignIn;