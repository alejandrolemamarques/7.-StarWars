import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import styles from "./LoginPopup.module.css";
import { useEffect } from "react";
import { FirebaseError } from "firebase/app";

interface LoginPopupProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginPopup = ({ onClose, onLoginSuccess }: LoginPopupProps) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account",
        });
        try {
            await signInWithPopup(auth, provider);
            onLoginSuccess();
            onClose();
        } catch (error: unknown) {
            // Fallback for mobile or environments where popup is blocked/unsupported
            if (
                error instanceof FirebaseError &&
                (error.code ===
                    "auth/operation-not-supported-in-this-environment" ||
                    error.code === "auth/popup-blocked" ||
                    error.code === "auth/popup-closed-by-user")
            ) {
                try {
                    await signInWithRedirect(auth, provider);
                    // After redirect, auth state change will trigger onLoginSuccess elsewhere
                } catch (redirectError) {
                    console.error(
                        "Error signing in with redirect:",
                        redirectError
                    );
                }
            } else {
                console.error("Error signing in:", error);
            }
        }
    };

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.popup}>
                <h2>Sign In Required</h2>
                <p>Please sign in to view starship details</p>
                <div className={styles.buttons}>
                    <button
                        className={styles.loginButton}
                        onClick={handleLogin}
                    >
                        Sign in with Google
                    </button>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;
