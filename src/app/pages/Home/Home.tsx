import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import starWarsLogo from "@/assets/images/star-wars-logo-yellow.svg";
import { useVirtualScroll } from "./hooks/useVirtualScroll";
import { useWindowSize } from "@/hooks/useWindowSize";

// --- Constants --- (Keep only those not moved to the hook)
const LOGO_FINAL_SCALE = 0.1; // Scale logo down to 10%
const TEXT_START_FRACTION = 0.5; // Start text scroll when logo is 50% through its animation
const TEXT_SCROLL_MULTIPLIER = 1; // Multiplier for text scroll speed relative to its height
const BASE_ROTATE_X = 55; // Keep rotation consistent
// Moved to useVirtualScroll: LOGO_SCROLL_THRESHOLD, INERTIA_DAMPING, MIN_VELOCITY
// -----------------

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const { isMobile, isTablet } = useWindowSize();

    // Use the custom hook to get scroll position
    const virtualScrollTop = useVirtualScroll({ containerRef, contentRef });

    // --- Effect for updating styles based on virtualScrollTop (Keep this) ---
    useEffect(() => {
        const logo = logoRef.current;
        const content = contentRef.current;
        const container = containerRef.current;
        const buttonContainer = buttonRef.current;
        const arrow = arrowRef.current;

        if (!logo || !content || !container || !buttonContainer || !arrow)
            return;

        // Calculate LOGO_SCROLL_THRESHOLD here for use in calculations
        // Note: It might be better to pass this from the hook if needed elsewhere,
        // or recalculate window.innerHeight if needed, but let's keep it simple for now.
        const LOGO_SCROLL_THRESHOLD = window.innerHeight * 0.6;

        // --- Logo Logic ---
        const logoProgress = Math.min(
            1,
            virtualScrollTop / LOGO_SCROLL_THRESHOLD
        );
        const currentLogoScale = 1 - logoProgress * (1 - LOGO_FINAL_SCALE);
        const currentLogoOpacity = 1 - logoProgress;

        logo.style.opacity = `${currentLogoOpacity}`;
        logo.style.transform = `scale(${currentLogoScale})`;
        logo.style.pointerEvents = logoProgress >= 1 ? "none" : "auto";

        // --- Arrow Logic ---
        arrow.style.opacity = virtualScrollTop > 0 ? "0" : "1";
        arrow.style.pointerEvents = virtualScrollTop > 0 ? "none" : "auto";

        // --- Text Crawl Logic ---
        const textStartScroll = LOGO_SCROLL_THRESHOLD * TEXT_START_FRACTION;

        const maxTextScroll = Math.max(
            0,
            content.offsetHeight - container.clientHeight
        );
        // Avoid division by zero if maxTextScroll is 0
        const scrollableHeightForText = maxTextScroll === 0 ? 1 : maxTextScroll;

        const currentTextScrollInput = Math.max(
            0,
            virtualScrollTop - textStartScroll
        );

        // Ensure textScrollFraction doesn't exceed 1
        const textScrollFraction = Math.min(
            1,
            currentTextScrollInput / scrollableHeightForText
        );

        const translateY =
            -textScrollFraction * content.offsetHeight * TEXT_SCROLL_MULTIPLIER;

        content.style.transform = `rotateX(${BASE_ROTATE_X}deg) translateY(${translateY}px)`;

        // --- Button Logic ---
        // Recalculate approxMaxScroll based on LOGO_SCROLL_THRESHOLD and maxTextScroll
        const approxMaxScroll = LOGO_SCROLL_THRESHOLD + maxTextScroll;

        const getButtonThreshold = () => {
            if (isMobile) return approxMaxScroll * 0.78; // Later on mobile
            if (isTablet) return approxMaxScroll * 0.78; // Slightly later on tablet
            return approxMaxScroll * 0.72; // Default desktop threshold
        };

        const buttonAppearThreshold = getButtonThreshold();

        const showButton = virtualScrollTop >= buttonAppearThreshold;

        if (showButton) {
            buttonContainer.classList.add(styles.visible);
        } else {
            buttonContainer.classList.remove(styles.visible);
        }
    }, [virtualScrollTop, isMobile, isTablet]); // Dependency is now only virtualScrollTop from the hook

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={logoRef} className={styles.logoContainer}>
                <img
                    src={starWarsLogo}
                    alt="Star Wars Logo"
                    className={styles.logoImageScroll}
                />
                <div ref={arrowRef} className={styles.scrollArrow}></div>
            </div>
            <div ref={contentRef} className={styles.crawlContent}>
                <h1>Episode IV: A New Scope</h1>
                <p>
                    It is a period of intense coding. Junior Developers,
                    striking from their home keyboards, have won their first
                    victory against the dreaded Infinite Loop.
                </p>
                <p>
                    During the battle, Rebel coders managed to steal secret
                    plans to the Empire's ultimate weapon, the CALLBACK HELL, an
                    asynchronous maze with enough nesting to confuse an entire
                    galaxy.
                </p>
                <p>
                    Pursued by the Empire's sinister agents, Princess State
                    races home aboard her starship, the `useEffect Hook`,
                    custodian of the stolen plans that can save her people and
                    restore freedom to the Application...
                </p>
                <p>
                    Meanwhile, on the desolate server of Stack Overflow, Obi-Wan
                    Kenobi (also known as "Senior Dev") attempts to guide young
                    Skywalker through the treacherous forests of CSS Centering,
                    warning him of the dark side of '!important'.
                </p>
                <p>
                    Hope flickers as rumors spread of a legendary artifact, the
                    REDUX TOOLKIT, said to bring order to the chaos of global
                    state management and unite the fragmented components against
                    the tyranny of Prop Drilling...
                </p>
                <p>
                    The Galactic Console, however, remains vigilant, spitting
                    cryptic error messages like blaster fire, forcing our heroes
                    to decipher stack traces that seem written in an ancient,
                    forgotten dialect.
                </p>
                <p>
                    Little do they know that the Dark Lord of the Sith, Darth
                    Browser Compatibility, plots to shatter their carefully
                    crafted layouts across the fragmented systems of Internet
                    Explorer and Safari...
                </p>
            </div>

            <div ref={buttonRef} className={styles.endButtonContainer}>
                <Link to="/starships" className={styles.endButtonLink}>
                    <button className={styles.endButton}>
                        Explore the Fleet
                    </button>
                </Link>
            </div>
        </div>
    );
}
