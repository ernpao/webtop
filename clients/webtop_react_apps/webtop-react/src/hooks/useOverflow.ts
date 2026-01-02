import { useEffect, useRef, useState } from 'react';

export function useOverflow<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [overflowX, setOverflowX] = useState(false);
    const [overflowY, setOverflowY] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const checkOverflow = () => {
            setOverflowX(element.scrollWidth > element.clientWidth);
            setOverflowY(element.scrollHeight > element.clientHeight);
        };

        checkOverflow(); // Initial check

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(element);

        const mutationObserver = new MutationObserver(checkOverflow);
        mutationObserver.observe(element, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return { ref, overflowX, overflowY };
}
