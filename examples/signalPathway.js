/**
 * Example of a signal transduction pathway using SBGN notation
 * MAPK/ERK signaling pathway with receptors, kinases, and transcription factors
 */

module.exports = {
    // Pathway nodes
    nodes: [
      // Cell surface receptor
      {
        id: "egfr",
        label: "EGFR",
        entityType: "macromolecule",
        marks: [
          { type: "P" },
          { type: null },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "grb2",
            type: "main",
            sbgnClass: "stimulation",
            intermediateElement: {
              type: "process",
              label: "Activation"
            }
          }
        ],
        style: {
          fill: "#FEFCBF"
        }
      },
      
      // Adapter protein
      {
        id: "grb2",
        label: "GRB2",
        entityType: "macromolecule",
        connections: [
          {
            targetId: "sos",
            type: "main",
            sbgnClass: "stimulation"
          }
        ]
      },
      
      // GEF protein
      {
        id: "sos",
        label: "SOS",
        entityType: "macromolecule",
        connections: [
          {
            targetId: "ras",
            type: "main",
            sbgnClass: "stimulation",
            intermediateElement: {
              type: "process",
              label: "GEF activity"
            }
          }
        ]
      },
      
      // Small GTPase
      {
        id: "ras",
        label: "RAS",
        entityType: "macromolecule",
        marks: [
          { type: null },
          { type: null },
          { type: "P" },
          { type: null }
        ],
        connections: [
          {
            targetId: "raf",
            type: "main",
            sbgnClass: "stimulation"
          }
        ],
        style: {
          fill: "#BEE3F8"
        }
      },
      
      // MAPKKK
      {
        id: "raf",
        label: "RAF",
        entityType: "macromolecule",
        marks: [
          { type: "P" },
          { type: null },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "mek",
            type: "main",
            sbgnClass: "stimulation",
            enzymes: [
              {
                id: "raf_kinase",
                label: "Kinase",
                marker: { type: "P" }
              }
            ]
          }
        ]
      },
      
      // MAPKK
      {
        id: "mek",
        label: "MEK",
        entityType: "macromolecule",
        marks: [
          { type: "P" },
          { type: "P" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "erk",
            type: "main",
            sbgnClass: "stimulation",
            enzymes: [
              {
                id: "mek_kinase",
                label: "Kinase",
                marker: { type: "P" }
              }
            ]
          }
        ]
      },
      
      // MAPK
      {
        id: "erk",
        label: "ERK",
        entityType: "macromolecule",
        marks: [
          { type: "P" },
          { type: "P" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "rsk",
            type: "branch",
            angle: -35,
            length: 180,
            sbgnClass: "stimulation"
          },
          {
            targetId: "nucleus",
            type: "branch",
            angle: 35,
            length: 180,
            sbgnClass: "stimulation"
          }
        ]
      },
      
      // Cytoplasmic target
      {
        id: "rsk",
        label: "RSK",
        entityType: "macromolecule",
        marks: [
          { type: "P" },
          { type: null },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "cytoplasmic_effect",
            type: "main",
            sbgnClass: "stimulation"
          }
        ]
      },
      
      {
        id: "cytoplasmic_effect",
        label: "Translation",
        entityType: "process"
      },
      
      // Nuclear translocation
      {
        id: "nucleus",
        label: "Nuclear ERK",
        entityType: "macromolecule",
        marks: [
          { type: "P" },
          { type: "P" },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "elk1",
            type: "main",
            sbgnClass: "stimulation"
          }
        ]
      },
      
      // Transcription factor
      {
        id: "elk1",
        label: "ELK1",
        entityType: "nucleicAcidFeature",
        marks: [
          { type: "P" },
          { type: null },
          { type: null },
          { type: null }
        ],
        connections: [
          {
            targetId: "gene_expression",
            type: "main",
            sbgnClass: "stimulation"
          }
        ]
      },
      
      // Gene expression
      {
        id: "gene_expression",
        label: "Gene Expression",
        entityType: "process",
        connections: [
          {
            targetId: "dna",
            type: "main",
            sbgnClass: "stimulation"
          }
        ]
      },
      
      // DNA
      {
        id: "dna",
        label: "Target Genes",
        type: "DNA"
      }
    ],
    
    // Cellular compartments
    compartments: [
      {
        id: "plasma_membrane",
        label: "Plasma Membrane",
        y: 50,
        color: "#A0AEC0",
        strokeWidth: 3,
        intersectNodes: ["egfr"]
      },
      {
        id: "cytoplasm",
        label: "Cytoplasm",
        y: 300,
        color: "#E2E8F0",
        strokeWidth: 3,
        intersectNodes: ["grb2"]
      },
      {
        id: "nuclear_membrane",
        label: "Nuclear Membrane",
        y: 700,
        color: "#FEB2B2",
        strokeWidth: 3,
        intersectNodes: ["nucleus"]
      }
    ],
    
    // Pathway configuration
    config: {
      width: 800,
      height: 1600,
      nodeWidth: 140,
      nodeHeight: 60,
      verticalSpacing: 120,
      horizontalSpacing: 140,
      styles: {
        node: {
          fill: "#F7FAFC",
          stroke: "#4A5568",
          strokeWidth: 2,
          cornerRadius: 8
        },
        connection: {
          stroke: "#4A5568",
          strokeWidth: 1.5,
          curve: "curved"
        },
        marker: {
          colors: {
            P: "#F6AD55",  // Phosphate - orange
            O: "#FC8181",  // Oxygen - coral
            S: "#68D391",  // Sulfur - green
            N: "#63B3ED"   // Nitrogen - blue
          },
          fontSize: 9,
          fontWeight: "bold"
        }
      }
    }
  };