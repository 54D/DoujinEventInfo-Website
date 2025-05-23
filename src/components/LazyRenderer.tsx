import useFirstViewportEntry from "@utils/useFirstViewportEntry";
import { PropsWithChildren, Suspense, useRef } from "react";

function LazyRenderer({
    children,
    root = null,
    rootMargin = "0px",
    threshold = 0,
    fallback = null,
    ...props
}: PropsWithChildren & IntersectionObserverInit & {
    fallback?: React.ReactNode;
}) {
    
    const ref = useRef<HTMLDivElement>(null);
    const entered = useFirstViewportEntry(ref, { root, rootMargin, threshold });

    return (
        <div
            ref={ref}
            {...props}
        >
            {entered && <Suspense fallback={fallback}>{children}</Suspense>}
        </div>
    );

}

export default LazyRenderer;