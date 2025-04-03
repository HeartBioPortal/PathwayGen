/**
 * Connection model for SBGN pathway visualizations
 */

class Connection {
    /**
     * Create a new pathway connection
     * @param {Object} connectionData - Connection data
     */
    constructor(connectionData = {}) {
      // Required properties
      this.targetId = connectionData.targetId || '';
      this.type = connectionData.type || 'main';
      
      // Optional properties
      this.id = connectionData.id || `connection-${Math.random().toString(36).substring(2, 9)}`;
      this.sbgnClass = connectionData.sbgnClass || null;
      this.style = connectionData.style || {};
      this.marker = connectionData.marker || null;
      this.label = connectionData.label || '';
      this.angle = connectionData.angle || null;
      this.length = connectionData.length || null;
      this.data = connectionData.data || {};
      
      // Special features
      this.endDecoration = connectionData.endDecoration || null;
      this.endDecorationLabel = connectionData.endDecorationLabel || null;
      this.intermediateElement = connectionData.intermediateElement || null;
      
      // Enzymes along the connection
      this.enzymes = connectionData.enzymes || [];
    }
  
    /**
     * Add an enzyme to the connection
     * @param {Object} enzyme - Enzyme configuration
     * @returns {Connection} This connection for chaining
     */
    addEnzyme(enzyme) {
      if (!this.enzymes) this.enzymes = [];
      this.enzymes.push(enzyme);
      
      return this;
    }
  
    /**
     * Set connection style
     * @param {Object} style - Style configuration
     * @returns {Connection} This connection for chaining
     */
    setStyle(style) {
      this.style = { ...this.style, ...style };
      return this;
    }
  
    /**
     * Set SBGN class/type for the connection
     * @param {string} sbgnClass - SBGN class
     * @returns {Connection} This connection for chaining
     */
    setSbgnClass(sbgnClass) {
      this.sbgnClass = sbgnClass;
      return this;
    }
  
    /**
     * Set intermediate element
     * @param {Object} element - Intermediate element configuration
     * @returns {Connection} This connection for chaining
     */
    setIntermediateElement(element) {
      this.intermediateElement = element;
      return this;
    }
  
    /**
     * Set end decoration
     * @param {string} decorationType - Decoration type ('DNA', 'RNA', etc.)
     * @param {string} label - Optional label
     * @returns {Connection} This connection for chaining
     */
    setEndDecoration(decorationType, label) {
      this.endDecoration = decorationType;
      this.endDecorationLabel = label || null;
      
      return this;
    }
  
    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toObject() {
      return {
        id: this.id,
        targetId: this.targetId,
        type: this.type,
        sbgnClass: this.sbgnClass,
        style: this.style,
        marker: this.marker,
        label: this.label,
        angle: this.angle,
        length: this.length,
        enzymes: this.enzymes,
        endDecoration: this.endDecoration,
        endDecorationLabel: this.endDecorationLabel,
        intermediateElement: this.intermediateElement,
        data: this.data
      };
    }
  }
  
  module.exports = { Connection };