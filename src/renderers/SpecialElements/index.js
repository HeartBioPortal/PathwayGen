/**
 * Special Elements Renderers
 * Container class for specialized SBGN element renderers
 */

const { DNARenderer } = require('./DNARenderer');
const { RNARenderer } = require('./RNARenderer');
const { IntermediateElementRenderer } = require('./IntermediateElementRenderer');

class SpecialElementRenderers {
  /**
   * Create a set of special element renderers
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
    this.dnaRenderer = new DNARenderer(config);
    this.rnaRenderer = new RNARenderer(config);
    this.intermediateElementRenderer = new IntermediateElementRenderer(config);
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
    return this.dnaRenderer.renderDNA(x, y, node, options);
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
    return this.rnaRenderer.renderRNA(x, y, node, options);
  }

  /**
   * Render an intermediate element
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} config - Element configuration
   * @returns {string} SVG markup for intermediate element
   */
  renderIntermediateElement(x, y, config) {
    return this.intermediateElementRenderer.renderIntermediateElement(x, y, config);
  }
}

module.exports = { 
  SpecialElementRenderers,
  DNARenderer,
  RNARenderer,
  IntermediateElementRenderer
};