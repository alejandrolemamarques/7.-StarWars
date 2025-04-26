import { useState, useEffect, useRef } from "react";
import commonStyles from "../common/Carousel.module.css";
import styles from "./FilmCarousel.module.css";

interface FilmCarouselProps {
    filmIds: string[];
}

const FilmCarousel = ({ filmIds }: FilmCarouselProps) => {
    const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
    const [filmsPerPage, setFilmsPerPage] = useState(3);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setFilmsPerPage(1);
            } else if (window.innerWidth <= 768) {
                setFilmsPerPage(2);
            } else {
                setFilmsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextFilm = () => {
        setCurrentFilmIndex((prev) =>
            Math.min(prev + 1, filmIds.length - filmsPerPage)
        );
    };

    const prevFilm = () => {
        setCurrentFilmIndex((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        setCurrentFilmIndex(0);
    }, [filmsPerPage]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - (trackRef.current?.offsetLeft || 0));
        setScrollLeft(currentFilmIndex);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (trackRef.current?.offsetLeft || 0));
        setScrollLeft(currentFilmIndex);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (trackRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        const newIndex = Math.round(
            scrollLeft -
                (walk / (trackRef.current?.offsetWidth || 1)) * filmsPerPage
        );
        setCurrentFilmIndex(
            Math.max(0, Math.min(newIndex, filmIds.length - filmsPerPage))
        );
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - (trackRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        const newIndex = Math.round(
            scrollLeft -
                (walk / (trackRef.current?.offsetWidth || 1)) * filmsPerPage
        );
        setCurrentFilmIndex(
            Math.max(0, Math.min(newIndex, filmIds.length - filmsPerPage))
        );
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    if (filmIds.length === 0) return null;

    return (
        <div className={commonStyles.carouselContainer}>
            <h2 className={commonStyles.title}>Appears in Films</h2>
            <div className={commonStyles.carousel}>
                <button
                    className={commonStyles.carouselButton}
                    onClick={prevFilm}
                    disabled={currentFilmIndex === 0}
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
                                currentFilmIndex * (100 / filmsPerPage)
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
                        {filmIds.map((filmId) => (
                            <div
                                key={filmId}
                                className={commonStyles.carouselItem}
                                style={{
                                    width: `${100 / filmsPerPage}%`,
                                }}
                            >
                                <img
                                    src={
                                        new URL(
                                            `../../../../../assets/images/films/${filmId}.jpeg`,
                                            import.meta.url
                                        ).href
                                    }
                                    alt={`Film ${filmId}`}
                                    className={`${commonStyles.image} ${styles.image}`}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className={commonStyles.carouselButton}
                    onClick={nextFilm}
                    disabled={currentFilmIndex >= filmIds.length - filmsPerPage}
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default FilmCarousel;
