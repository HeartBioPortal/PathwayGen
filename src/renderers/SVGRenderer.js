/**
 * SVG Renderer for pathway visualizations
 */
const { svgUtils } = require('../utils/svgUtils');

class SVGRenderer {
  /**
   * Create a new SVG Renderer
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Generate SVG definitions section with markers, filters, etc.
   * @returns {string} SVG defs markup
   */
  generateDefs() {
    // Create various arrowhead markers
    const arrowheads = this.generateArrowheads();
    
    // Create drop shadow filter if enabled
    const dropShadow = this.config.styles.node.dropShadow 
      ? this.generateDropShadowFilter() 
      : '';
    
    // Create gradient definitions
    const gradients = this.generateGradients();
    
    return `
      <defs>
        ${arrowheads}
        ${dropShadow}
        ${gradients}
      </defs>
    `;
  }

  /**
   * Generate arrowhead marker definitions
   * @returns {string} SVG marker definitions
   */
  generateArrowheads() {
    const arrowSize = this.config.styles.connection.arrowSize;
    
    return `
      <!-- Standard arrowhead -->
      <marker
        id="arrowhead"
        markerWidth="${arrowSize}"
        markerHeight="7"
        refX="${arrowSize - 1}"
        refY="3.5"
        orient="auto"
      >
        <polygon 
          points="0 0, ${arrowSize} 3.5, 0 7" 
          fill="${this.config.styles.connection.stroke}" 
        />
      </marker>
      
      <!-- Inhibition marker (bar) -->
      <marker
        id="inhibition"
        markerWidth="${arrowSize}"
        markerHeight="10"
        refX="${arrowSize - 1}"
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
        markerWidth="${arrowSize}"
        markerHeight="10"
        refX="${arrowSize}"
        refY="5"
        orient="auto"
      >
        <circle 
          cx="${arrowSize/2}" 
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
        markerWidth="${arrowSize}"
        markerHeight="8"
        refX="${arrowSize - 1}"
        refY="4"
        orient="auto"
      >
        <polyline 
          points="0 0, ${arrowSize - 2} 4, 0 8" 
          fill="none" 
          stroke="${this.config.styles.connection.stroke}" 
          stroke-width="1.5"
        />
      </marker>
    `;
  }

  /**
   * Generate drop shadow filter
   * @returns {string} SVG filter definition
   */
  generateDropShadowFilter() {
    return `
      <filter 
        id="dropShadow" 
        x="-20%" 
        y="-20%" 
        width="140%" 
        height="140%"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
  }

  /**
   * Generate gradient definitions
   * @returns {string} SVG gradient definitions
   */
  generateGradients() {
    return `
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
    `;
  }

  /**
   * Wrap SVG content in an SVG container
   * @param {string} content - SVG inner content
   * @param {number} width - SVG width
   * @param {number} height - SVG height
   * @returns {string} Complete SVG markup
   */
  wrapSVG(content, width, height) {
    const interactionAttrs = this.generateInteractionAttributes();
    
    return `
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="${width}" 
        height="${height}"
        viewBox="0 0 ${width} ${height}"
        class="sbgn-pathway bg-white shadow-lg rounded-lg"
        ${interactionAttrs}
      >
        <style>
          .sbgn-node { cursor: pointer; }
          .sbgn-node:hover { stroke: #3182CE; stroke-width: 3px; }
          .sbgn-enzyme { cursor: pointer; }
          .sbgn-enzyme:hover { stroke: #3182CE; stroke-width: 2px; }
          .sbgn-compartment-label { font-family: Arial, sans-serif; }
          /* Add more styles here */
        </style>
        <g id="pathway-content-wrapper">
          ${content}
        </g>
      </svg>
    `;
}

  /**
   * Generate interaction-related attributes
   * @returns {string} SVG interaction attributes
   */
  generateInteractionAttributes() {
    const attrs = [];
    
    if (this.config.interaction.enableZoom || this.config.interaction.enablePan) {
      attrs.push('data-interactive="true"');
    }
    
    if (this.config.interaction.enableZoom) {
      attrs.push('data-enable-zoom="true"');
    }
    
    if (this.config.interaction.enablePan) {
      attrs.push('data-enable-pan="true"');
    }
    
    if (this.config.interaction.enableTooltips) {
      attrs.push('data-enable-tooltips="true"');
      attrs.push(`data-tooltip-delay="${this.config.interaction.tooltipDelay}"`);
    }
    
    return attrs.join(' ');
  }
}

module.exports = { SVGRenderer };