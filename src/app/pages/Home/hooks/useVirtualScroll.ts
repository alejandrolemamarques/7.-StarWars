import { useState, useEffect, useRef, useCallback, RefObject } from "react";

// --- Constants --- (Moved from Home.tsx)
const LOGO_SCROLL_THRESHOLD = window.innerHeight * 0.6; // Pixels of scroll dedicated to logo fade/shrink
const INERTIA_DAMPING = 0.98; // Friction factor (closer to 1 = less friction)
const MIN_VELOCITY = 0.1; // Stop animation when velocity is low

// --- Custom Hook: useVirtualScroll ---
interface UseVirtualScrollProps {
    containerRef: RefObject<HTMLDivElement | null>;
    contentRef: RefObject<HTMLDivElement | null>;
}

export function useVirtualScroll({
    containerRef,
    contentRef,
}: UseVirtualScrollProps): number {
    const [virtualScrollTop, setVirtualScrollTop] = useState(0);

    // --- Touch & Inertia Refs ---
    const lastTouchY = useRef<number>(0);
    const touchVelocity = useRef<number>(0);
    const touchTimestamp = useRef<number>(0);
    const inertiaFrameId = useRef<number | null>(null);

    // --- Calculate Max Scroll ---
    const calculateMaxScroll = useCallback(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return 0;
        // Calculate total scrollable distance (logo shrink + text crawl)
        const textScrollableHeight = Math.max(
            0,
            content.offsetHeight - container.clientHeight
        );
        return LOGO_SCROLL_THRESHOLD + textScrollableHeight;
    }, [containerRef, contentRef]); // Depend on refs

    // --- Inertia Animation Step ---
    const inertiaStep = useCallback(() => {
        if (Math.abs(touchVelocity.current) < MIN_VELOCITY) {
            touchVelocity.current = 0;
            inertiaFrameId.current = null;
            return;
        }

        const maxScroll = calculateMaxScroll();
        setVirtualScrollTop((prevScrollTop) => {
            const newScroll = prevScrollTop + touchVelocity.current;
            return Math.max(0, Math.min(maxScroll, newScroll)); // Clamp
        });

        touchVelocity.current *= INERTIA_DAMPING; // Apply friction
        inertiaFrameId.current = requestAnimationFrame(inertiaStep);
    }, [calculateMaxScroll]);

    // --- Cancel Inertia ---
    const cancelInertia = useCallback(() => {
        if (inertiaFrameId.current) {
            cancelAnimationFrame(inertiaFrameId.current);
            inertiaFrameId.current = null;
        }
        touchVelocity.current = 0;
    }, []);

    // --- Event Listeners Effect ---
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // --- Wheel Event ---
        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            cancelInertia();
            const maxScroll = calculateMaxScroll();
            setVirtualScrollTop((prevScrollTop) =>
                Math.max(0, Math.min(maxScroll, prevScrollTop + event.deltaY))
            );
        };

        // --- Touch Events ---
        const handleTouchStart = (event: TouchEvent) => {
            cancelInertia();
            lastTouchY.current = event.touches[0].clientY;
            touchVelocity.current = 0;
            touchTimestamp.current = performance.now();
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            const currentTouchY = event.touches[0].clientY;
            const deltaY = lastTouchY.current - currentTouchY;
            const currentTime = performance.now();
            const deltaTime = currentTime - touchTimestamp.current;

            if (deltaTime > 0) {
                const currentVelocity = deltaY / deltaTime;
                touchVelocity.current = currentVelocity; // Use instantaneous velocity
            }

            const maxScroll = calculateMaxScroll();
            setVirtualScrollTop((prevScrollTop) =>
                Math.max(0, Math.min(maxScroll, prevScrollTop + deltaY))
            );

            lastTouchY.current = currentTouchY;
            touchTimestamp.current = currentTime;
        };

        const handleTouchEnd = () => {
            if (Math.abs(touchVelocity.current) > MIN_VELOCITY) {
                inertiaFrameId.current = requestAnimationFrame(inertiaStep);
            } else {
                touchVelocity.current = 0;
            }
        };

        // Add Listeners
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        container.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        container.addEventListener("touchend", handleTouchEnd, {
            passive: true,
        });
        container.addEventListener("touchcancel", handleTouchEnd, {
            passive: true,
        });

        // Cleanup
        return () => {
            cancelInertia();
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            container.removeEventListener("touchcancel", handleTouchEnd);
        };
    }, [containerRef, calculateMaxScroll, cancelInertia, inertiaStep]); // Add necessary dependencies

    return virtualScrollTop;
}
