import React, { useMemo } from "react";

type SafeHtmlProps = {
    html: string;
    className?: string;
    // toggle removal of inline styles (styles can be abused via CSS-based attacks)
    removeStyles?: boolean;
};

/**
 * Basic HTML sanitizer (no external libs)
 * - Removes dangerous tags: script, iframe, object, embed, style, link, meta, form
 * - Removes attributes that start with "on" (event handlers)
 * - Removes attributes with javascript: or vbscript: URIs
 * - Optionally strips inline `style` attributes
 *
 * Not bulletproof — good for untrusted-but-not-hostile HTML. Use DOMPurify for strong guarantees.
 */
function sanitizeHtml(input: string, removeStyles = true): string {
    if (!input) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const forbiddenTags = new Set([
        "script",
        "iframe",
        "object",
        "embed",
        "link",
        "meta",
        "style",
        "form",
        "input",
        "button",
        "textarea",
        "select",
    ]);

    const walk = (node: Node) => {
        if (!node) return;

        // If element node, check tag and attributes
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            const tag = el.tagName.toLowerCase();

            // remove forbidden elements entirely
            if (forbiddenTags.has(tag)) {
                el.remove();
                return; // removed -> stop processing children
            }

            // remove dangerous attributes
            const attrs = Array.from(el.attributes);
            for (const attr of attrs) {
                const name = attr.name.toLowerCase();
                const value = attr.value;

                // remove event handlers like onclick, onerror, etc.
                if (name.startsWith("on")) {
                    el.removeAttribute(attr.name);
                    continue;
                }

                // remove inline style if requested
                if (removeStyles && name === "style") {
                    el.removeAttribute(attr.name);
                    continue;
                }

                // schemes to block in URLs
                const blockedScheme = /^\s*(javascript|vbscript|data):/i;
                if (
                    (name === "href" || name === "src" || name === "xlink:href") &&
                    blockedScheme.test(value)
                ) {
                    el.removeAttribute(attr.name);
                    continue;
                }

                // you may also strip other attributes here if needed
            }
        }

        // recurse on children (use Array.from to freeze live childList)
        const children = Array.from(node.childNodes);
        for (const child of children) {
            walk(child);
        }
    };

    walk(doc.body);

    return doc.body.innerHTML;
}

export default function SafeHtml({ html, className, removeStyles = true }: SafeHtmlProps) {
    const sanitized = useMemo(() => sanitizeHtml(html, removeStyles), [html, removeStyles]);

    return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
