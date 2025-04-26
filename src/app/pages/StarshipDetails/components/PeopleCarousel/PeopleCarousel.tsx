import { useState, useEffect, useRef } from "react";
import commonStyles from "../common/Carousel.module.css";
import styles from "./PeopleCarousel.module.css";
import { usePeopleDetails } from "@/features/SpaceshipList/api/usePeopleDetails";

interface PeopleCarouselProps {
    peopleIds: string[];
}

const PeopleCarousel = ({ peopleIds }: PeopleCarouselProps) => {
    const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
    const [peoplePerPage, setPeoplePerPage] = useState(3);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    const peopleQueries = usePeopleDetails(peopleIds);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setPeoplePerPage(1);
            } else if (window.innerWidth <= 768) {
                setPeoplePerPage(2);
            } else {
                setPeoplePerPage(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextPerson = () => {
        setCurrentPersonIndex((prev) =>
            Math.min(prev + 1, peopleIds.length - peoplePerPage)
        );
    };

    const prevPerson = () => {
        setCurrentPersonIndex((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        setCurrentPersonIndex(0);
    }, [peoplePerPage]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - (trackRef.current?.offsetLeft || 0));
        setScrollLeft(currentPersonIndex);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (trackRef.current?.offsetLeft || 0));
        setScrollLeft(currentPersonIndex);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (trackRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        const newIndex = Math.round(
            scrollLeft -
                (walk / (trackRef.current?.offsetWidth || 1)) * peoplePerPage
        );
        setCurrentPersonIndex(
            Math.max(0, Math.min(newIndex, peopleIds.length - peoplePerPage))
        );
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - (trackRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        const newIndex = Math.round(
            scrollLeft -
                (walk / (trackRef.current?.offsetWidth || 1)) * peoplePerPage
        );
        setCurrentPersonIndex(
            Math.max(0, Math.min(newIndex, peopleIds.length - peoplePerPage))
        );
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    if (peopleIds.length === 0) return null;

    return (
        <div className={commonStyles.carouselContainer}>
            <h2 className={commonStyles.title}>Pilots & Crew</h2>
            <div className={commonStyles.carousel}>
                <button
                    className={commonStyles.carouselButton}
                    onClick={prevPerson}
                    disabled={currentPersonIndex === 0}
                >
                    ←
                </button>
                <div className={commonStyles.carouselContent}>
                    <div
                        ref={trackRef}
                        className={`${commonStyles.carouselTrack} ${
                            isDragging ? commonStyles.grabbing : ""
                        }`}
                        style={{
                            transform: `translateX(-${
                                currentPersonIndex * (100 / peoplePerPage)
                            }%)`,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleDragEnd}
                    >
                        {peopleIds.map((personId, index) => {
                            const query = peopleQueries[index];
                            const personName = query.data?.name || "Loading...";
                            const isLoading = query.isLoading;

                            return (
                                <div
                                    key={personId}
                                    className={commonStyles.carouselItem}
                                    style={{
                                        width: `${100 / peoplePerPage}%`,
                                    }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={
                                                new URL(
                                                    `../../../../../assets/images/people/${personId}.jpg`,
                                                    import.meta.url
                                                ).href
                                            }
                                            alt={personName}
                                            className={`${commonStyles.image} ${styles.image}`}
                                            draggable={false}
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.style.display = "none";
                                            }}
                                        />
                                        <div
                                            className={`${styles.personName} ${
                                                isLoading ? styles.loading : ""
                                            }`}
                                        >
                                            {personName}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button
                    className={commonStyles.carouselButton}
                    onClick={nextPerson}
                    disabled={
                        currentPersonIndex >= peopleIds.length - peoplePerPage
                    }
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default PeopleCarousel;
