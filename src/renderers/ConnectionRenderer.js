/**
 * Connection Renderer for pathway visualizations
 * Renders connections between nodes, including enzymes
 */
const { mathUtils } = require('../utils/mathUtils');
const { SpecialElementRenderers } = require('./SpecialElements');

class ConnectionRenderer {
  /**
   * Create a new Connection Renderer
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
    this.specialElementRenderers = new SpecialElementRenderers(config);
  }

  /**
   * Render connections for a node
   * @param {Object} node - Node data
   * @param {Map} positions - Map of element positions
   * @returns {string} SVG markup for connections
   */
  renderConnections(node, positions) {
    if (!node.connections) return '';
    
    // Render regular connections
    const connectionMarkup = node.connections.map(connection => {
      return this.renderConnection(node, connection, positions);
    }).join('');
    
    // Render enzyme connections (e.g., between pairs of enzymes)
    const enzymeConnectionMarkup = this.renderEnzymeConnections(node, positions);
    
    // Render any special end decorations (DNA, RNA, etc.)
    const decorationMarkup = node.connections.map(connection => {
      return this.renderEndDecoration(connection, positions);
    }).join('');
    
    return `
      <g class="sbgn-connections" data-source-node-id="${node.id}">
        ${connectionMarkup}
        ${enzymeConnectionMarkup}
        ${decorationMarkup}
      </g>
    `;
  }

  /**
   * Render a single connection
   * @param {Object} node - Source node
   * @param {Object} connection - Connection data
   * @param {Map} positions - Map of element positions
   * @returns {string} SVG markup for connection
   */
  renderConnection(node, connection, positions) {
    const startPos = positions.get(node.id);
    if (!startPos) return '';
    
    const targetNode = { id: connection.targetId };
    const endPos = positions.get(targetNode.id);
    if (!endPos) return '';
    
    // Get connection type
    const connectionType = connection.type || 'main';
    
    // Get connection style (merge default with connection-specific styles)
    const style = {
      ...this.config.styles.connection,
      ...(connection.style || {})
    };
    
    // Apply SBGN specific styling if available
    if (connection.sbgnClass && this.config.sbgnArcStyles && this.config.sbgnArcStyles[connection.sbgnClass]) {
      Object.assign(style, this.config.sbgnArcStyles[connection.sbgnClass]);
    }
    
    // Get marker type based on connection properties
    const marker = this.getMarkerType(connection);
    
    // Generate path based on connection type
    let path = '';
    let intermediatePos = null;
    
    if (connectionType === 'main') {
      // Get intermediate position
      intermediatePos = positions.get(`intermediate-${node.id}-${connection.targetId}`);
      
      // Generate main connection path
      path = `
        <path
          d="M ${startPos.x} ${startPos.y + (this.config.layout.nodeHeight / 2)}
             L ${endPos.x} ${endPos.y - (this.config.layout.nodeHeight / 2)}"
          stroke="${style.stroke}"
          stroke-width="${style.strokeWidth}"
          ${style.dashArray ? `stroke-dasharray="${style.dashArray}"` : ''}
          fill="none"
          ${marker ? `marker-end="url(#${marker})"` : ''}
          class="${style.className || ''}"
        />
      `;
      
      // Render intermediate node/junction if position exists
      if (intermediatePos) {
        path += `
          <rect
            x="${intermediatePos.x - this.config.layout.intermediateBoxSize / 2}"
            y="${intermediatePos.y - this.config.layout.intermediateBoxSize / 2}"
            width="${this.config.layout.intermediateBoxSize}"
            height="${this.config.layout.intermediateBoxSize}"
            fill="white"
            stroke="${style.stroke}"
            stroke-width="${style.strokeWidth}"
          />
        `;
        
        // Render intermediate element if specified
        if (connection.intermediateElement) {
          path += this.specialElementRenderers.renderIntermediateElement(
            intermediatePos.x,
            intermediatePos.y,
            connection.intermediateElement
          );
        }
      }
      
    } else if (connectionType === 'branch') {
      // Get branch end position
      const branchEnd = positions.get(`branch-${node.id}-${connection.targetId}`);
      if (!branchEnd) return '';
      
      // Get intermediate position for branch
      intermediatePos = positions.get(`intermediate-branch-${node.id}-${connection.targetId}`);
      
      // Generate branch connection path
      path = `
        <path
          d="M ${startPos.x} ${startPos.y + (this.config.layout.nodeHeight / 2)}
             L ${branchEnd.x} ${branchEnd.y - (this.config.layout.nodeHeight / 2)}"
          stroke="${style.stroke}"
          stroke-width="${style.strokeWidth}"
          ${style.dashArray ? `stroke-dasharray="${style.dashArray}"` : ''}
          fill="none"
          ${marker ? `marker-end="url(#${marker})"` : ''}
          class="${style.className || ''}"
        />
      `;
      
      // Render intermediate node/junction if position exists
      if (intermediatePos) {
        path += `
          <rect
            x="${intermediatePos.x - this.config.layout.intermediateBoxSize / 2}"
            y="${intermediatePos.y - this.config.layout.intermediateBoxSize / 2}"
            width="${this.config.layout.intermediateBoxSize}"
            height="${this.config.layout.intermediateBoxSize}"
            fill="white"
            stroke="${style.stroke}"
            stroke-width="${style.strokeWidth}"
          />
        `;
      }
    }
    
    // Render enzymes along the connection
    const enzymeMarkup = this.renderEnzymes(node, connection, positions);
    
    return `
      <g class="sbgn-connection sbgn-${connectionType}" data-connection-id="${node.id}-${connection.targetId}">
        ${path}
        ${enzymeMarkup}
      </g>
    `;
  }

