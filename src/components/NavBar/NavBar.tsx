import styles from "./NavBar.module.css";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/images/star-wars-logo-crop.webp";
import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useState } from "react";
import LoginPopup from "@/components/LoginPopup/LoginPopup";

interface NavBarProps {
    user: User | null;
}

const NavBar = ({ user }: NavBarProps) => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Helper function to determine the className for NavLink
    const getNavLinkClassName = ({
        isActive,
    }: {
        isActive: boolean;
    }): string => {
        return isActive ? styles.active : "";
    };

    return (
        <>
            <div className={styles.container}>
                <Link to="/">
                    <img
                        className={styles.logo}
                        src={logo}
                        alt="Star Wars Logo"
                    />
                </Link>
                <div className={styles.links}>
                    <div className={styles.navLinks}>
                        <NavLink to="/" className={getNavLinkClassName}>
                            HOME
                        </NavLink>
                        <NavLink
                            to="/starships"
                            className={getNavLinkClassName}
                        >
                            STARSHIPS
                        </NavLink>
                    </div>
                    <div className={styles.authSection}>
                        {user && (
                            <span className={styles.welcomeMessage}>
                                Welcome, {user.displayName}!
                            </span>
                        )}
                        <button
                            className={styles.authButton}
                            onClick={
                                user
                                    ? handleLogout
                                    : () => setShowLoginPopup(true)
                            }
                        >
                            {user ? "LOG OUT" : "LOG IN"}
                        </button>
                    </div>
                </div>
            </div>
            {showLoginPopup && (
                <LoginPopup
                    onClose={() => setShowLoginPopup(false)}
                    onLoginSuccess={() => {}}
                />
            )}
        </>
    );
};

export default NavBar;
