/**
 * Node model for SBGN pathway visualizations
 */

class Node {
    /**
     * Create a new pathway node
     * @param {Object} nodeData - Node data
     */
    constructor(nodeData = {}) {
      // Required properties
      this.id = nodeData.id || `node-${Math.random().toString(36).substring(2, 9)}`;
      this.label = nodeData.label || '';
      
      // Optional properties
      this.type = nodeData.type || 'default';
      this.entityType = nodeData.entityType || null;
      this.style = nodeData.style || {};
      this.marks = nodeData.marks || [];
      this.data = nodeData.data || {};
      
      // Connections
      this.connections = nodeData.connections ? 
        nodeData.connections.map(conn => {
          if (typeof conn === 'string') {
            // Simple connection by target ID
            return { targetId: conn, type: 'main' };
          } else {
            // Full connection object
            return conn;
          }
        }) : [];
    }
  
    /**
     * Add a connection to another node
     * @param {string|Object} target - Target node ID or connection object
     * @returns {Node} This node for chaining
     */
    addConnection(target) {
      if (typeof target === 'string') {
        this.connections.push({
          targetId: target,
          type: 'main'
        });
      } else {
        this.connections.push(target);
      }
      
      return this;
    }
  
    /**
     * Add a marker to the node
     * @param {Object} marker - Marker configuration
     * @param {number} position - Position index (0-3, clockwise from top-left)
     * @returns {Node} This node for chaining
     */
    addMarker(marker, position = 0) {
      // Ensure marks array exists and has enough elements
      if (!this.marks) this.marks = [];
      while (this.marks.length <= position) {
        this.marks.push(null);
      }
      
      // Add marker at position
      this.marks[position] = marker;
      
      return this;
    }
  
    /**
     * Set node style
     * @param {Object} style - Style configuration
     * @returns {Node} This node for chaining
     */
    setStyle(style) {
      this.style = { ...this.style, ...style };
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
        entityType: this.entityType,
        style: this.style,
        marks: this.marks,
        connections: this.connections,
        data: this.data
      };
    }
  }
  
  module.exports = { Node };