/**
 * Intermediate Element Renderer
 * Renders intermediate elements like process nodes or reaction sites
 */

class IntermediateElementRenderer {
    /**
     * Create a new Intermediate Element Renderer
     * @param {Object} config - Configuration object
     */
    constructor(config) {
      this.config = config;
    }
  
    /**
     * Render an intermediate element
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} config - Element configuration
     * @returns {string} SVG markup for intermediate element
     */
    renderIntermediateElement(x, y, config) {
      const {
        label,
        width = 120,
        height = 40,
        attachedBox = null,
        type = 'default'
      } = config;
      
      let result = '';
      
      // Render the main element based on type
      switch (type) {
        case 'process':
          result += this.renderProcessNode(x, y, config);
          break;
        case 'association':
          result += this.renderAssociationNode(x, y, config);
          break;
        case 'dissociation':
          result += this.renderDissociationNode(x, y, config);
          break;
        default:
          result += this.renderDefaultElement(x, y, config);
      }
      
      // Add label if provided
      if (label) {
        result += `
          <text
            x="${x}"
            y="${y + height + 15}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-family="${this.config.styles.node.labelFontFamily}"
            font-size="${this.config.styles.node.labelFontSize}"
            class="sbgn-intermediate-label"
          >${label}</text>
        `;
      }
      
      // Add attached box if provided
      if (attachedBox) {
        result += this.renderAttachedBox(x, y, attachedBox);
      }
      
      return `
        <g class="sbgn-intermediate-element sbgn-${type}">
          ${result}
        </g>
      `;
    }
  
    /**
     * Render default intermediate element (rectangle)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} config - Element configuration
     * @returns {string} SVG markup for default element
     */
    renderDefaultElement(x, y, config) {
      const {
        width = 120,
        height = 40,
        fill = 'white',
        stroke = 'black',
        strokeWidth = 2
      } = config;
      
      return `
        <rect
          x="${x - width/2}"
          y="${y - height/2}"
          width="${width}"
          height="${height}"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
      `;
    }
  
    /**
     * Render a process node (square)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} config - Element configuration
     * @returns {string} SVG markup for process node
     */
    renderProcessNode(x, y, config) {
      const {
        size = 20,
        fill = 'white',
        stroke = 'black',
        strokeWidth = 2
      } = config;
      
      return `
        <rect
          x="${x - size/2}"
          y="${y - size/2}"
          width="${size}"
          height="${size}"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
      `;
    }
  
    /**
     * Render an association node (circle)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} config - Element configuration
     * @returns {string} SVG markup for association node
     */
    renderAssociationNode(x, y, config) {
      const {
        size = 20,
        fill = 'white',
        stroke = 'black',
        strokeWidth = 2
      } = config;
      
      return `
        <circle
          cx="${x}"
          cy="${y}"
          r="${size/2}"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
        <line
          x1="${x - size/2 + 5}"
          y1="${y}"
          x2="${x + size/2 - 5}"
          y2="${y}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
      `;
    }
  
    /**
     * Render a dissociation node (slashed circle)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} config - Element configuration
     * @returns {string} SVG markup for dissociation node
     */
    renderDissociationNode(x, y, config) {
      const {
        size = 20,
        fill = 'white',
        stroke = 'black',
        strokeWidth = 2
      } = config;
      
      return `
        <circle
          cx="${x}"
          cy="${y}"
          r="${size/2}"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
        <line
          x1="${x - size/2 + 5}"
          y1="${y}"
          x2="${x + size/2 - 5}"
          y2="${y}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
        <line
          x1="${x}"
          y1="${y - size/2 + 5}"
          x2="${x}"
          y2="${y + size/2 - 5}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
      `;
    }
  
    /**
     * Render an attached box (e.g., for catalysts, enzymes)
     * @param {number} x - X position of parent element
     * @param {number} y - Y position of parent element
     * @param {Object} attachedBox - Attached box configuration
     * @returns {string} SVG markup for attached box
     */
    renderAttachedBox(x, y, attachedBox) {
      const {
        label,
        width = 80,
        height = 40,
        side = 'right',
        fill = 'white',
        stroke = 'black',
        strokeWidth = 2
      } = attachedBox;
      
      // Calculate position based on side
      const isRightSide = side === 'right';
      const markerRadius = 8;
      const spacing = 20;
      
      const markerX = isRightSide ? x + 60 : x - 60;
      const attachedBoxX = isRightSide ? 
        markerX + markerRadius + spacing + width/2 : 
        markerX - markerRadius - spacing - width/2;
      
      return `
        <!-- Marker circle -->
        <circle
          cx="${markerX}"
          cy="${y}"
          r="${markerRadius}"
          fill="white"
          stroke="${stroke}"
          stroke-width="1"
        />
        
        <!-- Attached box -->
        <rect
          x="${attachedBoxX - width/2}"
          y="${y - height/2}"
          width="${width}"
          height="${height}"
          rx="${this.config.styles.enzyme.cornerRadius || 0}"
          ry="${this.config.styles.enzyme.cornerRadius || 0}"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
        
        <!-- Label for attached box -->
        <text
          x="${attachedBoxX}"
          y="${y}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="${this.config.styles.node.labelFontFamily}"
          font-size="${this.config.styles.enzyme.labelFontSize}"
          class="sbgn-enzyme-label"
        >${label}</text>
        
        <!-- Connection line between marker and attached box -->
        <line
          x1="${markerX}"
          y1="${y}"
          x2="${isRightSide ? attachedBoxX - width/2 : attachedBoxX + width/2}"
          y2="${y}"
          stroke="${stroke}"
          stroke-width="${strokeWidth}"
        />
      `;
    }
  }
  
  module.exports = { IntermediateElementRenderer };