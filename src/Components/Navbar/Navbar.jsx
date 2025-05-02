import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync, userSelector, verifyUserSignIn } from "../../Redux/Reducer/userReducer";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { isSignIn } = useSelector(userSelector);
    const dispatch = useDispatch();
    const auth = getAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(verifyUserSignIn({ user: user.uid, signIn: true }));
            } else {
                dispatch(verifyUserSignIn({ user: null, signIn: false }));
            }
        });

        return () => unsubscribe();
    }, [auth, dispatch]);

    useEffect(() => {
        if (isSignIn) {
            navigate("/");
        }
    }, [isSignIn, navigate]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <div className={styles.navbarContainer}>
                {/* Left side of nav */}
                <div className={styles.left}>
                    <NavLink to="/" className={styles.navLink}>
                        <h3>Busy Buy</h3>
                    </NavLink>
                </div>

                {/* Hamburger menu for mobile */}
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                {/* Right side of nav */}
                <ul className={`${styles.right} ${menuOpen ? styles.active : ""}`}>
                    <li>
                        <NavLink to="/" className={styles.navLink}>
                            <img src="https://cdn-icons-png.flaticon.com/128/609/609803.png" alt="Home" />
                            <h3>Home</h3>
                        </NavLink>
                    </li>

                    {isSignIn && (
                        <>
                            <li>
                                <NavLink to="/orders" className={styles.navLink}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/6815/6815043.png" alt="My Orders" />
                                    <h3>My Orders</h3>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/cart" className={styles.navLink}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/891/891407.png" alt="Cart" />
                                    <h3>Cart</h3>
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li>
                        <NavLink
                            to="/signIn"
                            className={styles.navLink}
                            onClick={() => (isSignIn ? dispatch(logoutAsync()) : null)}
                        >
                            <img
                                src={
                                    isSignIn
                                        ? "https://cdn-icons-png.flaticon.com/128/1828/1828490.png"
                                        : "https://cdn-icons-png.flaticon.com/128/2574/2574000.png"
                                }
                                alt="SignIn"
                            />
                            <h3>{isSignIn ? "Logout" : "SignIn"}</h3>
                        </NavLink>
                    </li>
                </ul>
            </div>

            <Outlet />
        </>
    );
}