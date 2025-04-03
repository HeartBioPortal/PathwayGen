/**
 * Compartment Renderer for pathway visualizations
 * Renders cellular compartments and boundaries
 */

class CompartmentRenderer {
    /**
     * Create a new Compartment Renderer
     * @param {Object} config - Configuration object
     */
    constructor(config) {
      this.config = config;
    }
  
    /**
     * Render compartments
     * @param {Array} compartments - Compartment data
     * @param {Map} positions - Map of element positions
     * @returns {string} SVG markup for compartments
     */
    renderCompartments(compartments, positions) {
      if (!compartments || compartments.length === 0) return '';
      
      return compartments.map(compartment => {
        return this.renderCompartment(compartment, positions);
      }).join('');
    }
  
    /**
     * Render a single compartment
     * @param {Object} compartment - Compartment data
     * @param {Map} positions - Map of element positions
     * @returns {string} SVG markup for compartment
     */
    renderCompartment(compartment, positions) {
      // Get position based on reference nodes
      const pos = this.getCompartmentPosition(compartment, positions);
      if (!pos) return '';
      
      // Get style (merge default with compartment-specific styles)
      const style = {
        color: compartment.color || this.config.styles.compartment.defaultColor,
        strokeWidth: compartment.strokeWidth || 3,
        opacity: this.config.compartments.opacity,
        strokeOpacity: this.config.styles.compartment.strokeOpacity
      };
      
      // Generate unique ID for gradient
      const compartmentId = compartment.id || `compartment-${Math.random().toString(36).substring(2, 9)}`;
      
      // Calculate dimensions for curved boundaries
      const width = this.config.layout.width;
      const arcHeight = this.config.compartments.curveControl;
      const y2 = pos.y + this.config.compartments.lineSpacing;
      
      return `
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="gradient-${compartmentId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${style.color}" stop-opacity="0"/>
            <stop offset="50%" stop-color="${style.color}" stop-opacity="${style.opacity}"/>
            <stop offset="100%" stop-color="${style.color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
  
        <g 
          class="sbgn-compartment" 
          data-compartment-id="${compartmentId}"
          data-compartment-type="${compartment.type || 'default'}"
        >
          <!-- Background fill -->
          <path
            d="M 0 ${pos.y - 100}
               L ${width} ${pos.y - 100}
               L ${width} ${pos.y + 100}
               L 0 ${pos.y + 100}
               Z"
            fill="url(#gradient-${compartmentId})"
          />
          
          <!-- Double arc lines -->
          <path
            d="M 0 ${pos.y} 
               Q ${width/2} ${pos.y - arcHeight} ${width} ${pos.y}"
            fill="none"
            stroke="${style.color}"
            stroke-width="${style.strokeWidth}"
            stroke-opacity="${style.strokeOpacity}"
          />
          <path
            d="M 0 ${y2} 
               Q ${width/2} ${y2 - arcHeight} ${width} ${y2}"
            fill="none"
            stroke="${style.color}"
            stroke-width="${style.strokeWidth}"
            stroke-opacity="${style.strokeOpacity}"
          />
          
          <!-- Compartment label -->
          <text
            x="20"
            y="${pos.y - this.config.compartments.labelOffset}"
            fill="${style.color}"
            font-weight="${this.config.styles.compartment.fontWeight}"
            font-family="${this.config.styles.node.labelFontFamily}"
            font-size="${this.config.styles.compartment.fontSize}"
            class="sbgn-compartment-label"
          >${compartment.label || ''}</text>
        </g>
      `;
    }
  
    /**
     * Get position for a compartment
     * @param {Object} compartment - Compartment data
     * @param {Map} positions - Map of element positions
     * @returns {Object|null} Position {x, y} or null if not found
     */
    getCompartmentPosition(compartment, positions) {
      // If explicit y-position is provided, use it
      if (compartment.y !== undefined) {
        // Find a reference node position for x-coordinate
        if (compartment.intersectNodes && compartment.intersectNodes.length > 0) {
          const refNodePos = positions.get(compartment.intersectNodes[0]);
          if (refNodePos) {
            return {
              x: refNodePos.x,
              y: refNodePos.y + compartment.y
            };
          }
        }
        
        // Default x position if no reference node
        return {
          x: this.config.layout.width / 2,
          y: compartment.y
        };
      }
      
      // If reference nodes are provided, calculate position based on them
      if (compartment.intersectNodes && compartment.intersectNodes.length > 0) {
        // Calculate average position of reference nodes
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        
        for (const nodeId of compartment.intersectNodes) {
          const nodePos = positions.get(nodeId);
          if (nodePos) {
            sumX += nodePos.x;
            sumY += nodePos.y;
            count++;
          }
        }
        
        if (count > 0) {
          return {
            x: sumX / count,
            y: sumY / count
          };
        }
      }
      
      // Default position
      return null;
    }
  }
  
  module.exports = { CompartmentRenderer };