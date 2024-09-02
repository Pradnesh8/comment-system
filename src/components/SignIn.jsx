import { useContext } from "react";
import { signInWithGooglePopup } from "../utils/firebase.utils"
import userContext from "../utils/userContext";
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
            <div>User logged in as {user?.displayName}</div>
        ) :
            <div>
                <button onClick={logGoogleUser}>Sign In With Google</button>
            </div>

    )
}
export default SignIn;