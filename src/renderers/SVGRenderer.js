/**
 * SVG Renderer for pathway visualizations
 * Handles the overall SVG structure and wrapping
 */

class SVGRenderer {
  /**
   * Create a new SVG Renderer
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Generate SVG definitions (markers, gradients, etc.)
   * @returns {string} SVG definitions
   */
  generateDefs() {
    return `
      <defs>
        <!-- Standard arrowhead -->
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon 
            points="0 0, 10 3.5, 0 7" 
            fill="${this.config.styles.connection.stroke}" 
          />
        </marker>
        
        <!-- Inhibition marker (bar) -->
        <marker
          id="inhibition"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <line 
            x1="0" y1="0" 
            x2="0" y2="10" 
            stroke="${this.config.styles.connection.stroke}" 
            stroke-width="2"
          />
        </marker>
        
        <!-- Catalysis marker (circle) -->
        <marker
          id="catalysis"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="5"
          orient="auto"
        >
          <circle 
            cx="5" 
            cy="5" 
            r="4" 
            fill="white" 
            stroke="${this.config.styles.connection.stroke}" 
            stroke-width="1"
          />
        </marker>
        
        <!-- Stimulation marker (open arrow) -->
        <marker
          id="stimulation"
          markerWidth="10"
          markerHeight="8"
          refX="9"
          refY="4"
          orient="auto"
        >
          <polyline 
            points="0 0, 8 4, 0 8" 
            fill="none" 
            stroke="${this.config.styles.connection.stroke}" 
            stroke-width="1.5"
          />
        </marker>
      
        ${this.generateDropShadowFilter()}
          
        <!-- Node gradient -->
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
          <stop offset="100%" stop-color="#F7FAFC" stop-opacity="1" />
        </linearGradient>
        
        <!-- Enzyme gradient -->
        <linearGradient id="enzymeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
          <stop offset="100%" stop-color="#EDF2F7" stop-opacity="1" />
        </linearGradient>
      </defs>
    `;
  }

  /**
   * Generate drop shadow filter for elements
   * @returns {string} Drop shadow filter definition
   */
  generateDropShadowFilter() {
    return `
      <!-- Drop shadow filter -->
      <filter id="dropShadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
        <feOffset dx="2" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.2"/>
        </feComponentTransfer>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    `;
  }

  /**
   * Wrap SVG content in an SVG container
   * @param {string} content - SVG content to wrap
   * @param {number} width - SVG width
   * @param {number} height - SVG height
   * @returns {string} Complete SVG markup
   */
  wrapSVG(content, width, height) {
    // Generate data attribute strings based on configuration
    const interactiveAttrs = `
      data-interactive="true"
      data-enable-zoom="${this.config.interaction?.enableZoom || true}"
      data-enable-pan="${this.config.interaction?.enablePan || true}"
      data-enable-tooltips="${this.config.interaction?.enableTooltips || true}"
      data-tooltip-delay="${this.config.interaction?.tooltipDelay || 500}"
    `;
    
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg 
  xmlns="http://www.w3.org/2000/svg"
  width="${width}" 
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  class="sbgn-pathway bg-white shadow-lg rounded-lg"
  ${interactiveAttrs}
>
  <style>
    .sbgn-node { cursor: pointer; }
    .sbgn-node:hover { stroke: #3182CE; stroke-width: 3px; }
    .sbgn-enzyme { cursor: pointer; }
    .sbgn-enzyme:hover { stroke: #3182CE; stroke-width: 2px; }
    .sbgn-compartment-label { font-family: Arial, sans-serif; }
    /* Add more styles here */
  </style>
  <defs>
    <!-- Compartment gradients will be added here by compartment renderer -->
    <linearGradient id="global-compartment-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E2E8F0" stop-opacity="0"/>
      <stop offset="50%" stop-color="#E2E8F0" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#E2E8F0" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g id="pathway-content-wrapper">
    ${content}
  </g>
</svg>`;
  }
}

module.exports = { SVGRenderer };