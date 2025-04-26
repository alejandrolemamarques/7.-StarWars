import styles from "./app.module.css";
import NavBar from "@/components/NavBar/NavBar";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import StarshipsList from "./pages/Starships/Starships";
import StarshipDetails from "./pages/StarshipDetails/StarshipDetails";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
    const [user, loading] = useAuthState(auth);

    return (
        <Router>
            <div className={styles.appContainer}>
                <NavBar user={user ?? null} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/starships" element={<StarshipsList />} />
                    <Route
                        path="/starships/:id"
                        element={
                            <StarshipDetails
                                user={user ?? null}
                                isAuthLoading={loading}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
