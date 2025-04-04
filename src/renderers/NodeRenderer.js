/**
 * Node Renderer for pathway visualizations
 * Renders different types of nodes based on SBGN specification
 */
const { SpecialElementRenderers } = require('./SpecialElements');

class NodeRenderer {
  /**
   * Create a new Node Renderer
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
    this.specialElementRenderers = new SpecialElementRenderers(config);
  }

  /**
   * Render a node at the specified position
   * @param {Object} node - Node data
   * @param {Object} position - Position {x, y}
   * @param {Map} positions - Map of all element positions
   * @returns {string} SVG markup for the node
   */
  renderNode(node, position, positions) {
    if (!position) return '';
    
    // Handle special node types
    if (node.type === 'DNA') {
      return this.specialElementRenderers.renderDNA(position.x, position.y, node);
    }
    
    if (node.type === 'RNA') {
      return this.specialElementRenderers.renderRNA(position.x, position.y, node);
    }
    
    // Get node style (merge default with node-specific styles)
    const style = {
      ...this.config.styles.node,
      ...(node.style || {})
    };
    
    // Apply custom SBGN styling based on node entity type
    if (node.entityType && this.config.sbgnEntityStyles && this.config.sbgnEntityStyles[node.entityType]) {
      Object.assign(style, this.config.sbgnEntityStyles[node.entityType]);
    }
    
    // Generate node shape based on entity type or default to ellipse
    let nodeShape;
    
    switch (node.entityType) {
      case 'macromolecule':
        nodeShape = this.renderRoundedRectangle(position.x, position.y, style);
        break;
      case 'simpleChemical':
        nodeShape = this.renderCircle(position.x, position.y, style);
        break;
      case 'process':
        nodeShape = this.renderSquare(position.x, position.y, style);
        break;
      case 'complex':
        nodeShape = this.renderOctagon(position.x, position.y, style);
        break;
      case 'nucleicAcidFeature':
        nodeShape = this.renderBottomRoundedRectangle(position.x, position.y, style);
        break;
      default:
        // Default to double ellipse for metabolites
        nodeShape = this.renderDoubleEllipse(position.x, position.y, style);
    }
    
    // Generate markers for the node (if any)
    const markers = this.renderMarkers(node, position);
    
    // Generate node label
    const label = this.renderNodeLabel(node, position);
    
    // Generate node group with data attributes
    return `
      <g 
        class="sbgn-node ${style.className || ''}"
        data-node-id="${node.id}"
        data-node-type="${node.entityType || 'default'}"
        ${style.dropShadow ? 'filter="url(#dropShadow)"' : ''}
      >
        ${nodeShape}
        ${markers}
        ${label}
      </g>
    `;
  }

  /**
   * Render markers for a node
   * @param {Object} node - Node data
   * @param {Object} position - Position {x, y}
   * @returns {string} SVG markup for markers
   */
  renderMarkers(node, position) {
    if (!node.marks || node.marks.length === 0) return '';
    
    // Calculate corner positions for markers
    const corners = [
      { x: position.x - this.config.layout.nodeWidth/2 + 10, y: position.y - this.config.layout.nodeHeight/2 + 10 },
      { x: position.x + this.config.layout.nodeWidth/2 - 10, y: position.y - this.config.layout.nodeHeight/2 + 10 },
      { x: position.x - this.config.layout.nodeWidth/2 + 10, y: position.y + this.config.layout.nodeHeight/2 - 10 },
      { x: position.x + this.config.layout.nodeWidth/2 - 10, y: position.y + this.config.layout.nodeHeight/2 - 10 }
    ];
    
    return node.marks.map((mark, index) => {
      if (!mark || !mark.type) return '';
      
      const corner = corners[index % corners.length];
      
      return `
        <g class="sbgn-marker" data-marker-type="${mark.type}">
          <circle
            cx="${corner.x}"
            cy="${corner.y}"
            r="${this.config.layout.markerRadius}"
            fill="${mark.type ? this.config.styles.marker.colors[mark.type] : 'white'}"
            stroke="black"
            stroke-width="1"
          />
          <text
            x="${corner.x}"
            y="${corner.y}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-weight="${this.config.styles.marker.fontWeight}"
            font-size="${this.config.styles.marker.fontSize}"
          >${mark.type}</text>
        </g>
      `;
    }).join('');
  }

  /**
   * Render a node label
   * @param {Object} node - Node data
   * @param {Object} position - Position {x, y}
   * @returns {string} SVG markup for the label
   */
  renderNodeLabel(node, position) {
    if (!node.label) return '';
    
    const style = {
      ...this.config.styles.node,
      ...(node.style || {})
    };
    
    return `
      <text
        x="${position.x}"
        y="${position.y}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="${style.labelFontFamily}"
        font-size="${style.labelFontSize}"
        font-weight="${style.labelFontWeight}"
        class="sbgn-node-label"
      >${node.label}</text>
    `;
  }

