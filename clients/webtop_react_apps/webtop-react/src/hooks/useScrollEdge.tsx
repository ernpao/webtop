import { useEffect } from "react";

export type ScrollCallbacks = {
    onTop?: () => void;
    onBottom?: () => void;
};

export function useScrollEdge<T extends HTMLElement>(
    ref: React.RefObject<T>,
    { onTop, onBottom }: ScrollCallbacks
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;

            if (scrollTop <= 0 && onTop) {
                onTop();
            }

            // Allow a 1px margin of error for Chrome’s float rounding (i.e. Use a tolerance check instead of strict equality:)
            if (scrollTop + clientHeight >= scrollHeight - 1 && onBottom) {
                onBottom();
            }
        };

        el.addEventListener("scroll", handleScroll);
        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, [ref, onTop, onBottom]);
}
