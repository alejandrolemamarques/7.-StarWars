import { useNavigate } from "react-router-dom";
import styles from "./LoadingSkeleton.module.css";

const LoadingSkeleton = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button
                className={styles.backBtn}
                onClick={() => navigate("/starships")}
            >
                ← Back to Starships
            </button>
            <div className={styles.titleSkeleton} />
            <div className={styles.content}>
                <div className={styles.imageSkeleton} />
                <div className={styles.detailsSkeleton}>
                    <div
                        className={styles.lineSkeleton}
                        style={{ width: "60%" }}
                    />
                    <div
                        className={styles.lineSkeleton}
                        style={{ width: "80%" }}
                    />
                    <div
                        className={styles.lineSkeleton}
                        style={{ width: "50%" }}
                    />
                    <div
                        className={styles.lineSkeleton}
                        style={{ width: "70%" }}
                    />
                    <div
                        className={styles.lineSkeleton}
                        style={{ width: "40%" }}
                    />
                </div>
            </div>
            {/* Films section skeleton */}
            <div className={styles.filmsSection}>
                <div className={styles.subtitleSkeleton} />
                <div className={styles.filmsSkeleton}>
                    <div className={styles.filmCardSkeleton} />
                    <div className={styles.filmCardSkeleton} />
                    <div className={styles.filmCardSkeleton} />
                </div>
            </div>
            {/* People section skeleton */}
            <div className={styles.filmsSection}>
                <div className={styles.subtitleSkeleton} />
                <div className={styles.filmsSkeleton}>
                    <div className={styles.filmCardSkeleton} />
                    <div className={styles.filmCardSkeleton} />
                    <div className={styles.filmCardSkeleton} />
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
