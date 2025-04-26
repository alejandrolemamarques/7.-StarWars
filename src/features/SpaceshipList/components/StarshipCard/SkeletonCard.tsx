import cardStyles from "./StarshipCard.module.css";
import styles from "./SkeletonCard.module.css";

const SkeletonCard = () => {
    return (
        <div className={`${cardStyles.container} ${styles.skeleton}`}>
            <div className={cardStyles.imageContainer}>
                <div className={styles.imageSkeleton} />
            </div>
            <div className={cardStyles.info}>
                <div className={styles.nameSkeleton} />
                <div className={styles.modelSkeleton} />
            </div>
        </div>
    );
};

export default SkeletonCard;
