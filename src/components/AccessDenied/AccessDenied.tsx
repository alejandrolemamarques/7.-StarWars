import { useNavigate } from "react-router-dom";
import styles from "./AccessDenied.module.css";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1>Access Denied</h1>
            <p>This page is only visible to logged in users</p>
            <div className={styles.buttons}>
                <button
                    className={styles.loginButton}
                    onClick={() => navigate("/starships")}
                >
                    Back to Starships
                </button>
            </div>
        </div>
    );
};

export default AccessDenied;
