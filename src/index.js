'use strict';

/**
 * SBGN Pathway Visualization
 * Main export file for the `pathway-gen` package
 *
 * - Strong JSDoc typedefs for better IDE support
 * - Defensive config merge + runtime validation hooks
 * - Fluent API (applyTheme → setConfig → render)
 * - Clear errors with fallback behavior
 * - Convenience helpers (listThemes, render alias, loadExample)
 */

/* ---------------------------------- Types ---------------------------------- */
/**
 * @typedef {import('./core/PathwayConfig').PathwayConfig} PathwayConfigClass
 * @typedef {import('./core/PathwayGenerator').PathwayGenerator} PathwayGeneratorClass
 *
 * @typedef {Object} PathwayData
 * @property {Array<Object>} nodes
 * @property {Array<Object>} edges
 *
 * @typedef {Object} Theme
 * @property {string} name
 * @property {Record<string, any>} styles
 *
 * @typedef {Object} Config
 * @property {Record<string, any>} styles
 * @property {Record<string, any>} layout
 * @property {Record<string, any>} [validate] Optional validation settings
 */

/* --------------------------------- Imports --------------------------------- */
const path = require('path');
const fs = require('fs');

const { PathwayConfig } = require('./core/PathwayConfig');
const { PathwayGenerator } = require('./core/PathwayGenerator');
const { defaultConfig } = require('./config/defaultConfig');
const { ThemeManager } = require('./config/themeManager');
const models = require('./models');
const renderers = require('./renderers');

/* --------------------------------- Utils ----------------------------------- */
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Shallow merge with basic guards (keeps object refs for consumer mutability
 * while avoiding accidental primitive overwrites with non-objects).
 * @param {Record<string, any>} base
 * @param {Record<string, any>} patch
 */
function mergeConfigs(base, patch) {
  const out = { ...base };
  for (const k of Object.keys(patch || {})) {
    const a = base[k];
    const b = patch[k];
    out[k] = isObject(a) && isObject(b) ? { ...a, ...b } : b;
  }
  return out;
}

/* ------------------------------- Main Class -------------------------------- */
class SBGNPathway {
  /**
   * @param {Partial<Config>} [config]
   */
  constructor(config = {}) {
    /** @type {Config} */
    const merged = mergeConfigs(defaultConfig, config);
    this.config = new PathwayConfig(merged);
    this.generator = new PathwayGenerator(this.config);
    this.themeManager = new ThemeManager();
  }

  /**
   * Primary render method (SVG output).
   * Alias: `render`
   * @param {PathwayData} data
   * @returns {string} SVG markup
   */
  generateSVG(data) {
    this.#assertValidData(data);
    return this.generator.generateSVG(data);
  }

  /**
   * @deprecated Use generateSVG
   * @param {PathwayData} data
   */
  render(data) {
    return this.generateSVG(data);
  }

  /**
   * Apply a theme (fluent).
   * @param {string} themeName
   * @returns {this}
   */
  applyTheme(themeName) {
    const theme = this.themeManager.getTheme(themeName);
    if (!theme) {
      throw new Error(
        `Theme "${themeName}" not found. ` +
        `Available: ${this.listThemes().join(', ') || '(none)'}`
      );
    }
    if (theme.styles) this.config.updateStyles(theme.styles);
    return this;
  }

  /**
   * List available theme names.
   * @returns {string[]}
   */
  listThemes() {
    return this.themeManager.list?.() || this.themeManager.availableThemes || [];
  }

  /**
   * Update configuration (fluent).
   * @param {Partial<Config>} patch
   * @returns {this}
   */
  setConfig(patch) {
    if (!isObject(patch)) throw new TypeError('setConfig(patch) expects an object.');
    this.config.update(patch);
    return this;
  }

  /**
   * Create a new node model.
   * @param {Object} nodeData
   * @returns {InstanceType<typeof models.Node>}
   */
  createNode(nodeData) {
    return new models.Node(nodeData);
  }

  /**
   * Create a new connection model.
   * @param {Object} connectionData
   * @returns {InstanceType<typeof models.Connection>}
   */
  createConnection(connectionData) {
    return new models.Connection(connectionData);
  }

  /**
   * Load a predefined pathway example from ../examples/<name>.js|.json
   * @param {string} exampleName
   * @returns {PathwayData | null}
   */
  loadExample(exampleName) {
    const tryPaths = [
      path.resolve(__dirname, `../examples/${exampleName}.js`),
      path.resolve(__dirname, `../examples/${exampleName}.json`),
      path.resolve(__dirname, `../examples/${exampleName}/index.js`),
      path.resolve(__dirname, `../examples/${exampleName}/index.json`)
    ];

    for (const p of tryPaths) {
      if (fs.existsSync(p)) {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const data = require(p);
        return (data && data.default) ? data.default : data;
      }
    }

    // Final attempt: original require path as given
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const data = require(`../examples/${exampleName}`);
      return (data && data.default) ? data.default : data;
    } catch (_) {
      // no-op
    }

    console.error(`Example "${exampleName}" not found in ../examples.`);
    return null;
  }

  /**
   * Optional PNG export if a raster renderer is available.
   * @param {PathwayData} data
   * @param {{ scale?: number, background?: string }} [opts]
   * @returns {Buffer} PNG bytes
   */
  generatePNG(data, opts = {}) {
    if (!renderers?.png) {
      throw new Error('PNG renderer not available. Ensure renderers.png is provided.');
    }
    this.#assertValidData(data);
    const svg = this.generateSVG(data);
    return renderers.png(svg, opts);
  }

  /* ------------------------------ Internals ------------------------------- */
  /**
   * @param {PathwayData} data
   */
  #assertValidData(data) {
    if (!isObject(data)) {
      throw new TypeError('Pathway data must be an object.');
    }
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      throw new TypeError('Pathway data must include "nodes" and "edges" arrays.');
    }
    // Hook for optional runtime validation libraries (e.g., Ajv) if user configured.
    const v = this.config?.get?.('validate') || this.config?.validate;
    if (typeof v?.fn === 'function') {
      const ok = v.fn(data);
      if (!ok) throw new Error(v.message || 'Pathway data failed validation.');
    }
  }

  /* ----------------------------- Static sugar ---------------------------- */
  /**
   * @param {Partial<Config>} cfg
   */
  static from(cfg) {
    return new SBGNPathway(cfg);
  }
}

/* ------------------------------- Exports ----------------------------------- */
module.exports = {
  SBGNPathway,
  PathwayConfig,
  PathwayGenerator,
  ThemeManager,
  models,
  renderers,
  defaultConfig
};
