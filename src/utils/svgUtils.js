/**
 * SVG utilities for pathway visualizations
 */

const svgUtils = {
    /**
     * Create an SVG element with attributes
     * @param {string} tagName - SVG tag name
     * @param {Object} attrs - Element attributes
     * @returns {string} SVG element markup
     */
    createElement(tagName, attrs = {}) {
      const attrsString = Object.keys(attrs)
        .map(key => `${key}="${attrs[key]}"`)
        .join(' ');
      
      return `<${tagName} ${attrsString}/>`;
    },
  
    /**
     * Create an SVG element with content
     * @param {string} tagName - SVG tag name
     * @param {Object} attrs - Element attributes
     * @param {string} content - Element content
     * @returns {string} SVG element markup
     */
    createElementWithContent(tagName, attrs = {}, content = '') {
      const attrsString = Object.keys(attrs)
        .map(key => `${key}="${attrs[key]}"`)
        .join(' ');
      
      return `<${tagName} ${attrsString}>${content}</${tagName}>`;
    },
  
    /**
     * Create an SVG path element
     * @param {string} pathData - Path data (d attribute)
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG path markup
     */
    createPath(pathData, attrs = {}) {
      return this.createElement('path', {
        d: pathData,
        ...attrs
      });
    },
  
    /**
     * Create an SVG circle element
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} r - Radius
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG circle markup
     */
    createCircle(cx, cy, r, attrs = {}) {
      return this.createElement('circle', {
        cx,
        cy,
        r,
        ...attrs
      });
    },
  
    /**
     * Create an SVG rectangle element
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG rectangle markup
     */
    createRect(x, y, width, height, attrs = {}) {
      return this.createElement('rect', {
        x,
        y,
        width,
        height,
        ...attrs
      });
    },
  
    /**
     * Create an SVG line element
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG line markup
     */
    createLine(x1, y1, x2, y2, attrs = {}) {
      return this.createElement('line', {
        x1,
        y1,
        x2,
        y2,
        ...attrs
      });
    },
  
    /**
     * Create an SVG text element
     * @param {string} content - Text content
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG text markup
     */
    createText(content, x, y, attrs = {}) {
      return this.createElementWithContent('text', {
        x,
        y,
        ...attrs
      }, content);
    },
  
    /**
     * Create an SVG polygon element
     * @param {Array} points - Array of point coordinates
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG polygon markup
     */
    createPolygon(points, attrs = {}) {
      const pointsString = points
        .map(p => `${p[0]},${p[1]}`)
        .join(' ');
      
      return this.createElement('polygon', {
        points: pointsString,
        ...attrs
      });
    },
  
    /**
     * Create an SVG ellipse element
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} rx - X radius
     * @param {number} ry - Y radius
     * @param {Object} attrs - Additional attributes
     * @returns {string} SVG ellipse markup
     */
    createEllipse(cx, cy, rx, ry, attrs = {}) {
      return this.createElement('ellipse', {
        cx,
        cy,
        rx,
        ry,
        ...attrs
      });
    },
  
    /**
     * Create an SVG group element
     * @param {string} content - Group content
     * @param {Object} attrs - Group attributes
     * @returns {string} SVG group markup
     */
    createGroup(content, attrs = {}) {
      return this.createElementWithContent('g', attrs, content);
    },
  
    /**
     * Escape special characters in SVG text
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeText(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
  };
  
  module.exports = { svgUtils };