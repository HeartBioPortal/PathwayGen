/** Provides ARIA functions for accessibility purposes, like screen readers */

function getNodeAriaLabel(nodeData) {
    if (!nodeData) return "Pathway element";
    const prettyName = nodeData.label || nodeData.name || nodeData.id || "Unknown element";
    const type = nodeData.type ? ` (${nodeData.type})` : "";
    return `${prettyName}${type}`;
}

/**
 * Return ARIA attributes as a string to insert into an SVG element
 */
function getAriaAttributesString({ label, description, focusable = true } = {}) {
    let attrs = '';
    if (label) attrs += ` aria-label="${label}"`;
    if (description) attrs += ` aria-description="${description}"`;
    if (focusable) {
        attrs += ' tabindex="0" role="group"';
    }
    return attrs;
}

/**
 * Return <title> element as a string to insert into an SVG element
 */
function getSvgTitleString(text) {
    if (!text) return '';
    return `<title>${text}</title>`;
}

// Export functions
module.exports = {
    getNodeAriaLabel,
    getAriaAttributesString,
    getSvgTitleString
};
