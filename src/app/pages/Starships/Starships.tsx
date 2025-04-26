import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./Starships.module.css";
import StarshipList from "@/features/SpaceshipList/components/StarshipList";
import SkeletonCard from "@/features/SpaceshipList/components/StarshipCard/SkeletonCard";
import {
    useStarships,
    fetchStarships,
} from "@/features/SpaceshipList/api/useStarships";
import { StarshipResponse } from "@/features/SpaceshipList/types/starship";

const NavigationButtons = ({
    currentPage,
    hasNextPage,
    hasPrevPage,
    onPrevPage,
    onNextPage,
}: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
}) => (
    <div className={styles.navigation}>
        <button onClick={onPrevPage} disabled={!hasPrevPage}>
            ←
        </button>
        <span>Page {currentPage}</span>
        <button onClick={onNextPage} disabled={!hasNextPage}>
            →
        </button>
    </div>
);

const Starships = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(initialPage);
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useStarships(currentPage);

    // Update URL when page changes
    useEffect(() => {
        setSearchParams({ page: currentPage.toString() });
    }, [currentPage, setSearchParams]);

    // Prefetch next page data
    useEffect(() => {
        if (!isLoading && data?.next) {
            const nextPage = currentPage + 1;
            queryClient.prefetchQuery({
                queryKey: ["starships", nextPage],
                queryFn: () => fetchStarships(nextPage),
            });
        }
    }, [data, isLoading, currentPage, queryClient]);

    // Preload next page images
    useEffect(() => {
        const preloadLinks: HTMLLinkElement[] = [];
        if (!isLoading && data?.next) {
            const nextPage = currentPage + 1;
            // Try to get data from cache
            const nextPageData = queryClient.getQueryData<StarshipResponse>([
                "starships",
                nextPage,
            ]);

            if (nextPageData) {
                nextPageData.results.forEach((starship) => {
                    const id = starship.url.split("/").filter(Boolean).pop();
                    if (id) {
                        const imageUrl = new URL(
                            `../../../assets/images/spaceships/${id}.jpg`,
                            import.meta.url
                        ).href;
                        const link = document.createElement("link");
                        link.rel = "preload";
                        link.as = "image";
                        link.href = imageUrl;
                        document.head.appendChild(link);
                        preloadLinks.push(link);
                    }
                });
            }
        }

        // Cleanup: remove preload links when component unmounts or dependencies change
        return () => {
            preloadLinks.forEach((link) => document.head.removeChild(link));
        };
    }, [data, isLoading, currentPage, queryClient]);

    const handlePrevPage = () =>
        setCurrentPage((prev) => Math.max(1, prev - 1));
    const handleNextPage = () => {
        if (data?.next) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Starships</h1>
                    <div className={styles.navigation}>
                        <button disabled>←</button>
                        <span>Loading...</span>
                        <button disabled>→</button>
                    </div>
                </div>
                <div className={styles.list}>
                    {[...Array(9)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
                <div className={styles.bottomNavigation}>
                    <div className={styles.navigation}>
                        <button disabled>←</button>
                        <span>Page ...</span>
                        <button disabled>→</button>
                    </div>
                </div>
            </div>
        );
    }

    if (error)
        return <div className={styles.container}>Error: {error.message}</div>;

    if (!data) return <div className={styles.container}>No data available</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Starships</h1>
                <NavigationButtons
                    currentPage={currentPage}
                    hasNextPage={!!data.next}
                    hasPrevPage={!!data.previous}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                />
            </div>

            <StarshipList starships={data.results} />

            <div className={styles.bottomNavigation}>
                <NavigationButtons
                    currentPage={currentPage}
                    hasNextPage={!!data.next}
                    hasPrevPage={!!data.previous}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                />
            </div>
        </div>
    );
};

export default Starships;
