// pathway-generator.js

export class PathwayGenerator {
  constructor(config = {}) {
      this.config = {
        nodeWidth: config.nodeWidth || 180,
        nodeHeight: config.nodeHeight || 60,
        verticalSpacing: config.verticalSpacing || 120,
        horizontalSpacing: config.horizontalSpacing || 140,
        enzymeBoxSize: config.enzymeBoxSize || 60,
        intermediateBoxSize: config.intermediateBoxSize || 20,
        width: config.width || 800,  // Increased to accommodate branches
        height: 1200,
        markerRadius: config.markerRadius || 8,
        branchAngle: config.branchAngle || 30  // Angle for branch divergence
      };
    }
  
    calculateBranchEndpoint(startX, startY, angle, length) {
      const radians = (angle * Math.PI) / 180;
      return {
        x: startX + length * Math.sin(radians),
        y: startY + length * Math.cos(radians)
      };
    }
    
      calculatePositions(nodes) {
          const positions = new Map();
          
          nodes.forEach((node, index) => {
            const centerX = this.config.width / 2;
            const centerY = this.config.verticalSpacing + (index * this.config.verticalSpacing * 2);
            
            positions.set(node.id, {
              x: centerX,
              y: centerY
            });
            
            // Handle branches
            if (node.branches) {
              node.branches.forEach((branch, branchIndex) => {
                const isRightSide = node.branches.length === 1 || branchIndex === 0;
                const angle = branch.angle || (branchIndex % 2 === 0 ? this.config.branchAngle : -this.config.branchAngle);
                const length = branch.length || this.config.verticalSpacing * 1.5;
                
                // Calculate branch end position
                const endPoint = this.calculateBranchEndpoint(centerX, centerY, angle, length);
                positions.set(`${node.id}-branch-${branchIndex}`, endPoint);
                
                // Calculate intermediate square position (middle of branch)
                const midPoint = this.calculateBranchEndpoint(centerX, centerY, angle, length / 2);
                positions.set(`${node.id}-branch-${branchIndex}-intermediate`, midPoint);
                
                // Calculate enzyme positions - all on the appropriate side
                if (branch.enzymes) {
                  branch.enzymes.forEach((enzyme, eIdx) => {
                    // Determine side based on branch position
                    const sideMultiplier = isRightSide ? 1 : -1;
                    const enzymeOffset = this.config.horizontalSpacing / 2;
                    
                    // Position enzymes vertically stacked on the appropriate side
                    const enzymeX = midPoint.x + (sideMultiplier * enzymeOffset * 2);
                    const enzymeY = midPoint.y + (eIdx * 60 - 30); // Stack vertically around midpoint
                    
                    positions.set(`${node.id}-branch-${branchIndex}-enzyme-${eIdx}`, {
                      x: enzymeX,
                      y: enzymeY
                    });
                  });
                }
              });
            }
        
        // Original straight path calculations...
        if (index < nodes.length - 1) {
          const nextCenterY = this.config.verticalSpacing + ((index + 1) * this.config.verticalSpacing * 2);
          positions.set(`intermediate-${node.id}`, {
            x: centerX,
            y: (centerY + nextCenterY) / 2
          });
          
          if (node.enzymes) {
            const enzymeY = (centerY + nextCenterY) / 2;
            node.enzymes.forEach((enzyme, eIdx) => {
              positions.set(`${node.id}-enzyme-${eIdx}`, {
                x: centerX + this.config.horizontalSpacing * (eIdx % 2 === 0 ? 1 : -1),
                y: enzymeY + (eIdx % 2 === 0 ? -40 : 40)
              });
            });
          }
        }
      });
      
      return positions;
    }
  
