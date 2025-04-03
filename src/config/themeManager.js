class ThemeManager {
    /**
     * Create a new theme manager
     */
    constructor() {
      this.themes = {...themes};
      this.customThemes = {};
    }
  
    /**
     * Get a theme by name
     * @param {string} themeName - Name of the theme
     * @returns {Object} Theme object
     */
    getTheme(themeName) {
      // Check built-in themes first
      if (this.themes[themeName]) {
        return this.themes[themeName];
      }
      
      // Then check custom themes
      if (this.customThemes[themeName]) {
        return this.customThemes[themeName];
      }
      
      // If theme not found, return default
      console.warn(`Theme "${themeName}" not found, using default theme.`);
      return this.themes.default;
    }
  
    /**
     * Register a custom theme
     * @param {string} themeName - Name of the custom theme
     * @param {Object} themeConfig - Theme configuration
     */
    registerTheme(themeName, themeConfig) {
      this.customThemes[themeName] = {
        name: themeConfig.name || themeName,
        description: themeConfig.description || `Custom theme: ${themeName}`,
        styles: themeConfig.styles || {}
      };
      
      return this;
    }
  
    /**
     * List all available themes
     * @returns {Array} Array of theme objects with name and description
     */
    listThemes() {
      const builtInThemes = Object.keys(this.themes).map(key => ({
        id: key,
        name: this.themes[key].name,
        description: this.themes[key].description,
        isCustom: false
      }));
      
      const userThemes = Object.keys(this.customThemes).map(key => ({
        id: key,
        name: this.customThemes[key].name,
        description: this.customThemes[key].description,
        isCustom: true
      }));
      
      return [...builtInThemes, ...userThemes];
    }
  }
  
  /**
   * Theme manager for SBGN Pathway Visualization
   * Provides predefined themes and custom theme management
   */
  
  // Predefined themes
  const themes = {
    // Default theme (light)
    default: {
      name: 'Default',
      description: 'Default light theme',
      styles: {
        // Default styles are already set in defaultConfig.js
      }
    },
    
    // Dark theme
    dark: {
      name: 'Dark',
      description: 'Dark theme for pathway visualization',
      styles: {
        node: {
          fill: '#2D3748',
          stroke: '#E2E8F0',
          strokeWidth: 2
        },
        connection: {
          stroke: '#A0AEC0',
          strokeWidth: 2
        },
        enzyme: {
          fill: '#2D3748',
          stroke: '#E2E8F0'
        },
        marker: {
          colors: {
            P: '#FFD700',
            O: '#FC8181',
            S: '#68D391',
            N: '#90CDF4'
          }
        },
        dna: {
          strand1Color: '#90CDF4',
          strand2Color: '#D6BCFA'
        },
        rna: {
          strandColor: '#ED8936'
        }
      }
    },
    
    // Blueprint theme
    blueprint: {
      name: 'Blueprint',
      description: 'Technical blueprint style theme',
      styles: {
        node: {
          fill: '#EBF8FF',
          stroke: '#2B6CB0',
          strokeWidth: 1.5,
          labelFontFamily: 'Courier New, monospace'
        },
        connection: {
          stroke: '#2B6CB0',
          strokeWidth: 1.5,
          dashArray: '5,3'
        },
        enzyme: {
          fill: '#E6FFFA',
          stroke: '#2B6CB0',
          strokeWidth: 1.5
        },
        compartment: {
          defaultColor: '#4299E1',
          strokeOpacity: 0.5
        }
      }
    },
    
    // Scientific publication theme
    scientific: {
      name: 'Scientific',
      description: 'Clean theme suitable for scientific publications',
      styles: {
        node: {
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeWidth: 1,
          labelFontFamily: 'Arial, sans-serif',
          labelFontSize: 10,
          innerStroke: false
        },
        connection: {
          stroke: '#000000',
          strokeWidth: 1,
          arrowSize: 8
        },
        enzyme: {
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeWidth: 1,
          labelFontSize: 9
        },
        marker: {
          colors: {
            P: '#000000',
            O: '#000000',
            S: '#000000',
            N: '#000000'
          },
          fontWeight: 'normal',
          fontSize: 9
        },
        compartment: {
          defaultColor: '#000000',
          strokeOpacity: 0.3,
          fontWeight: 'normal',
          fontSize: 10
        }
      }
    },
    
    // Colorful theme for presentations
    colorful: {
      name: 'Colorful',
      description: 'Vibrant colorful theme for presentations',
      styles: {
        node: {
          fill: '#FFFFFF',
          stroke: '#805AD5',
          strokeWidth: 3,
          dropShadow: true
        },
        connection: {
          stroke: '#3182CE',
          strokeWidth: 2.5,
          curve: 'curved'
        },
        enzyme: {
          fill: '#FED7E2',
          stroke: '#D53F8C',
          strokeWidth: 2,
          cornerRadius: 10
        },
        marker: {
          colors: {
            P: '#F6E05E',
            O: '#F56565',
            S: '#48BB78',
            N: '#4299E1'
          },
          fontSize: 12
        },
        dna: {
          strand1Color: '#4FD1C5',
          strand2Color: '#B794F4',
          strokeWidth: 3
        },
        rna: {
          strandColor: '#F6AD55',
          strokeWidth: 3
        }
      }
    }
}

module.exports = { ThemeManager, themes };
  