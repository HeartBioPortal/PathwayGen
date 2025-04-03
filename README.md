<<<<<<< HEAD
# PathwayGen

PathwayGen is a JavaScript library for generating interactive metabolic pathway diagrams with SVG. It specializes in creating visual representations of biochemical pathways, including compounds, enzymes, and their relationships.


## Features

- 🔄 Dynamic pathway visualization
- 🎯 Customizable node and enzyme representations
- 🎨 Configurable markers (P/O indicators)
- ↔️ Automatic arrow and connection routing
- 📐 Flexible layout system
- 🎯 Interactive elements with hover effects
- 📱 Responsive SVG output
=======
# SBGN Pathway Visualization

A JavaScript library for visualizing biological pathways using the Systems Biology Graphical Notation (SBGN) standard. This package generates SVG visualizations of metabolic pathways, signaling networks, and other biological processes.

## Features

- SBGN-compliant pathway visualization
- SVG-based rendering for high-quality graphics
- Customizable themes and styles
- Support for various node types (metabolites, proteins, genes, etc.)
- Compartment visualization for cellular localization
- Programmatic API for pathway creation
>>>>>>> f3228f5 (convert to a npm package, bug fixes and other improvements)

## Installation

```bash
<<<<<<< HEAD
npm install pathwaygen
# or
yarn add pathwaygen
```

## Quick Start

```javascript
import { PathwayGenerator } from 'pathwaygen';

// Create a new generator instance
const generator = new PathwayGenerator({
    width: 600,
    height: 800
});

// Define your pathway data
const data = {
    nodes: [
        {
            id: "node1",
            label: "5-aza",
            marks: [
                { type: "P" },
                { type: "O" },
                { type: null },  // Empty circle
                { type: "P" }
            ],
            enzymes: [
                { 
                    id: "enzyme1", 
                    label: "UCK",
                    marker: { type: "P" }
                },
                { 
                    id: "enzyme2", 
                    label: "UCK",
                    marker: { type: null }
                }
            ]
        },
        // ... more nodes
    ]
};

// Generate the SVG
const svg = generator.generateSVG(data);
```

## Configuration

The PathwayGenerator accepts the following configuration options:

```javascript
const config = {
    nodeWidth: 180,        // Width of compound nodes
    nodeHeight: 60,        // Height of compound nodes
    verticalSpacing: 120,  // Vertical space between nodes
    horizontalSpacing: 140,// Horizontal space for enzyme boxes
    enzymeBoxSize: 60,     // Size of enzyme boxes
    intermediateBoxSize: 20,// Size of intermediate squares
    width: 600,           // Total SVG width
    height: 800,          // Total SVG height
    markerRadius: 8       // Radius of P/O markers
};
```

## Data Structure

### Node Definition
```javascript
{
    id: "unique-id",
    label: "Compound Name",
    marks: [
        { type: "P" },    // Top left
        { type: "O" },    // Top right
        { type: "P" },    // Bottom left
        { type: "O" }     // Bottom right
    ],
    enzymes: [
        {
            id: "enzyme-id",
            label: "Enzyme Name",
            marker: { type: "P" }  // Optional marker
        }
    ]
}
```

### Marker Types
- `{ type: "P" }` - Yellow circle with "P"
- `{ type: "O" }` - Red circle with "O"
- `{ type: null }` - Empty white circle

## Vue Integration

For Vue.js applications, use the provided component:

```vue
<template>
    <PathwayDiagram 
        :data="pathwayData"
        :config="config"
        :show-controls="true"
    />
</template>

<script>
import { PathwayDiagram } from 'pathwaygen/vue';

export default {
    components: { PathwayDiagram }
    // ...
};
</script>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU Affero General Public License - see the [LICENSE](https://github.com/HeartBioPortal/PathwayGen/blob/main/LICENCE) file for details.
=======
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
    // Node definitions
  ],
  compartments: [
    // Compartment definitions
  ]
};

// Generate SVG
const svg = pathway.generateSVG(data);
```

## Documentation

For full documentation, see the [docs](./docs/) directory.

## Examples

Check out the [examples](./examples/) directory for usage examples.

## License

MIT
>>>>>>> f3228f5 (convert to a npm package, bug fixes and other improvements)
