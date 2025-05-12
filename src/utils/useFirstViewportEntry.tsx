import { useEffect, useRef, useState } from "react"

/**
 * Reference: https://medium.com/@pal.amittras/lazy-loading-react-components-on-page-scroll-using-intersection-observer-api-hook-and-wrapper-1a81e4cf1325
 */
const useFirstViewportEntry = (ref, observerOptions: IntersectionObserverInit) => {

    const [entered, setEntered] = useState(false);
    const observerRef = useRef(
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entered) {
                    setEntered(true);
                }
            });
        }, observerOptions)
    );

    useEffect(() => {

        const element = ref.current;
        const observer = observerRef.current;

        // stop observing once the element has entered the viewport for the first time
        if (entered) {
            observer.unobserve(element);
            return;
        }

        if (element && !entered) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        }

    }, [entered, ref]);

    return entered;

}

export default useFirstViewportEntry;