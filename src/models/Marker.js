/**
 * Marker model for SBGN pathway visualizations
 */

class Marker {
    /**
     * Create a new pathway marker
     * @param {Object} markerData - Marker data
     */
    constructor(markerData = {}) {
      // Required properties
      this.type = markerData.type || null;
      
      // Optional properties
      this.id = markerData.id || `marker-${Math.random().toString(36).substring(2, 9)}`;
      this.style = markerData.style || {};
      this.data = markerData.data || {};
    }
  
    /**
     * Set marker style
     * @param {Object} style - Style configuration
     * @returns {Marker} This marker for chaining
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
        type: this.type,
        style: this.style,
        data: this.data
      };
    }
  }
  
  module.exports = { Marker };