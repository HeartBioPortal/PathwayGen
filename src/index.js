/**
 * SBGN Pathway Visualization
 * Main export file for the athway-gen package
 */

const { PathwayConfig } = require('./core/PathwayConfig');
const { PathwayGenerator } = require('./core/PathwayGenerator');
const { defaultConfig } = require('./config/defaultConfig');
const { ThemeManager } = require('./config/themeManager');
const models = require('./models');
const renderers = require('./renderers');

// Main pathway visualization class
class SBGNPathway {
  /**
   * Create a new SBGN pathway visualization
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.config = new PathwayConfig({...defaultConfig, ...config});
    this.generator = new PathwayGenerator(this.config);
    this.themeManager = new ThemeManager();
  }

  /**
   * Generate SVG representation of the pathway
   * @param {Object} data - Pathway data
   * @returns {string} SVG markup
   */
  generateSVG(data) {
    return this.generator.generateSVG(data);
  }

  /**
   * Apply a theme to the pathway
   * @param {string} themeName - Name of the theme to apply
   */
  applyTheme(themeName) {
    const theme = this.themeManager.getTheme(themeName);
    this.config.updateStyles(theme.styles);
    return this;
  }

  /**
   * Set custom configuration
   * @param {Object} config - Configuration options
   */
  setConfig(config) {
    this.config.update(config);
    return this;
  }

  /**
   * Create a new node
   * @param {Object} nodeData - Node data
   * @returns {Object} Node object
   */
  createNode(nodeData) {
    return new models.Node(nodeData);
  }

  /**
   * Create a new connection
   * @param {Object} connectionData - Connection data
   * @returns {Object} Connection object
   */
  createConnection(connectionData) {
    return new models.Connection(connectionData);
  }

  /**
   * Load a predefined pathway example
   * @param {string} exampleName - Name of the example
   * @returns {Object} Example pathway data
   */
  loadExample(exampleName) {
    try {
      return require(`../examples/${exampleName}`);
    } catch (error) {
      console.error(`Example "${exampleName}" not found.`);
      return null;
    }
  }
}

// Export classes and utilities
module.exports = {
  SBGNPathway,
  PathwayConfig,
  PathwayGenerator,
  ThemeManager,
  models,
  renderers,
  defaultConfig
};