/**
 * Example of a metabolic pathway using SBGN notation
 * Glycolysis pathway with some regulatory elements
 */


module.exports = {
    // Pathway nodes
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
            sbgnClass: "production",
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
            sbgnClass: "production",
            enzymes: [
              {
                id: "pgi",
                label: "PGI",
                marker: { type: "P" }
              }
            ]
          },
          {
            targetId: "6pgd",
            type: "branch",
            angle: 35,
            length: 200,
            sbgnClass: "production",
            enzymes: [
              {
                id: "g6pd",
                label: "G6PDH",
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
        ],
        connections: [
          {
            targetId: "f16bp",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              { 
                id: "pfk",
                label: "PFK-1",
                marker: { type: "P" }
              }
            ],
            intermediateElement: {
              type: "process",
              label: "Phosphorylation"
            }
          }
        ]
      },
      {
        id: "f16bp",
        label: "Fructose-1,6-Bisphosphate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "P" },
          { type: "O" },
          { type: null }
        ],
        connections: [
          {
            targetId: "gap",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              {
                id: "aldolase",
                label: "Aldolase",
                marker: { type: null }
              }
            ]
          }
        ]
      },
      {
        id: "gap",
        label: "Glyceraldehyde-3-Phosphate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "bpg",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              {
                id: "gapdh",
                label: "GAPDH",
                marker: { type: "O" }
              }
            ]
          }
        ]
      },
      {
        id: "bpg",
        label: "1,3-Bisphosphoglycerate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "P" },
          { type: "O" },
          { type: null }
        ],
        connections: [
          {
            targetId: "3pg",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              {
                id: "pgk",
                label: "PGK",
                marker: { type: null }
              }
            ]
          }
        ]
      },
      {
        id: "3pg",
        label: "3-Phosphoglycerate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "2pg",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              {
                id: "pgm",
                label: "PGM",
                marker: { type: null }
              }
            ]
          }
        ]
      },
      {
        id: "2pg",
        label: "2-Phosphoglycerate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "pep",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              {
                id: "enolase",
                label: "Enolase",
                marker: { type: null }
              }
            ]
          }
        ]
      },
      {
        id: "pep",
        label: "Phosphoenolpyruvate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "pyruvate",
            type: "main",
            sbgnClass: "production",
            enzymes: [
              {
                id: "pk",
                label: "Pyruvate Kinase",
                marker: { type: null }
              }
            ]
          }
        ]
      },
      {
        id: "pyruvate",
        label: "Pyruvate",
        entityType: "simpleChemical",
        marks: [
          { type: "O" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "lactate",
            type: "branch",
            angle: -35,
            length: 180,
            sbgnClass: "production",
            enzymes: [
              {
                id: "ldh",
                label: "LDH",
                marker: { type: "O" }
              }
            ]
          },
          {
            targetId: "acetylcoa",
            type: "branch",
            angle: 35,
            length: 180,
            sbgnClass: "production",
            enzymes: [
              {
                id: "pdhc",
                label: "PDHC",
                marker: { type: "O" }
              }
            ]
          }
        ]
      },
      {
        id: "lactate",
        label: "Lactate",
        entityType: "simpleChemical",
        marks: [
          { type: "O" },
          { type: "O" },
          { type: null },
          { type: null }
        ]
      },
      {
        id: "acetylcoa",
        label: "Acetyl-CoA",
        entityType: "simpleChemical",
        marks: [
          { type: "S" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "tca",
            type: "main",
            sbgnClass: "production",
            intermediateElement: {
              type: "process",
              label: "TCA Cycle"
            }
          }
        ]
      },
      {
        id: "tca",
        label: "TCA Cycle",
        entityType: "process",
      },
      {
        id: "6pgd",
        label: "6-Phosphogluconate",
        entityType: "simpleChemical",
        marks: [
          { type: "P" },
          { type: "O" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "ppp",
            type: "main",
            sbgnClass: "production",
            intermediateElement: {
              type: "process",
              label: "Pentose Phosphate Pathway"
            }
          }
        ]
      },
      {
        id: "ppp",
        label: "Pentose Phosphate Pathway",
        entityType: "process"
      }
    ],
    
    // Cellular compartments
    compartments: [
      {
        id: "cytosol",
        label: "Cytosol",
        y: 0,
        color: "#E2E8F0",
        strokeWidth: 3,
        intersectNodes: ["glucose"]
      },
      {
        id: "mitochondria",
        label: "Mitochondrion",
        y: 700,
        color: "#FEB2B2",
        strokeWidth: 3,
        intersectNodes: ["acetylcoa"]
      }
    ],
    
    // Pathway configuration
    config: {
      width: 800,
      height: 1600,
      nodeWidth: 180,
      nodeHeight: 70,
      verticalSpacing: 140,
      horizontalSpacing: 160,
      styles: {
        node: {
          fill: "#f5f5f5",
          stroke: "#2a4365",
          strokeWidth: 2
        },
        enzyme: {
          fill: "#ffffff",
          stroke: "#2a4365",
          strokeWidth: 1.5
        },
        marker: {
          colors: {
            P: "#ffd700",  // Phosphate - gold
            O: "#ff6b6b",  // Oxygen - red
            S: "#4CAF50",  // Sulfur - green
            N: "#2196F3"   // Nitrogen - blue
          }
        }
      }
    }
  };