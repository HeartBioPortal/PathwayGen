# PathwayGen

A JavaScript library for visualizing biological pathways using the Systems Biology Graphical Notation (SBGN) standard. This package generates SVG visualizations of metabolic pathways, signaling networks, and other biological processes with precise semantic meanings.

## Overview

PathwayGen is a comprehensive toolkit for creating, manipulating, and rendering biological pathway diagrams that adhere to the Systems Biology Graphical Notation (SBGN) standard. SBGN provides a standardized way to represent biological networks, allowing researchers and scientists to communicate complex biological information in a precise and unambiguous way.

The library implements the SBGN Process Description (PD) language, which shows the temporal courses of biochemical interactions in a network, including molecular interactions, state transitions, and catalytic influences while maintaining the well-defined semantics that offer precision in expressing biological knowledge.

## Features

- **SBGN-compliant visualization**: Generate diagrams that follow the SBGN standard
- **SVG-based rendering**: High-quality, scalable graphics for publications and presentations
- **Multiple diagram types**: Support for process diagrams, entity relationship diagrams, and activity flows
- **Rich node types**: Metabolites, proteins, genes, complexes, compartments, and more
- **Comprehensive connection types**: Consumption, production, catalysis, inhibition, and stimulation
- **Customizable themes**: Multiple built-in themes and support for custom visual styles
- **Interactive capabilities**: Support for zoom, pan, tooltips, and highlighting
- **Compartment visualization**: Represent cellular locations and boundaries
- **Modular architecture**: Easily extensible for custom visualization needs
- **OOP design**: Well-structured object-oriented architecture

## Installation

```bash
npm install pathway-gen
```

## Basic Usage

```javascript
const { SBGNPathway } = require('pathway-gen');

// Create a new pathway visualization
const pathway = new SBGNPathway();

// Define your pathway data
const data = {
  nodes: [
    {
      id: "glucose",
      label: "Glucose",
      entityType: "simpleChemical",
      marks: [
        { type: "P" },
        { type: "O" }
      ],
      connections: [
        {
          targetId: "g6p",
          type: "main",
          enzymes: [
            { 
              label: "Hexokinase",
              marker: { type: "P" }
            }
          ]
        }
      ]
    },
    {
      id: "g6p",
      label: "Glucose-6-Phosphate",
      entityType: "simpleChemical",
      marks: [
        { type: "P" },
        { type: "P" },
        { type: "O" }
      ]
    }
  ],
  compartments: [
    {
      id: "cytosol",
      label: "Cytosol",
      y: 0,
      color: "#E2E8F0",
      intersectNodes: ["glucose"]
    }
  ]
};

// Generate SVG
const svg = pathway.generateSVG(data);
```

## SBGN Languages

This library primarily implements the SBGN Process Description (PD) language, which shows the temporal courses of biochemical interactions in a network and can be used to show molecular interactions taking place in a network of biochemical entities. 

SBGN consists of three complementary languages that provide different views of biological systems:

1. **Process Description (PD)**: Shows the temporal courses of biochemical interactions
2. **Entity Relationship (ER)**: Shows the relationships in which entities participate, regardless of temporal aspects
3. **Activity Flow (AF)**: Depicts the flow of information between biochemical entities in a network

## Advanced Usage

### Applying Themes

```javascript
// Use a built-in theme
pathway.applyTheme('scientific');
const scientificSvg = pathway.generateSVG(data);

// Apply a custom theme
const customTheme = {
  name: 'Custom Theme',
  description: 'My custom visualization theme',
  styles: {
    node: {
      fill: '#F7FAFC',
      stroke: '#4A5568',
      strokeWidth: 2,
      cornerRadius: 8
    },
    // Additional style properties...
  }
};

pathway.themeManager.registerTheme('custom', customTheme);
pathway.applyTheme('custom');
const customSvg = pathway.generateSVG(data);
```

### Programmatic Creation

```javascript
// Create nodes and connections programmatically
const node1 = pathway.createNode({
  id: "atp",
  label: "ATP",
  entityType: "simpleChemical"
});

const node2 = pathway.createNode({
  id: "adp",
  label: "ADP",
  entityType: "simpleChemical"
});

// Create a connection
const connection = pathway.createConnection({
  targetId: "adp",
  type: "main"
});

// Add connection to node
node1.addConnection(connection);

// Create pathway data
const programmaticData = {
  nodes: [node1.toObject(), node2.toObject()],
  compartments: []
};

// Generate SVG
const programmaticSvg = pathway.generateSVG(programmaticData);
```

## Examples

Check out the `examples` directory for more detailed usage examples:

- `basic.js`: Simple pathway with minimal configuration
- `metabolicPathway.js`: Glycolysis pathway with enzymes and compartments
- `signalPathway.js`: MAPK/ERK signaling cascade with receptors and transcription factors
- `customTheme.js`: Creating and applying custom visualization themes

## Documentation

For detailed API documentation, see the `docs` directory:

- `api.md`: Complete API reference
- `sbgn-reference.md`: SBGN standard reference
- `theming.md`: Theming and styling guide

## SBGN Resources

For more information about the SBGN standard:

- [SBGN Website](https://sbgn.github.io/)
- [SBGN Process Description Specification](https://sbgn.github.io/specifications)
- [Learning SBGN](https://sbgn.github.io/learning)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.