  /**
   * Get the appropriate marker type for a connection
   * @param {Object} connection - Connection data
   * @returns {string} Marker type
   */
  getMarkerType(connection) {
    // Use SBGN class if specified
    if (connection.sbgnClass) {
      switch (connection.sbgnClass) {
        case 'consumption': return '';
        case 'production': return 'arrowhead';
        case 'catalysis': return 'catalysis';
        case 'inhibition': return 'inhibition';
        case 'stimulation': return 'stimulation';
      }
    }
    
    // Default marker based on connection type
    return connection.marker || 'arrowhead';
  }

  /**
   * Render enzymes along a connection
   * @param {Object} node - Source node
   * @param {Object} connection - Connection data
   * @param {Map} positions - Map of element positions
   * @returns {string} SVG markup for enzymes
   */
  renderEnzymes(node, connection, positions) {
    if (!connection.enzymes || connection.enzymes.length === 0) return '';
    
    return connection.enzymes.map((enzyme, eIdx) => {
      const enzymePos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx}`);
      if (!enzymePos) return '';
      
      // Calculate enzyme marker position (top left corner)
      const markerX = enzymePos.x - this.config.layout.enzymeBoxSize/2;
      const markerY = enzymePos.y - this.config.layout.enzymeBoxSize/2;
      
      // Get enzyme style (merge default with enzyme-specific styles)
      const style = {
        ...this.config.styles.enzyme,
        ...(enzyme.style || {})
      };
      
      return `
        <g class="sbgn-enzyme" data-enzyme-id="${enzyme.id || `enzyme-${eIdx}`}">
          <rect
            x="${enzymePos.x - this.config.layout.enzymeBoxSize / 2}"
            y="${enzymePos.y - this.config.layout.enzymeBoxSize / 2}"
            width="${this.config.layout.enzymeBoxSize}"
            height="${this.config.layout.enzymeBoxSize}"
            fill="${style.fill}"
            stroke="${style.stroke}"
            stroke-width="${style.strokeWidth}"
            rx="${style.cornerRadius}"
            ry="${style.cornerRadius}"
            class="${style.className || ''}"
          />
          <text
            x="${enzymePos.x}"
            y="${enzymePos.y}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-family="${this.config.styles.node.labelFontFamily}"
            font-size="${style.labelFontSize}"
            class="sbgn-enzyme-label"
          >${enzyme.label || ''}</text>
          ${enzyme.marker ? this.renderEnzymeMarker(markerX, markerY, enzyme.marker) : ''}
        </g>
      `;
    }).join('');
  }

  /**
   * Render marker for an enzyme
   * @param {number} x - X position (corner)
   * @param {number} y - Y position (corner)
   * @param {Object} marker - Marker data
   * @returns {string} SVG markup for marker
   */
  renderEnzymeMarker(x, y, marker) {
    return `
      <g class="sbgn-enzyme-marker">
        <circle
          cx="${x}"
          cy="${y}"
          r="${this.config.layout.markerRadius}"
          fill="${marker.type ? this.config.styles.marker.colors[marker.type] : 'white'}"
          stroke="black"
          stroke-width="1"
        />
        ${marker.type ? `
          <text
            x="${x}"
            y="${y}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-weight="${this.config.styles.marker.fontWeight}"
            font-size="${this.config.styles.marker.fontSize}"
          >${marker.type}</text>
        ` : ''}
      </g>
    `;
  }

  /**
   * Render enzyme connections (e.g., between pairs of enzymes)
   * @param {Object} node - Source node
   * @param {Map} positions - Map of element positions
   * @returns {string} SVG markup for enzyme connections
   */
  renderEnzymeConnections(node, positions) {
    if (!node.connections) return '';
    
    return node.connections.map(connection => {
      if (!connection.enzymes || connection.enzymes.length < 2) return '';
      
      const intermediateKey = connection.type === 'branch' 
        ? `intermediate-branch-${node.id}-${connection.targetId}`
        : `intermediate-${node.id}-${connection.targetId}`;
      
      const intermediatePos = positions.get(intermediateKey);
      if (!intermediatePos) return '';

      return connection.enzymes.map((enzyme, eIdx) => {
        if (eIdx % 2 !== 0) return ''; // Skip odd indices to handle pairs
        
        const enzyme1Pos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx}`);
        const enzyme2Pos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx + 1}`);
        
        if (!enzyme1Pos || !enzyme2Pos) return '';
        
        // Get connection style
        const style = {
          ...this.config.styles.connection,
          ...(connection.style || {})
        };
        
        // Condition for straight connections and right angle connections
        if (!connection.angle || connection.angle > 0) {
          return `
            <path
              d="M ${enzyme1Pos.x - 30} ${enzyme1Pos.y}
                 L ${intermediatePos.x + 11} ${intermediatePos.y}
                 L ${enzyme2Pos.x - 30} ${enzyme2Pos.y}"
              fill="none"
              stroke="${style.stroke}"
              stroke-width="${style.strokeWidth}"
              ${style.dashArray ? `stroke-dasharray="${style.dashArray}"` : ''}
              marker-end="url(#arrowhead)"
            />
          `;
        } else {
          return `
            <path
              d="M ${enzyme1Pos.x + 30} ${enzyme1Pos.y}
                 L ${intermediatePos.x - 11} ${intermediatePos.y}
                 L ${enzyme2Pos.x + 30} ${enzyme2Pos.y}"
              fill="none"
              stroke="${style.stroke}"
              stroke-width="${style.strokeWidth}"
              ${style.dashArray ? `stroke-dasharray="${style.dashArray}"` : ''}
              marker-end="url(#arrowhead)"
            />
          `;
        }
      }).join('');
    }).join('');
  }

  /**
   * Render end decoration for a connection (DNA, RNA, etc.)
   * @param {Object} connection - Connection data
   * @param {Map} positions - Map of element positions
   * @returns {string} SVG markup for end decoration
   */
  renderEndDecoration(connection, positions) {
    if (!connection.endDecoration) return '';
    
    const endPos = positions.get(connection.targetId);
    if (!endPos) return '';
    
    const decorationY = endPos.y + this.config.layout.nodeHeight/2 + 20;
    
    if (connection.endDecoration === 'DNA') {
      return this.specialElementRenderers.renderDNA(endPos.x - 50, decorationY, {
        id: `decoration-${connection.targetId}`,
        label: connection.endDecorationLabel || 'DNA'
      });
    } else if (connection.endDecoration === 'RNA') {
      return this.specialElementRenderers.renderRNA(endPos.x - 50, decorationY, {
        id: `decoration-${connection.targetId}`,
        label: connection.endDecorationLabel || 'RNA'
      });
    }
    
    return '';
  }
}

module.exports = { ConnectionRenderer };