  /**
   * Render a double ellipse (default node shape)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} style - Node style
   * @returns {string} SVG markup for a double ellipse
   */
  renderDoubleEllipse(x, y, style) {
    // Calculate inner ellipse dimensions - make it slightly smaller
    const innerPadding = 5; // Space between ellipses
    const rx = this.config.layout.nodeWidth / 2; // Outer ellipse rx (width)
    const ry = this.config.layout.nodeHeight / 2; // Outer ellipse ry (height)
    const innerRx = rx - innerPadding;
    const innerRy = ry - innerPadding;
    
    const dropShadowAttr = style.dropShadow ? 'filter="url(#dropShadow)"' : '';
    
    // Use adapted approach from original pathway code
    return `
      <!-- Outer ellipse -->
      <ellipse
        cx="${x}"
        cy="${y}"
        rx="${rx}"
        ry="${ry}"
        fill="${style.fill || 'white'}"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
        ${dropShadowAttr}
      />
      ${style.innerStroke !== false ? `
        <!-- Inner ellipse - following SBGN convention for simple chemicals -->
        <ellipse
          cx="${x}"
          cy="${y}"
          rx="${innerRx}"
          ry="${innerRy}"
          fill="none"
          stroke="${style.stroke || 'black'}"
          stroke-width="${style.strokeWidth || 2}"
        />
      ` : ''}
    `;
  }

  /**
   * Render a rounded rectangle (macromolecule)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} style - Node style
   * @returns {string} SVG markup for a rounded rectangle
   */
  renderRoundedRectangle(x, y, style) {
    const width = this.config.layout.nodeWidth;
    const height = this.config.layout.nodeHeight;
    const cornerRadius = style.cornerRadius || 15;
    
    return `
      <rect
        x="${x - width/2}"
        y="${y - height/2}"
        width="${width}"
        height="${height}"
        rx="${cornerRadius}"
        ry="${cornerRadius}"
        fill="${style.fill || 'white'}"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
      />
    `;
  }

  /**
   * Render a circle (simple chemical)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} style - Node style
   * @returns {string} SVG markup for a circle
   */
  renderCircle(x, y, style) {
    // For simple chemicals in SBGN, use ellipses with inner ellipse for better presentation
    // This is more aligned with the original pathway_original.js implementation
    const rx = this.config.layout.nodeWidth / 2;
    const ry = this.config.layout.nodeHeight / 2;
    const innerPadding = 5;
    const innerRx = rx - innerPadding;
    const innerRy = ry - innerPadding;
    
    return `
      <!-- Outer ellipse for simple chemical -->
      <ellipse
        cx="${x}"
        cy="${y}"
        rx="${rx}"
        ry="${ry}"
        fill="${style.fill || 'white'}"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
      />
      <!-- Inner ellipse - SBGN convention for simple chemicals -->
      <ellipse
        cx="${x}"
        cy="${y}"
        rx="${innerRx}"
        ry="${innerRy}"
        fill="none"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
      />
    `;
  }

  /**
   * Render a square (process node)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} style - Node style
   * @returns {string} SVG markup for a square
   */
  renderSquare(x, y, style) {
    const size = style.size || 20;
    
    return `
      <rect
        x="${x - size/2}"
        y="${y - size/2}"
        width="${size}"
        height="${size}"
        fill="${style.fill || 'white'}"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
      />
    `;
  }

  /**
   * Render an octagon (complex)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} style - Node style
   * @returns {string} SVG markup for an octagon
   */
  renderOctagon(x, y, style) {
    const width = this.config.layout.nodeWidth;
    const height = this.config.layout.nodeHeight;
    const cornerOffset = Math.min(width, height) * 0.15;
    
    const points = [
      [x - width/2 + cornerOffset, y - height/2],
      [x + width/2 - cornerOffset, y - height/2],
      [x + width/2, y - height/2 + cornerOffset],
      [x + width/2, y + height/2 - cornerOffset],
      [x + width/2 - cornerOffset, y + height/2],
      [x - width/2 + cornerOffset, y + height/2],
      [x - width/2, y + height/2 - cornerOffset],
      [x - width/2, y - height/2 + cornerOffset]
    ].map(p => `${p[0]},${p[1]}`).join(' ');
    
    return `
      <polygon
        points="${points}"
        fill="${style.fill || 'white'}"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
      />
    `;
  }

  /**
   * Render a bottom-rounded rectangle (nucleic acid feature)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} style - Node style
   * @returns {string} SVG markup for a bottom-rounded rectangle
   */
  renderBottomRoundedRectangle(x, y, style) {
    const width = this.config.layout.nodeWidth;
    const height = this.config.layout.nodeHeight;
    const cornerRadius = style.cornerRadius || 15;
    
    return `
      <path
        d="M ${x - width/2} ${y - height/2}
           H ${x + width/2}
           V ${y + height/2 - cornerRadius}
           Q ${x + width/2} ${y + height/2} ${x + width/2 - cornerRadius} ${y + height/2}
           H ${x - width/2 + cornerRadius}
           Q ${x - width/2} ${y + height/2} ${x - width/2} ${y + height/2 - cornerRadius}
           Z"
        fill="${style.fill || 'white'}"
        stroke="${style.stroke || 'black'}"
        stroke-width="${style.strokeWidth || 2}"
      />
    `;
  }
}

module.exports = { NodeRenderer };