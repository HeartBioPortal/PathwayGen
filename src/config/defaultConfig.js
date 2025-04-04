/**
 * Default configuration for SBGN Pathway Visualization
 * Based on SBGN standards and best practices for biological pathway visualization
 */

const defaultConfig = {
    // Layout configuration
    layout: {
      width: 800,
      height: 1600,
      nodeWidth: 180,
      nodeHeight: 70,  // Increased height for better text fitting
      verticalSpacing: 120,
      horizontalSpacing: 140,
      enzymeBoxSize: 60,
      intermediateBoxSize: 20,
      markerRadius: 8,
      defaultBranchAngle: 30,
      defaultBranchLength: 200,
      padding: 20,
      autoResize: true,
    },
    
    // Compartment configuration
    compartments: {
      lineSpacing: 10,
      labelOffset: 30,
      curveControl: 50,
      opacity: 0.3,
      borderRadius: 10,
    },
    
    // Styles for different elements
    styles: {
      // Node styles
      node: {
        fill: '#FFFFFF',
        stroke: '#333333',
        strokeWidth: 2,
        className: 'sbgn-node cursor-pointer hover:stroke-blue-500',
        labelFontSize: 12,
        labelFontFamily: 'Arial, sans-serif',
        labelFontWeight: 'normal',
        cornerRadius: 0,
        dropShadow: false,
        innerStroke: true,
      },
      
      // Connection styles
      connection: {
        stroke: '#333333',
        strokeWidth: 2,
        className: 'sbgn-connection',
        dashArray: '',
        arrowSize: 10,
        curve: 'linear',
        labelFontSize: 10,
        labelDistance: 10,
      },
      
      // Enzyme styles
      enzyme: {
        fill: '#FFFFFF',
        stroke: '#333333',
        strokeWidth: 2,
        className: 'sbgn-enzyme cursor-pointer hover:stroke-blue-500',
        labelFontSize: 10,
        cornerRadius: 0,
      },
      
      // Marker styles
      marker: {
        colors: {
          P: '#FFD700', // phosphate - gold
          O: '#FF4444', // oxygen - red
          S: '#33CC33', // sulfur - green
          N: '#6666FF'  // nitrogen - blue
        },
        fontWeight: 'bold',
        fontSize: 10,
      },
      
      // Compartment styles
      compartment: {
        defaultColor: '#CCCCCC',
        strokeOpacity: 0.8,
        fontWeight: 'bold',
        fontSize: 14,
      },
      
      // DNA styles
      dna: {
        strand1Color: '#4299E1',
        strand2Color: '#805AD5',
        strokeWidth: 2,
        waveHeight: 20,
        waveCount: 3,
      },
      
      // RNA styles
      rna: {
        strandColor: '#C05621',
        strokeWidth: 2,
        waveHeight: 15,
        waveCount: 4,
      },
    },
    
    // Animation configuration
    animation: {
      enabled: false,
      duration: 500,
      easing: 'ease-in-out',
    },
    
    // Interaction configuration
    interaction: {
      enableZoom: true,
      enablePan: true,
      enableTooltips: true,
      enableHighlight: true,
      highlightColor: '#3182CE',
      highlightOpacity: 0.3,
      tooltipDelay: 500,
    }
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