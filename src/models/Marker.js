"use strict";

/**
 * Marker model for SBGN pathway visualizations
 * - Safe ID generation (crypto.randomUUID fallback)
 * - Input validation & normalization
 * - Deep merge for style/data
 * - Immutable snapshots via toJSON()
 * - Chainable setters
 */

const genId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `marker-${crypto.randomUUID()}`;
  }
  return `marker-${Math.random().toString(36).slice(2, 10)}`;
};

const isPlainObject = (v) => Object.prototype.toString.call(v) === "[object Object]";

const deepMerge = (target, source) => {
  if (!isPlainObject(target) || !isPlainObject(source)) return source;
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    out[k] = isPlainObject(v) ? deepMerge(target[k] || {}, v) : v;
  }
  return out;
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

class Marker {
  /**
   * @param {Object} markerData
   * @param {string} [markerData.type] - SBGN marker type (e.g., 'entity', 'process', etc.)
   * @param {string} [markerData.id]   - Optional stable ID
   * @param {Object} [markerData.style]- Arbitrary visual style config
   * @param {Object} [markerData.data] - Arbitrary domain payload
   */
  constructor(markerData = {}) {
    if (!isPlainObject(markerData)) {
      throw new TypeError("Marker constructor expects a plain object.");
    }

    const {
      type = null,
      id = genId(),
      style = {},
      data = {},
    } = markerData;

    this._id = String(id);
    this._type = type === null ? null : String(type);
    this._style = isPlainObject(style) ? deepClone(style) : {};
    this._data = isPlainObject(data) ? deepClone(data) : {};

    // Lightweight validation hook (customize if you have a type whitelist)
    if (this._type !== null && this._type.trim() === "") {
      throw new Error("Marker 'type' cannot be an empty string.");
    }
  }

  // --------- Getters ---------
  get id()   { return this._id; }
  get type() { return this._type; }
  get style(){ return deepClone(this._style); }
  get data() { return deepClone(this._data); }

  // --------- Chainable Setters ---------
  /**
   * @param {string|null} type
   * @returns {Marker}
   */
  setType(type) {
    if (type !== null && (typeof type !== "string" || type.trim() === "")) {
      throw new TypeError("Marker 'type' must be a non-empty string or null.");
    }
    this._type = type === null ? null : String(type);
    return this;
  }

  /**
   * Replace style object entirely (use mergeStyle for partial updates).
   * @param {Object} style
   * @returns {Marker}
   */
  setStyle(style) {
    if (!isPlainObject(style)) throw new TypeError("setStyle expects a plain object.");
    this._style = deepClone(style);
    return this;
  }

  /**
   * Shallow/deep merge new style into existing style.
   * @param {Object} style
   * @returns {Marker}
   */
  mergeStyle(style) {
    if (!isPlainObject(style)) throw new TypeError("mergeStyle expects a plain object.");
    this._style = deepMerge(this._style, style);
    return this;
  }

  /**
   * Replace data object entirely (use mergeData for partial updates).
   * @param {Object} data
   * @returns {Marker}
   */
  setData(data) {
    if (!isPlainObject(data)) throw new TypeError("setData expects a plain object.");
    this._data = deepClone(data);
    return this;
  }

  /**
   * Deep merge new data into existing data.
   * @param {Object} data
   * @returns {Marker}
   */
  mergeData(data) {
    if (!isPlainObject(data)) throw new TypeError("mergeData expects a plain object.");
    this._data = deepMerge(this._data, data);
    return this;
  }

  /**
   * Set a stable ID (avoid unless you know what you're doing).
   * @param {string} id
   * @returns {Marker}
   */
  setId(id) {
    if (typeof id !== "string" || id.trim() === "") {
      throw new TypeError("setId expects a non-empty string.");
    }
    this._id = id;
    return this;
  }

  // --------- Utilities ---------
  /**
   * Plain object snapshot (detached/immutable).
   * @returns {{id:string, type:string|null, style:Object, data:Object}}
   */
  toObject() {
    return {
      id: this._id,
      type: this._type,
      style: deepClone(this._style),
      data: deepClone(this._data),
    };
  }

  /**
   * JSON serialization hook.
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Create a deep clone of this marker.
   * @returns {Marker}
   */
  clone() {
    return new Marker(this.toObject());
  }

  /**
   * Compare with another marker by value (id, type, style, data).
   * @param {Marker} other
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof Marker)) return false;
    return JSON.stringify(this.toObject()) === JSON.stringify(other.toObject());
  }

  /**
   * Build a Marker from a plain object (defensive).
   * @param {Object} obj
   * @returns {Marker}
   */
  static fromObject(obj) {
    return new Marker(obj);
  }
}

module.exports = { Marker };
