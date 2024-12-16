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

## Installation

```bash
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

This project is licensed under the GNU Affero General Public License - see the [LICENSE](LICENSE) file for details.
