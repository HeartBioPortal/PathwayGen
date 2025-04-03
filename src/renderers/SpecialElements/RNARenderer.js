/**
 * RNA Renderer for pathway visualizations
 * Renders RNA strands as special nodes
 */

class RNARenderer {
    /**
     * Create a new RNA Renderer
     * @param {Object} config - Configuration object
     */
    constructor(config) {
      this.config = config;
    }
  
    /**
     * Render an RNA strand
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} node - Node data
     * @param {Object} options - Rendering options
     * @returns {string} SVG markup for RNA strand
     */
    renderRNA(x, y, node, options = {}) {
      const width = options.width || 100;
      const height = options.height || 30;
      const numberOfWaves = this.config.styles.rna.waveCount;
      const points = [];
      
      // Generate points for RNA wave
      for (let i = 0; i <= numberOfWaves * 16; i++) {
        const t = (i / (numberOfWaves * 16)) * Math.PI * 2 * numberOfWaves;
        points.push({
          x: x + (width * t) / (Math.PI * 2 * numberOfWaves),
          y: y + Math.sin(t) * height/2
        });
      }
      
      // Create path string
      const path = points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ');
  
      // Add secondary structure elements (stem-loops)
      const stemLoops = this.generateStemLoops(points);
      
      // Apply node-specific style if available
      const style = {
        ...this.config.styles.rna,
        ...(node.style && node.style.rna ? node.style.rna : {})
      };
  
      return `
        <g class="sbgn-rna-strand" data-node-id="${node.id || ''}">
          <!-- Main RNA strand -->
          <path 
            d="${path}" 
            stroke="${style.strandColor}" 
            fill="none" 
            stroke-width="${style.strokeWidth}"
            stroke-linecap="round"
          />
          
          <!-- Secondary structure elements -->
          ${stemLoops}
          
          <!-- Label -->
          <text 
            x="${x + width + 10}" 
            y="${y + 5}" 
            fill="black" 
            class="font-medium"
            font-family="${this.config.styles.node.labelFontFamily}"
            font-size="${this.config.styles.node.labelFontSize}"
          >${node.label || 'RNA'}</text>
        </g>
      `;
    }
  
    /**
     * Generate RNA stem-loops for secondary structure visualization
     * @param {Array} points - Points along the RNA strand
     * @returns {string} SVG markup for stem-loops
     */
    generateStemLoops(points) {
      // Skip this feature if there aren't enough points
      if (points.length < 30) return '';
      
      // Create a single stem-loop structure
      const quarter = Math.floor(points.length / 4);
      const loopPoint = points[quarter];
      const loopRadius = 6;
      
      // Render a simple hairpin loop
      return `
        <circle 
          cx="${loopPoint.x}" 
          cy="${loopPoint.y - loopRadius * 1.5}" 
          r="${loopRadius}" 
          fill="none" 
          stroke="${this.config.styles.rna.strandColor}" 
          stroke-width="${this.config.styles.rna.strokeWidth / 1.5}"
          stroke-dasharray="2,1"
        />
      `;
    }
  }
  
  module.exports = { RNARenderer };