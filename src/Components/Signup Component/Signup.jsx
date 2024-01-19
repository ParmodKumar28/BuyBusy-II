// Imports
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./SignUp.module.css";
import { signUpAsync } from "../../Redux/Reducer/userReducer";

// Functional component for the signUp
export default function Register(){
    // Creating state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    // Calling signup
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        dispatch(signUpAsync({name, email, password})); // Trigger signup logic dispatching action here
        setName("");
        setEmail("");
        setPassword("");
    };

    // Returning JSX
    return(
        <div className={styles.signUpContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
            <h1 className={styles.heading}>Sign Up</h1>
                <input value={name} type="text" required={true} placeholder="Enter Name" onChange={(e) => setName(e.target.value)}/>
                <input value={email} type="email" required={true} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)}/>
                <input value={password} type="password" required={true} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit"  className={styles.signupBtn}>Sign Up</button>
            </form>
        </div>
    )
}