/**
 * Example of creating and applying a custom theme
 * Demonstrates how to customize the visual appearance of pathway elements
 */

const { SBGNPathway } = require('../src');
const { metabolicPathway } = require('./metabolicPathway');

// Create a new pathway instance
const pathway = new SBGNPathway();

// Define a custom theme
const modernTheme = {
  name: 'Modern',
  description: 'A clean, modern theme with rounded corners and gradient fills',
  styles: {
    // Node styles
    node: {
      fill: 'url(#nodeGradient)',  // Use gradient fill
      stroke: '#3182CE',
      strokeWidth: 2,
      cornerRadius: 10,            // Rounded corners
      dropShadow: true,            // Enable drop shadow
      labelFontFamily: 'Arial, sans-serif',
      labelFontSize: 12,
      labelFontWeight: 'bold'
    },
    
    // Connection styles
    connection: {
      stroke: '#4A5568',
      strokeWidth: 2,
      curve: 'curved',             // Use curved connections
      arrowSize: 12
    },
    
    // Enzyme styles
    enzyme: {
      fill: 'url(#enzymeGradient)', // Use gradient fill
      stroke: '#3182CE',
      strokeWidth: 1.5,
      cornerRadius: 8,              // Rounded corners
      labelFontSize: 10
    },
    
    // Marker styles
    marker: {
      colors: {
        P: '#F6AD55',  // Phosphate - orange
        O: '#FC8181',  // Oxygen - coral
        S: '#68D391',  // Sulfur - green
        N: '#63B3ED'   // Nitrogen - blue
      },
      fontSize: 9,
      fontWeight: 'bold'
    },
    
    // Compartment styles
    compartment: {
      defaultColor: '#4A5568',
      strokeOpacity: 0.6,
      fontWeight: 'bold',
      fontSize: 14
    },
    
    // DNA styles
    dna: {
      strand1Color: '#63B3ED',
      strand2Color: '#B794F4',
      strokeWidth: 2.5,
      waveHeight: 20,
      waveCount: 3
    },
    
    // RNA styles
    rna: {
      strandColor: '#F6AD55',
      strokeWidth: 2.5,
      waveHeight: 15,
      waveCount: 4
    }
  }
};

// Register the custom theme
pathway.themeManager.registerTheme('modern', modernTheme);

// Apply the custom theme
pathway.applyTheme('modern');

// Generate SVG with the custom theme
const modernSvg = pathway.generateSVG(metabolicPathway);

// Now try a built-in theme
pathway.applyTheme('colorful');
const colorfulSvg = pathway.generateSVG(metabolicPathway);

// Try another built-in theme
pathway.applyTheme('blueprint');
const blueprintSvg = pathway.generateSVG(metabolicPathway);

// Log the available themes
console.log('Available themes:');
const themes = pathway.themeManager.listThemes();
themes.forEach(theme => {
  console.log(`- ${theme.name}: ${theme.description} (${theme.isCustom ? 'Custom' : 'Built-in'})`);
});

// Export the modern theme for reuse
module.exports = {
  modernTheme
};