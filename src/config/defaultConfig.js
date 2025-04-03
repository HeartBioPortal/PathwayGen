/**
 * Default configuration for SBGN Pathway Visualization
 * Based on SBGN standards and best practices for biological pathway visualization
 */

const defaultConfig = {
    // Layout configuration
    width: 800,
    height: 1600,
    nodeWidth: 180,
    nodeHeight: 50,
    verticalSpacing: 120,
    horizontalSpacing: 140,
    enzymeBoxSize: 60,
    intermediateBoxSize: 20,
    markerRadius: 8,
    defaultBranchAngle: 30,
    defaultBranchLength: 200,
    padding: 20,
    autoResize: true,
    
    // Compartment configuration
    compartmentLineSpacing: 10,
    compartmentLabelOffset: 30,
    compartmentCurveControl: 50,
    compartmentOpacity: 0.3,
    compartmentBorderRadius: 10,
    
    // Node styles
    nodeFill: '#FFFFFF',
    nodeStroke: '#333333',
    nodeStrokeWidth: 2,
    nodeClassName: 'sbgn-node cursor-pointer hover:stroke-blue-500',
    nodeLabelFontSize: 12,
    nodeLabelFontFamily: 'Arial, sans-serif',
    nodeLabelFontWeight: 'normal',
    nodeCornerRadius: 0,
    nodeDropShadow: false,
    nodeInnerStroke: true,
    
    // Connection styles
    connectionStroke: '#333333',
    connectionStrokeWidth: 2,
    connectionClassName: 'sbgn-connection',
    connectionDashArray: '',
    connectionArrowSize: 10,
    connectionCurve: 'linear',
    connectionLabelFontSize: 10,
    connectionLabelDistance: 10,
    
    // Enzyme styles
    enzymeFill: '#FFFFFF',
    enzymeStroke: '#333333',
    enzymeStrokeWidth: 2,
    enzymeClassName: 'sbgn-enzyme cursor-pointer hover:stroke-blue-500',
    enzymeLabelFontSize: 10,
    enzymeCornerRadius: 0,
    
    // Marker styles
    markerPColor: '#FFD700', // phosphate - gold
    markerOColor: '#FF4444', // oxygen - red
    markerSColor: '#33CC33', // sulfur - green
    markerNColor: '#6666FF', // nitrogen - blue
    markerFontWeight: 'bold',
    markerFontSize: 10,
    
    // Compartment styles
    compartmentDefaultColor: '#CCCCCC',
    compartmentStrokeOpacity: 0.8,
    compartmentFontWeight: 'bold',
    compartmentFontSize: 14,
    
    // DNA styles
    dnaStrand1Color: '#4299E1',
    dnaStrand2Color: '#805AD5',
    dnaStrokeWidth: 2,
    dnaWaveHeight: 20,
    dnaWaveCount: 3,
    
    // RNA styles
    rnaStrandColor: '#C05621',
    rnaStrokeWidth: 2,
    rnaWaveHeight: 15,
    rnaWaveCount: 4,
    
    // Animation configuration
    animationEnabled: false,
    animationDuration: 500,
    animationEasing: 'ease-in-out',
    
    // Interaction configuration
    enableZoom: true,
    enablePan: true,
    enableTooltips: true,
    enableHighlight: true,
    highlightColor: '#3182CE',
    highlightOpacity: 0.3,
    tooltipDelay: 500
  };
  
  // SBGN specific entity styles
  const sbgnEntityStyles = {
    // Process Node (represents a biochemical process)
    process: {
      shape: 'square',
      size: 20,
      fill: '#FFFFFF',
      stroke: '#000000'
    },
    
    // Macromolecule (proteins, nucleic acids, complex polysaccharides)
    macromolecule: {
      shape: 'roundedRectangle',
      cornerRadius: 15,
      fill: '#8FC7E8',
      stroke: '#0F4C81'
    },
    
    // Simple Chemical (small molecules, metabolites)
    simpleChemical: {
      shape: 'circle',
      fill: '#EEEEEE',
      stroke: '#666666'
    },
    
    // Complex (physical assemblies of molecules)
    complex: {
      shape: 'octagon',
      fill: '#F1948A',
      stroke: '#943126'
    },
    
    // Nucleic Acid Feature (DNA, RNA, or fragments)
    nucleicAcidFeature: {
      shape: 'bottomRoundedRectangle',
      fill: '#C39BD3',
      stroke: '#7D3C98'
    },
    
    // Compartment (cellular component or location)
    compartment: {
      fill: 'transparent',
      fillOpacity: 0.1,
      stroke: '#999999',
      dashArray: '5,3'
    }
  };
  
  // SBGN specific arc (connection) styles
  const sbgnArcStyles = {
    // Consumption arc (entity is consumed by process)
    consumption: {
      stroke: '#000000',
      strokeWidth: 2,
      arrowHead: 'none'
    },
    
    // Production arc (entity is produced by process)
    production: {
      stroke: '#000000',
      strokeWidth: 2,
      arrowHead: 'triangle'
    },
    
    // Catalysis arc (entity catalyzes process)
    catalysis: {
      stroke: '#000000',
      strokeWidth: 2,
      arrowHead: 'circle'
    },
    
    // Inhibition arc (entity inhibits process)
    inhibition: {
      stroke: '#000000',
      strokeWidth: 2,
      arrowHead: 'bar'
    },
    
    // Stimulation arc (entity stimulates process)
    stimulation: {
      stroke: '#000000',
      strokeWidth: 2,
      arrowHead: 'arrow'
    }
  };
  
  // Export default configuration and SBGN specific styles
  module.exports = {
    defaultConfig,
    sbgnEntityStyles,
    sbgnArcStyles
  };