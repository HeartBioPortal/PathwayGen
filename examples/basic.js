/**
 * Basic example of using SBGN Pathway Visualization
 */

const { SBGNPathway } = require('../src');

// Create a simple pathway
const pathway = new SBGNPathway();

// Define pathway data
const data = {
  nodes: [
    {
      id: "glucose",
      label: "Glucose",
      entityType: "simpleChemical",
      marks: [
        { type: "P" },
        { type: "O" },
        { type: null },
        { type: null }
      ],
      connections: [
        {
          targetId: "g6p",
          type: "main",
          enzymes: [
            { 
              id: "hexokinase",
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
        { type: "O" },
        { type: null }
      ],
      connections: [
        {
          targetId: "f6p",
          type: "main",
          enzymes: [
            {
              id: "pgi",
              label: "PGI",
              marker: { type: "P" }
            }
          ]
        }
      ]
    },
    {
      id: "f6p",
      label: "Fructose-6-Phosphate",
      entityType: "simpleChemical",
      marks: [
        { type: "P" },
        { type: "O" },
        { type: null },
        { type: "P" }
      ]
    }
  ],
  
  compartments: [
    {
      id: "cell",
      label: "Cell",
      y: 0,
      color: "#E2E8F0",
      strokeWidth: 2,
      intersectNodes: ["glucose"]
    }
  ]
};

// Generate SVG
const svg = pathway.generateSVG(data);

// Print SVG to console or save to file
console.log(svg);

// Example of using a different theme
pathway.applyTheme('scientific');
const scientificSvg = pathway.generateSVG(data);

// Example of programmatically creating a pathway
const programmaticData = {
  nodes: [],
  compartments: []
};

// Create nodes and connections
const node1 = pathway.createNode({
  id: "node1",
  label: "Starting Compound",
  entityType: "simpleChemical"
});

const node2 = pathway.createNode({
  id: "node2",
  label: "Intermediate",
  entityType: "simpleChemical"
});

const node3 = pathway.createNode({
  id: "node3",
  label: "Product",
  entityType: "simpleChemical"
});

// Create connections
const connection1 = pathway.createConnection({
  targetId: "node2",
  type: "main",
  enzymes: [
    { label: "Enzyme A" }
  ]
});

const connection2 = pathway.createConnection({
  targetId: "node3",
  type: "main",
  enzymes: [
    { label: "Enzyme B" }
  ]
});

// Add connections to nodes
node1.addConnection(connection1);
node2.addConnection(connection2);

// Add nodes to data
programmaticData.nodes.push(node1.toObject());
programmaticData.nodes.push(node2.toObject());
programmaticData.nodes.push(node3.toObject());

// Generate SVG for programmatically created pathway
const programmaticSvg = pathway.generateSVG(programmaticData);

// Log results
console.log('Basic SVG generated');
console.log('Scientific theme SVG generated');
console.log('Programmatic SVG generated');

module.exports = data;