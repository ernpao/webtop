import { useEffect } from "react";

export default function useKeyPress(targetKey: string, blockOnInputFields: boolean = true, callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const el = document.activeElement;

            // skip if user is typing in any text-like field
            const block =
                (el?.tagName === "INPUT" && ["text", "email", "search", "password", "number"].includes((el as HTMLInputElement).type)) ||
                (el?.tagName === "TEXTAREA") ||
                (el instanceof HTMLElement && el.isContentEditable);

            if (blockOnInputFields && block) return;

            if (e.key === targetKey || e.key === targetKey.toLowerCase()) {
                callback(e);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [targetKey, callback]);
}

interface KeyCombo {
    key: string;           // e.g., "s"
    ctrl?: boolean;        // default false
    meta?: boolean;        // default false (Cmd on Mac)
    shift?: boolean;       // optional
    alt?: boolean;         // optional
}

export function useKeyCombo(combo: KeyCombo, callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {

            // // Skip if typing in text fields
            // const el = document.activeElement;
            // const block =
            //     (el?.tagName === "INPUT" && ["text", "email", "search", "password", "number"].includes((el as HTMLInputElement).type)) ||
            //     (el?.tagName === "TEXTAREA") ||
            //     (el instanceof HTMLElement && el.isContentEditable);

            // if (block) return;

            if (
                e.key.toLowerCase() === combo.key.toLowerCase() &&
                (!!combo.ctrl === e.ctrlKey) &&
                (!!combo.meta === e.metaKey) &&
                (!!combo.shift === e.shiftKey) &&
                (!!combo.alt === e.altKey)
            ) {
                e.preventDefault(); // prevent default browser action (e.g., save dialog)
                callback(e);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [combo, callback]);
}