    // Add this new method to generate branch paths
    generateBranchPaths(node, positions) {
      if (!node.branches) return '';
      
      return node.branches.map((branch, branchIndex) => {
        const startPos = positions.get(node.id);
        const endPos = positions.get(`${node.id}-branch-${branchIndex}`);
        const intermediatePos = positions.get(`${node.id}-branch-${branchIndex}-intermediate`);
        
        // Generate enzyme connections
        const enzymeConnections = (branch.enzymes || []).map((enzyme, eIdx) => {
          if (eIdx % 2 !== 0) return ''; // Skip odd indices to handle pairs
          
          const enzyme1Pos = positions.get(`${node.id}-branch-${branchIndex}-enzyme-${eIdx}`);
          const enzyme2Pos = positions.get(`${node.id}-branch-${branchIndex}-enzyme-${eIdx + 1}`);
          
          if (!enzyme1Pos || !enzyme2Pos) return '';
  
          // Create path from first enzyme to middle square to second enzyme
          return `
            <path
              d="M ${enzyme1Pos.x} ${enzyme1Pos.y}
                 L ${intermediatePos.x} ${intermediatePos.y}
                 L ${enzyme2Pos.x} ${enzyme2Pos.y}"
              fill="none"
              stroke="black"
              stroke-width="2"
              marker-end="url(#arrowhead)"
            />
          `;
        }).join('');
  
        return `
          <g class="branch-${branchIndex}">
            <line
              x1="${startPos.x}"
              y1="${startPos.y}"
              x2="${endPos.x}"
              y2="${endPos.y}"
              stroke="black"
              stroke-width="2"
              marker-end="url(#arrowhead)"
            />
            <rect
              x="${intermediatePos.x - this.config.intermediateBoxSize / 2}"
              y="${intermediatePos.y - this.config.intermediateBoxSize / 2}"
              width="${this.config.intermediateBoxSize}"
              height="${this.config.intermediateBoxSize}"
              fill="white"
              stroke="black"
              stroke-width="2"
            />
            ${enzymeConnections}
            ${this.generateEnzymes(branch.enzymes, positions, `${node.id}-branch-${branchIndex}`)}
          </g>
        `;
      }).join('');
  }
    generateEnzymes(enzymes, positions, nodePrefix) {
      if (!enzymes) return '';
      
      return enzymes.map((enzyme, index) => {
          const enzymePos = positions.get(`${nodePrefix}-enzyme-${index}`);
          if (!enzymePos) return '';
  
          // Calculate enzyme marker position (top left corner)
          const markerX = enzymePos.x - this.config.enzymeBoxSize/2 + 15;
          const markerY = enzymePos.y - this.config.enzymeBoxSize/2 + 15;
  
          return `
              <g>
                  <rect
                      x="${enzymePos.x - this.config.enzymeBoxSize / 2}"
                      y="${enzymePos.y - this.config.enzymeBoxSize / 2}"
                      width="${this.config.enzymeBoxSize}"
                      height="${this.config.enzymeBoxSize}"
                      fill="white"
                      stroke="black"
                      stroke-width="2"
                      class="cursor-pointer hover:stroke-blue-500"
                  />
                  <text
                      x="${enzymePos.x}"
                      y="${enzymePos.y}"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      class="text-sm font-medium"
                  >${enzyme.label}</text>
                  ${enzyme.marker ? this.renderMarker(markerX, markerY, enzyme.marker) : ''}
              </g>
          `;
      }).join('');
  }
  renderMarker(x, y, marker) {
      return `
          <g>
              <circle
                  cx="${x}"
                  cy="${y}"
                  r="${this.config.markerRadius}"
                  fill="${marker.type ? (marker.type === 'P' ? '#FFD700' : '#FF4444') : 'white'}"
                  stroke="black"
                  stroke-width="1"
              />
              ${marker.type ? `
                  <text
                      x="${x}"
                      y="${y}"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      class="text-xs font-bold"
                  >${marker.type}</text>
              ` : ''}
          </g>
      `;
  }
    generateEnzymeConnections(node, positions, intermediatePos) {
      return (node.enzymes || []).map((enzyme, eIdx) => {
          if (eIdx % 2 !== 0) return ''; // Skip odd indices to handle pairs
          
          const enzyme1Pos = positions.get(`${node.id}-enzyme-${eIdx}`);
          const enzyme2Pos = positions.get(`${node.id}-enzyme-${eIdx + 1}`);
          
          if (!enzyme1Pos || !enzyme2Pos) return '';
  
          return `
              <path
                  d="M ${enzyme1Pos.x} ${enzyme1Pos.y}
                     L ${intermediatePos.x} ${intermediatePos.y}
                     L ${enzyme2Pos.x} ${enzyme2Pos.y}"
                  fill="none"
                  stroke="black"
                  stroke-width="2"
                  marker-end="url(#arrowhead)"
              />
          `;
      }).join('');
  }
  generatePathwayElements(data) {
      const positions = this.calculatePositions(data.nodes);
  
      return {
        defs: `
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
            </marker>
          </defs>
        `,

        connections: data.nodes.map((node, index) => {
          // Skip if it's the last node
          if (index === data.nodes.length - 1) return '';
          
          const startPos = positions.get(node.id);
          const endPos = positions.get(data.nodes[index + 1].id);
          const intermediatePos = positions.get(`intermediate-${node.id}`);
      
          const mainConnections = `
              <g class="main-connection">
                  <line
                      x1="${startPos.x}"
                      y1="${startPos.y + (this.config.nodeHeight / 2)}"
                      x2="${endPos.x}"
                      y2="${endPos.y - (this.config.nodeHeight / 2)}"
                      stroke="black"
                      stroke-width="2"
                      marker-end="url(#arrowhead)"
                  />
                  <rect
                      x="${intermediatePos.x - this.config.intermediateBoxSize / 2}"
                      y="${intermediatePos.y - this.config.intermediateBoxSize / 2}"
                      width="${this.config.intermediateBoxSize}"
                      height="${this.config.intermediateBoxSize}"
                      fill="white"
                      stroke="black"
                      stroke-width="2"
                  />
                  ${this.generateEnzymeConnections(node, positions, intermediatePos)}
              </g>
          `;
      
          return `
              ${mainConnections}
              ${this.generateBranchPaths(node, positions)}
          `;
      }).join(''),

      nodes: data.nodes.map(node => {
          const pos = positions.get(node.id);
          
          // Calculate corner positions for markers on ellipses
          const corners = [
            { x: pos.x - this.config.nodeWidth/2 + 6, y: pos.y - this.config.nodeHeight/2 + 6 },
            { x: pos.x + this.config.nodeWidth/2 - 6, y: pos.y - this.config.nodeHeight/2 + 6 },
            { x: pos.x - this.config.nodeWidth/2 + 6, y: pos.y + this.config.nodeHeight/2 - 6 },
            { x: pos.x + this.config.nodeWidth/2 - 6, y: pos.y + this.config.nodeHeight/2 - 6 }
          ];
          
          const marks = (node.marks || []).map((mark, index) => 
            this.renderMarker(corners[index].x, corners[index].y, mark)
          ).join('');
  
          const enzymes = (node.enzymes || []).map((enzyme, index) => {
            const enzymePos = positions.get(`${node.id}-enzyme-${index}`);
            
            // Calculate enzyme marker position (top left corner)
            const markerX = enzymePos.x - this.config.enzymeBoxSize/2;
            const markerY = enzymePos.y - this.config.enzymeBoxSize/2 ;
  
            return `
              <g>
                <rect
                  x="${enzymePos.x - this.config.enzymeBoxSize / 2}"
                  y="${enzymePos.y - this.config.enzymeBoxSize / 2}"
                  width="${this.config.enzymeBoxSize}"
                  height="${this.config.enzymeBoxSize}"
                  fill="white"
                  stroke="black"
                  stroke-width="2"
                  class="cursor-pointer hover:stroke-blue-500"
                />
                <text
                  x="${enzymePos.x}"
                  y="${enzymePos.y}"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  class="text-sm font-medium"
                >${enzyme.label}</text>
                ${enzyme.marker ? this.renderMarker(markerX, markerY, enzyme.marker) : ''}
              </g>
            `;
          }).join('');
  
          return `
            <g>
              <ellipse
                cx="${pos.x}"
                cy="${pos.y}"
                rx="${this.config.nodeWidth / 2}"
                ry="${this.config.nodeHeight / 2}"
                fill="white"
                stroke="black"
                stroke-width="2"
                class="cursor-pointer hover:stroke-blue-500"
              />
              <text
                x="${pos.x}"
                y="${pos.y}"
                text-anchor="middle"
                dominant-baseline="middle"
                class="text-sm font-medium"
              >${node.label}</text>
              ${marks}
              ${enzymes}
            </g>
          `;
        }).join('')
      };
    }

