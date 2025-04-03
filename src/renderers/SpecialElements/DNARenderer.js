/**
 * DNA Renderer for pathway visualizations
 * Renders DNA helices as special nodes
 */

class DNARenderer {
    /**
     * Create a new DNA Renderer
     * @param {Object} config - Configuration object
     */
    constructor(config) {
      this.config = config;
    }
  
    /**
     * Render a DNA helix
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} node - Node data
     * @param {Object} options - Rendering options
     * @returns {string} SVG markup for DNA helix
     */
    renderDNA(x, y, node, options = {}) {
      const width = options.width || 100;
      const height = options.height || 40;
      const numberOfWaves = this.config.styles.dna.waveCount;
      
      const strand1Points = [];
      const strand2Points = [];
      
      // Generate points for both strands
      for (let i = 0; i <= numberOfWaves * 16; i++) {
        const t = (i / (numberOfWaves * 16)) * Math.PI * 2 * numberOfWaves;
        const xPos = x + (width * t) / (Math.PI * 2 * numberOfWaves);
        
        // First strand
        strand1Points.push({
          x: xPos,
          y: y + Math.sin(t) * height/2
        });
        
        // Second strand (phase shifted)
        strand2Points.push({
          x: xPos,
          y: y + Math.sin(t + Math.PI) * height/2
        });
      }
      
      // Create path strings
      const strand1Path = strand1Points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ');
      
      const strand2Path = strand2Points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ');
  
      // Additional H-bond connections between strands
      const hBonds = this.generateHBonds(strand1Points, strand2Points);
      
      // Apply node-specific style if available
      const style = {
        ...this.config.styles.dna,
        ...(node.style && node.style.dna ? node.style.dna : {})
      };
  
      return `
        <g class="sbgn-dna-helix" data-node-id="${node.id || ''}">
          <!-- Strand 1 -->
          <path 
            d="${strand1Path}" 
            stroke="${style.strand1Color}" 
            fill="none" 
            stroke-width="${style.strokeWidth}"
            stroke-linecap="round"
          />
          
          <!-- Strand 2 -->
          <path 
            d="${strand2Path}" 
            stroke="${style.strand2Color}" 
            fill="none" 
            stroke-width="${style.strokeWidth}"
            stroke-linecap="round"
          />
          
          <!-- H-bonds -->
          ${hBonds}
          
          <!-- Label -->
          <text 
            x="${x + width + 10}" 
            y="${y + 5}" 
            fill="black" 
            class="font-medium"
            font-family="${this.config.styles.node.labelFontFamily}"
            font-size="${this.config.styles.node.labelFontSize}"
          >${node.label || 'DNA'}</text>
        </g>
      `;
    }
  
    /**
     * Generate hydrogen bond connections between DNA strands
     * @param {Array} strand1Points - Points for first strand
     * @param {Array} strand2Points - Points for second strand
     * @returns {string} SVG markup for H-bonds
     */
    generateHBonds(strand1Points, strand2Points) {
      // Create H-bonds at regular intervals
      const numBonds = Math.min(4, Math.floor(strand1Points.length / 12));
      let hBonds = '';
      
      for (let i = 0; i < numBonds; i++) {
        const index = Math.floor(strand1Points.length / (numBonds + 1)) * (i + 1);
        if (index < strand1Points.length && index < strand2Points.length) {
          hBonds += `
            <line 
              x1="${strand1Points[index].x}" 
              y1="${strand1Points[index].y}" 
              x2="${strand2Points[index].x}" 
              y2="${strand2Points[index].y}" 
              stroke="#AAAAAA" 
              stroke-width="1" 
              stroke-dasharray="2,2"
            />
          `;
        }
      }
      
      return hBonds;
    }
  }
  
  module.exports = { DNARenderer };