// Imports
import { Link } from "react-router-dom";
import styles from "./SignIn.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signInAsync } from "../../Redux/Reducer/userReducer";

// Functional component for the signin
export default function Login(){
        // Creating state
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const dispatch = useDispatch();

    // Calling Sign In
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        dispatch(signInAsync({email, password})) // Trigger signin logic dispatching action here
        setEmail("");
        setPassword("");
    };

    // Returning JSX
    return(
        <div className={styles.signInContainer}>
            {/* Sign In form */}
            <form className={styles.signinForm} onSubmit={handleSubmit}>
            <h1 className={styles.heading}>Sign In</h1>
                <input value={email} type="email" required={true} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)}/>
                <input value={password} type="password" required={true} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" className={styles.signinBtn}>Sign In</button>
                {/* Routing to the sign up page */}
                <Link to="/signUp" className={styles.signUpLink}>
                <p>Or SignUp instead</p>
                </Link>
            </form>

        </div>
    )
}