  generateSVG(data) {
    const elements = this.generatePathwayElements(data);
    return `
      <svg 
        width="${this.config.width}" 
        height="${this.config.height}"
        class="bg-white shadow-lg rounded-lg"
      >
        ${elements.defs}
        ${elements.connections}
        ${elements.nodes}
      </svg>
    `;
  }
}

export const sampleData = {

  nodes: [
    {
      id: "node1",
      label: "5-aza",
      marks: [
        { type: "P" },    // Filled with P
        { type: "O" },    // Filled with O
        { type: null },   // Empty circle
        { type: "P" }     // Filled with P
      ],
      branches: [
          {
            angle: 45,  // Angle in degrees
            length: 200, // Optional: custom length
            enzymes: [
              { 
                id: "branch1-enzyme1", 
                label: "UCK",
                marker: { type: "P" }
              },
              { 
                id: "branch1-enzyme2", 
                label: "UCK",
                marker: { type: null }
              }
            ]
          },
          {
            angle: -45,
            enzymes: [
              { 
                id: "branch2-enzyme1", 
                label: "NMPK",
                marker: { type: "O" }
              },
              { 
                id: "branch2-enzyme2", 
                label: "NMPK",
                marker: { type: null }
              }
            ]
          }
        ],
      // enzymes: [
      //   { 
      //     id: "enzyme1", 
      //     label: "UCK",
      //     marker: { type: "P" }  // Enzyme with P marker
      //   },
      //   { 
      //     id: "enzyme2", 
      //     label: "UCK",
      //     marker: { type: null } // Enzyme with empty marker
      //   }
      // ]
    },
    {
      id: "node2",
      label: "5-aza-CMP",
      marks: [
        { type: "P" },
        { type: null },  // Empty circle
        { type: "O" },
        { type: "P" }
      ],
      enzymes: [
        { 
          id: "enzyme3", 
          label: "NMPK",
          marker: { type: "O" }
        },
        { 
          id: "enzyme4", 
          label: "NMPK",
          marker: { type: null }
        }
      ]
    },
    {
      id: "node3",
      label: "5-aza-CDP",
      marks: [
        { type: null },  // Empty circle
        { type: "O" },
        { type: "P" },
        { type: "O" }
      ]
    }
  ]
};