import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./StarshipList.module.css";
import StarshipCard from "./StarshipCard/StarshipCard";
import { StarshipSummary } from "../types/starship";
import LoginPopup from "@/components/LoginPopup/LoginPopup";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const StarshipList = ({ starships }: { starships: StarshipSummary[] }) => {
    const navigate = useNavigate();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [selectedStarshipId, setSelectedStarshipId] = useState<string | null>(
        null
    );
    const [user] = useAuthState(auth);

    const handleStarshipClick = (url: string) => {
        const id = url.split("/").filter(Boolean).pop();
        if (!id) return;

        if (user) {
            navigate(`/starships/${id}`);
        } else {
            setSelectedStarshipId(id);
            setShowLoginPopup(true);
        }
    };

    // Only display 9 items
    const displayStarships = starships.slice(0, 9);

    return (
        <>
            <div className={styles.container}>
                {displayStarships.map((starship) => (
                    <StarshipCard
                        key={starship.url}
                        starship={starship}
                        onClick={() => handleStarshipClick(starship.url)}
                    />
                ))}
            </div>
            {showLoginPopup && (
                <LoginPopup
                    onClose={() => {
                        setShowLoginPopup(false);
                        setSelectedStarshipId(null);
                    }}
                    onLoginSuccess={() => {
                        if (selectedStarshipId) {
                            navigate(`/starships/${selectedStarshipId}`);
                            setSelectedStarshipId(null);
                        }
                    }}
                />
            )}
        </>
    );
};

export default StarshipList;
