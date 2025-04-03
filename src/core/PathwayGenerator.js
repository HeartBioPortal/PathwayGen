/**
 * Core pathway generation logic
 */
const { SVGRenderer } = require('../renderers/SVGRenderer');
const { NodeRenderer } = require('../renderers/NodeRenderer');
const { ConnectionRenderer } = require('../renderers/ConnectionRenderer');
const { CompartmentRenderer } = require('../renderers/CompartmentRenderer');
const { SpecialElementRenderers } = require('../renderers/SpecialElements');
const { mathUtils } = require('../utils/mathUtils');
const { PathwayConfig } = require('./PathwayConfig');

class PathwayGenerator {
  /**
   * Create a new pathway generator
   * @param {Object|PathwayConfig} config - Configuration options or PathwayConfig instance
   */
  constructor(config = {}) {
    this.config = config instanceof PathwayConfig ? config : new PathwayConfig(config);
    
    // Initialize renderers
    this.svgRenderer = new SVGRenderer(this.config);
    this.nodeRenderer = new NodeRenderer(this.config);
    this.connectionRenderer = new ConnectionRenderer(this.config);
    this.compartmentRenderer = new CompartmentRenderer(this.config);
    this.specialElementRenderers = new SpecialElementRenderers(this.config);
  }

  /**
   * Calculate positions for all pathway elements
   * @param {Array} nodes - Array of node objects
   * @returns {Map} Map of element IDs to position objects
   */
  calculatePositions(nodes) {
    const positions = new Map();
    const processedNodes = new Set();
    
    const processNode = (node, x, y, parentId = null) => {
      if (processedNodes.has(node.id)) return;
      processedNodes.add(node.id);
      
      positions.set(node.id, { x, y });
      
      // Count branches first
      const branchConnections = (node.connections || []).filter(c => c.type === 'branch');
      const hasTwoBranches = branchConnections.length === 2;
      
      node.connections?.forEach((connection, index) => {
        const targetNode = nodes.find(n => n.id === connection.targetId);
        if (!targetNode) return;
        
        if (connection.type === 'main') {
          const nextY = y + this.config.layout.verticalSpacing * 2;
          const nextX = x;
          
          // Store intermediate position
          const intermediatePos = {
            x: (x + nextX) / 2,
            y: (y + nextY) / 2
          };
          positions.set(`intermediate-${node.id}-${connection.targetId}`, intermediatePos);
          
          // Process enzymes
          connection.enzymes?.forEach((enzyme, eIdx) => {
            const isRightSide = connection.angle > 0;
            const enzymeOffset = this.config.layout.horizontalSpacing;
            
            positions.set(`enzyme-${node.id}-${connection.targetId}-${eIdx}`, {
              x: intermediatePos.x + (isRightSide ? enzymeOffset : -enzymeOffset),
              y: intermediatePos.y + (eIdx % 2 === 0 ? -40 : 40)
            });
          });
          
          processNode(targetNode, nextX, nextY, node.id);
          
        } else if (connection.type === 'branch') {
          // Calculate vertical offset first
          const verticalOffset = hasTwoBranches ? this.config.layout.verticalSpacing * 2 : 0;
          
          // Adjust the branch length to accommodate the vertical offset
          const defaultLength = hasTwoBranches 
            ? Math.sqrt((300 * 300) + (verticalOffset * verticalOffset)) 
            : this.config.layout.defaultBranchLength;
            
          const angle = connection.angle ?? this.config.layout.defaultBranchAngle * (index % 2 ? 1 : -1);
          const length = connection.length ?? defaultLength;
          
          // Calculate end point including the vertical offset
          const branchEnd = mathUtils.calculateBranchEndpoint(x, y, angle, length, verticalOffset);
          positions.set(`branch-${node.id}-${connection.targetId}`, branchEnd);
          
          // Calculate and store intermediate position
          const branchMid = {
            x: x + (length/2) * Math.sin(angle * Math.PI / 180),
            y: y + (length/2) * Math.cos(angle * Math.PI / 180) + (verticalOffset/2)
          };
          positions.set(`intermediate-branch-${node.id}-${connection.targetId}`, branchMid);
          
          // Process enzymes for branch
          connection.enzymes?.forEach((enzyme, eIdx) => {
            const isRightSide = angle > 0;
            const enzymeOffset = this.config.layout.horizontalSpacing;
            
            positions.set(`enzyme-${node.id}-${connection.targetId}-${eIdx}`, {
              x: branchMid.x + (isRightSide ? enzymeOffset : -enzymeOffset),
              y: branchMid.y + (eIdx % 2 === 0 ? -40 : 40)  
            });
          });
          
          processNode(targetNode, branchEnd.x, branchEnd.y, node.id);
        }
      });
    };
    
    // Process from root nodes
    const rootNodes = nodes.filter(node => 
      !nodes.some(n => n.connections?.some(c => c.targetId === node.id))
    );
    
    rootNodes.forEach((rootNode, index) => {
      const x = this.config.layout.width / 2;
      const y = this.config.layout.verticalSpacing + (index * this.config.layout.verticalSpacing * 3);
      processNode(rootNode, x, y);
    });
    
    return positions;
  }

  /**
   * Generate pathway elements based on data and positions
   * @param {Object} data - Pathway data
   * @returns {Object} Element markup for SVG
   */
  generatePathwayElements(data) {
    const positions = this.calculatePositions(data.nodes);

    // Generate SVG definitions
    const defs = this.svgRenderer.generateDefs();
    
    // Generate node elements
    const nodes = data.nodes.map(node => 
      this.nodeRenderer.renderNode(node, positions.get(node.id), positions)
    ).join('');
    
    // Generate connection elements
    const connections = data.nodes.map(node => 
      this.connectionRenderer.renderConnections(node, positions)
    ).join('');
    
    // Generate compartment elements
    const compartments = data.compartments 
      ? this.compartmentRenderer.renderCompartments(data.compartments, positions) 
      : '';
    
    return {
      defs,
      compartments,
      connections,
      nodes
    };
  }

  /**
   * Generate complete SVG markup for the pathway
   * @param {Object} data - Pathway data
   * @returns {string} SVG markup
   */
  generateSVG(data) {
    // Allow for data to provide custom config overrides for this specific rendering
    if (data.config) {
      this.config.update(data.config);
    }
    
    const elements = this.generatePathwayElements(data);
    
    // Calculate actual height needed if autoResize is enabled
    let height = this.config.layout.height;
    if (this.config.layout.autoResize && data.nodes.length > 0) {
      const positions = this.calculatePositions(data.nodes);
      const maxY = Math.max(...[...positions.values()].map(pos => pos.y));
      height = maxY + this.config.layout.verticalSpacing;
    }
    
    return this.svgRenderer.wrapSVG(
      elements.defs +
      elements.compartments +
      elements.connections +
      elements.nodes,
      this.config.layout.width,
      height
    );
  }
}

module.exports = { PathwayGenerator };