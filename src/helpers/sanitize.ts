import DOMPurify from 'dompurify';

// allow all safe HTML elements but neither SVG nor MathML
// note that the USE_PROFILES setting will override the ALLOWED_TAGS setting
// so don't use them together
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
}

// allow all safe SVG elements and SVG Filters, no HTML or MathML
export function sanitizeSvg(dirty: string): string {
    return DOMPurify.sanitize(dirty, { USE_PROFILES: { svg: true, svgFilters: true } });
}
