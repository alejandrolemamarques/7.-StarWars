import { Starship } from "@/features/SpaceshipList/types/starship";
import styles from "./StarshipInfo.module.css";

interface StarshipInfoProps {
    data: Starship;
    imgSrc: string;
    onImageError: () => void;
}

const StarshipInfo = ({ data, imgSrc, onImageError }: StarshipInfoProps) => {
    return (
        <div className={styles.content}>
            <div className={styles.imageContainer}>
                <img
                    src={imgSrc}
                    alt={data.name}
                    className={styles.image}
                    onError={onImageError}
                />
            </div>
            <div className={styles.details}>
                <h2 className={styles.subtitle}>Technical Specifications</h2>
                <div className={styles.specs}>
                    <div className={styles.specRow}>
                        <span className={styles.label}>Model</span>
                        <span className={styles.value}>{data.model}</span>
                    </div>
                    <div className={styles.specRow}>
                        <span className={styles.label}>Manufacturer</span>
                        <span className={styles.value}>
                            {data.manufacturer}
                        </span>
                    </div>
                    <div className={styles.specRow}>
                        <span className={styles.label}>Cost</span>
                        <span className={styles.value}>
                            {data.cost_in_credits} credits
                        </span>
                    </div>
                    <div className={styles.specRow}>
                        <span className={styles.label}>Length</span>
                        <span className={styles.value}>{data.length}</span>
                    </div>
                    <div className={styles.specRow}>
                        <span className={styles.label}>Atmospheric Speed</span>
                        <span className={styles.value}>
                            {data.max_atmosphering_speed}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarshipInfo;
