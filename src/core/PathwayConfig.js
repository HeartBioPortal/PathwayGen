/**
 * Configuration handler for pathway visualizations
 */
const _ = require('lodash');

class PathwayConfig {
  /**
   * Create a new pathway configuration
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    // Layout configuration
    this.layout = {
      nodeWidth: config.nodeWidth ?? 180,
      nodeHeight: config.nodeHeight ?? 50,
      verticalSpacing: config.verticalSpacing ?? 120,
      horizontalSpacing: config.horizontalSpacing ?? 140,
      enzymeBoxSize: config.enzymeBoxSize ?? 60,
      intermediateBoxSize: config.intermediateBoxSize ?? 20,
      width: config.width ?? 800,
      height: config.height ?? 1600,
      markerRadius: config.markerRadius ?? 8,
      defaultBranchAngle: config.defaultBranchAngle ?? 30,
      defaultBranchLength: config.defaultBranchLength ?? 200,
      padding: config.padding ?? 20,
      autoResize: config.autoResize ?? true
    };

    // Compartment configuration
    this.compartments = {
      lineSpacing: config.compartmentLineSpacing ?? 10,
      labelOffset: config.compartmentLabelOffset ?? 30,
      curveControl: config.compartmentCurveControl ?? 50,
      opacity: config.compartmentOpacity ?? 0.3,
      borderRadius: config.compartmentBorderRadius ?? 10
    };

    // Style configuration
    this.styles = {
      node: {
        fill: config.nodeFill ?? 'white',
        stroke: config.nodeStroke ?? 'black',
        strokeWidth: config.nodeStrokeWidth ?? 2,
        className: config.nodeClassName ?? 'cursor-pointer hover:stroke-blue-500',
        labelFontSize: config.nodeLabelFontSize ?? 12,
        labelFontFamily: config.nodeLabelFontFamily ?? 'Arial, sans-serif',
        labelFontWeight: config.nodeLabelFontWeight ?? 'normal',
        cornerRadius: config.nodeCornerRadius ?? 0,
        dropShadow: config.nodeDropShadow ?? false,
        innerStroke: config.nodeInnerStroke ?? true
      },
      connection: {
        stroke: config.connectionStroke ?? 'black',
        strokeWidth: config.connectionStrokeWidth ?? 2,
        className: config.connectionClassName ?? '',
        dashArray: config.connectionDashArray ?? '',
        arrowSize: config.connectionArrowSize ?? 10,
        curve: config.connectionCurve ?? 'linear', // linear, curved, stepped
        labelFontSize: config.connectionLabelFontSize ?? 10,
        labelDistance: config.connectionLabelDistance ?? 10
      },
      enzyme: {
        fill: config.enzymeFill ?? 'white',
        stroke: config.enzymeStroke ?? 'black',
        strokeWidth: config.enzymeStrokeWidth ?? 2,
        className: config.enzymeClassName ?? 'cursor-pointer hover:stroke-blue-500',
        labelFontSize: config.enzymeLabelFontSize ?? 10,
        cornerRadius: config.enzymeCornerRadius ?? 0
      },
      marker: {
        colors: {
          P: config.markerPColor ?? '#FFD700', // phosphate - gold
          O: config.markerOColor ?? '#FF4444', // oxygen - red
          S: config.markerSColor ?? '#33CC33', // sulfur - green
          N: config.markerNColor ?? '#6666FF'  // nitrogen - blue
        },
        fontWeight: config.markerFontWeight ?? 'bold',
        fontSize: config.markerFontSize ?? 10
      },
      compartment: {
        defaultColor: config.compartmentDefaultColor ?? '#CCCCCC',
        strokeOpacity: config.compartmentStrokeOpacity ?? 0.8,
        fontWeight: config.compartmentFontWeight ?? 'bold',
        fontSize: config.compartmentFontSize ?? 14
      },
      dna: {
        strand1Color: config.dnaStrand1Color ?? '#4299E1',
        strand2Color: config.dnaStrand2Color ?? '#805AD5',
        strokeWidth: config.dnaStrokeWidth ?? 2,
        waveHeight: config.dnaWaveHeight ?? 20,
        waveCount: config.dnaWaveCount ?? 3
      },
      rna: {
        strandColor: config.rnaStrandColor ?? '#C05621',
        strokeWidth: config.rnaStrokeWidth ?? 2,
        waveHeight: config.rnaWaveHeight ?? 15,
        waveCount: config.rnaWaveCount ?? 4
      }
    };

    // Animation configuration (if supported)
    this.animation = {
      enabled: config.animationEnabled ?? false,
      duration: config.animationDuration ?? 500,
      easing: config.animationEasing ?? 'ease-in-out'
    };

    // Interaction configuration
    this.interaction = {
      enableZoom: config.enableZoom ?? true,
      enablePan: config.enablePan ?? true,
      enableTooltips: config.enableTooltips ?? true,
      enableHighlight: config.enableHighlight ?? true,
      highlightColor: config.highlightColor ?? '#3182CE',
      highlightOpacity: config.highlightOpacity ?? 0.3,
      tooltipDelay: config.tooltipDelay ?? 500
    };
  }

  /**
   * Update configuration with new values
   * @param {Object} config - New configuration options
   */
  update(config) {
    // Use lodash's merge to deeply update the configuration
    _.merge(this, {
      layout: config.layout || {},
      compartments: config.compartments || {},
      styles: config.styles || {},
      animation: config.animation || {},
      interaction: config.interaction || {}
    });
    
    return this;
  }

  /**
   * Update only the styles configuration
   * @param {Object} styles - New styles configuration
   */
  updateStyles(styles) {
    _.merge(this.styles, styles);
    return this;
  }

  /**
   * Get a simplified configuration object
   * @returns {Object} Simplified configuration
   */
  toObject() {
    return {
      layout: {...this.layout},
      compartments: {...this.compartments},
      styles: {...this.styles},
      animation: {...this.animation},
      interaction: {...this.interaction}
    };
  }
}

module.exports = { PathwayConfig };