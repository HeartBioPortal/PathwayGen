/**
 * Compartment model for SBGN pathway visualizations
 */

class Compartment {
    /**
     * Create a new pathway compartment
     * @param {Object} compartmentData - Compartment data
     */
    constructor(compartmentData = {}) {
      // Required properties
      this.label = compartmentData.label || '';
      
      // Optional properties
      this.id = compartmentData.id || `compartment-${Math.random().toString(36).substring(2, 9)}`;
      this.type = compartmentData.type || 'default';
      this.color = compartmentData.color || null;
      this.strokeWidth = compartmentData.strokeWidth || 3;
      this.y = compartmentData.y || null;
      this.intersectNodes = compartmentData.intersectNodes || [];
      this.data = compartmentData.data || {};
    }
  
    /**
     * Set compartment position
     * @param {number} y - Y position
     * @returns {Compartment} This compartment for chaining
     */
    setPosition(y) {
      this.y = y;
      return this;
    }
  
    /**
     * Add an intersecting node
     * @param {string} nodeId - Node ID
     * @returns {Compartment} This compartment for chaining
     */
    addIntersectNode(nodeId) {
      if (!this.intersectNodes.includes(nodeId)) {
        this.intersectNodes.push(nodeId);
      }
      
      return this;
    }
  
    /**
     * Set compartment style
     * @param {string} color - Compartment color
     * @param {number} strokeWidth - Stroke width
     * @returns {Compartment} This compartment for chaining
     */
    setStyle(color, strokeWidth) {
      if (color) this.color = color;
      if (strokeWidth) this.strokeWidth = strokeWidth;
      
      return this;
    }
  
    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toObject() {
      return {
        id: this.id,
        label: this.label,
        type: this.type,
        color: this.color,
        strokeWidth: this.strokeWidth,
        y: this.y,
        intersectNodes: this.intersectNodes,
        data: this.data
      };
    }
  }
  
  module.exports = { Compartment };