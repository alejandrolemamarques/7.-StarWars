import { useState, useEffect } from "react";

interface WindowSize {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 480,
        isTablet: window.innerWidth > 480 && window.innerWidth <= 768,
        isDesktop: window.innerWidth > 768,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth <= 480,
                isTablet: window.innerWidth > 480 && window.innerWidth <= 768,
                isDesktop: window.innerWidth > 768,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowSize;
};
