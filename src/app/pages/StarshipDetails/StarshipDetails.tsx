import { useParams, useNavigate } from "react-router-dom";
import { useStarshipDetails } from "@/features/SpaceshipList/api/useStarshipDetails";
import styles from "./StarshipDetails.module.css";
import { useState, useEffect } from "react";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { User } from "firebase/auth";
import StarshipInfo from "./components/StarshipInfo/StarshipInfo";
import FilmCarousel from "./components/FilmCarousel/FilmCarousel";
import PeopleCarousel from "./components/PeopleCarousel/PeopleCarousel";
import LoadingSkeleton from "./components/LoadingSkeleton/LoadingSkeleton";

interface StarshipDetailsProps {
    user: User | null;
    isAuthLoading?: boolean;
}

const StarshipDetails = ({
    user,
    isAuthLoading = false,
}: StarshipDetailsProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useStarshipDetails(
        id ? `https://swapi.py4e.com/api/starships/${id}/` : ""
    );

    const imagePath = new URL(
        `../../../assets/images/spaceships/${id}.jpg`,
        import.meta.url
    ).href;
    const fallbackImage = new URL(
        `../../../assets/images/spaceships/T-70.png`,
        import.meta.url
    ).href;
    const [imgSrc, setImgSrc] = useState(imagePath);

    // Extract film IDs from the film URLs
    const filmIds =
        data?.films
            ?.map((filmUrl: string) => {
                const match = filmUrl.match(/\/(\d+)\/$/);
                return match ? match[1] : null;
            })
            .filter((id): id is string => id !== null) || [];

    // Extract pilot IDs from the pilot URLs
    const pilotIds =
        data?.pilots
            ?.map((pilotUrl: string) => {
                const match = pilotUrl.match(/\/(\d+)\/$/);
                return match ? match[1] : null;
            })
            .filter((id): id is string => id !== null) || [];

    // Handle invalid id
    useEffect(() => {
        if (
            error &&
            (error.message.includes("404") ||
                error.message.includes("not found"))
        ) {
            navigate("/starships", { replace: true });
        }
    }, [error, navigate]);

    // Update image source when id changes
    useEffect(() => {
        setImgSrc(imagePath);
    }, [imagePath]);

    // Show loading skeleton while auth is being checked
    if (isAuthLoading) {
        return <LoadingSkeleton />;
    }

    // If user is not authenticated, show AccessDenied
    if (!user) {
        return <AccessDenied />;
    }

    // Show loading skeleton while data is being fetched
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <button
                    className={styles.backBtn}
                    onClick={() => navigate("/starships")}
                >
                    ← Back to Starships
                </button>
                <div className={styles.error}>Error: {error.message}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className={styles.container}>
                <button
                    className={styles.backBtn}
                    onClick={() => navigate("/starships")}
                >
                    ← Back to Starships
                </button>
                <div className={styles.error}>No data available</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button
                className={styles.backBtn}
                onClick={() => navigate("/starships")}
            >
                ← Back to Starships
            </button>
            <h1 className={styles.title}>{data.name}</h1>
            <StarshipInfo
                data={data}
                imgSrc={imgSrc}
                onImageError={() => setImgSrc(fallbackImage)}
            />
            <FilmCarousel filmIds={filmIds} />
            <PeopleCarousel peopleIds={pilotIds} />
        </div>
    );
};

export default StarshipDetails;
