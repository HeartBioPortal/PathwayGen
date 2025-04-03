/**
 * Enzyme model for SBGN pathway visualizations
 */

class Enzyme {
    /**
     * Create a new pathway enzyme
     * @param {Object} enzymeData - Enzyme data
     */
    constructor(enzymeData = {}) {
      // Required properties
      this.label = enzymeData.label || '';
      
      // Optional properties
      this.id = enzymeData.id || `enzyme-${Math.random().toString(36).substring(2, 9)}`;
      this.style = enzymeData.style || {};
      this.marker = enzymeData.marker || null;
      this.data = enzymeData.data || {};
    }
  
    /**
     * Set enzyme marker
     * @param {string} type - Marker type (P, O, S, N, etc.)
     * @returns {Enzyme} This enzyme for chaining
     */
    setMarker(type) {
      this.marker = { type };
      return this;
    }
  
    /**
     * Set enzyme style
     * @param {Object} style - Style configuration
     * @returns {Enzyme} This enzyme for chaining
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
        style: this.style,
        marker: this.marker,
        data: this.data
      };
    }
  }
  
  module.exports = { Enzyme };