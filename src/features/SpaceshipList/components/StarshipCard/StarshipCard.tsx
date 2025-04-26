import { StarshipSummary } from "../../types/starship";
import styles from "./StarshipCard.module.css";

interface StarshipCardProps {
    starship: StarshipSummary;
    onClick: () => void;
}

const StarshipCard = ({ starship, onClick }: StarshipCardProps) => {
    // Extract the ID from the URL (e.g., https://swapi.py4e.com/api/starships/2/)
    const id = starship.url.split("/").filter(Boolean).pop();
    const imagePath = new URL(
        `../../../../assets/images/spaceships/${id}.jpg`,
        import.meta.url
    ).href;
    const fallbackImage = new URL(
        `../../../../assets/images/spaceships/T-70.png`,
        import.meta.url
    ).href;

    return (
        <div className={styles.container} onClick={onClick}>
            <div className={styles.imageContainer}>
                <img
                    src={imagePath}
                    alt={starship.name}
                    className={styles.image}
                    onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                    }}
                />
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{starship.name}</h3>
                <p className={styles.model}>{starship.name.toLowerCase()}</p>
            </div>
        </div>
    );
};

export default StarshipCard;
