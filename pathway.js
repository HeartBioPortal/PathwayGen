// pathway-generator.js

export class PathwayGenerator {
    constructor(config = {}) {
        this.config = {
          nodeWidth: config.nodeWidth || 180,
          nodeHeight: config.nodeHeight || 60,
          verticalSpacing: 180,
          horizontalSpacing: config.horizontalSpacing || 140,
          enzymeBoxSize: 45,
          intermediateBoxSize: config.intermediateBoxSize || 20,
          width: config.width || 600,
          height: 1200,
          markerRadius: config.markerRadius || 10
        };
      }
  
    calculatePositions(nodes) {
      const positions = new Map();
      
      nodes.forEach((node, index) => {
        const centerX = this.config.width / 2;
        const centerY = this.config.verticalSpacing + (index * this.config.verticalSpacing);
        
        // Main node position
        positions.set(node.id, {
          x: centerX,
          y: centerY
        });
        
        // Calculate intermediate square positions
        if (index < nodes.length - 1) {
          const nextCenterY = this.config.verticalSpacing + ((index + 1) * this.config.verticalSpacing);
          positions.set(`intermediate-${node.id}`, {
            x: centerX,
            y: (centerY + nextCenterY) / 2
          });
        }
        
        // Calculate enzyme positions if present
        if (node.enzymes) {
          const enzymeY = index < nodes.length - 1 
            ? (centerY + this.config.verticalSpacing / 2)
            : centerY;
  
          node.enzymes.forEach((enzyme, eIdx) => {
            // Position enzymes on the right side, aligned with the connection arrows
            positions.set(`${node.id}-enzyme-${eIdx}`, {
              x: centerX + this.config.horizontalSpacing,
              y: enzymeY + (eIdx % 2 === 0 ? -40 : 40) // Offset pairs vertically
            });
          });
        }
      });
      
      return positions;
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
          if (index === data.nodes.length - 1) return '';
          
          const startPos = positions.get(node.id);
          const endPos = positions.get(data.nodes[index + 1].id);
          const intermediatePos = positions.get(`intermediate-${node.id}`);
  
          // Generate enzyme connections with bouncing arrows
          const enzymeConnections = (node.enzymes || []).map((enzyme, eIdx) => {
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
                marker-end="url(#arrowhead)"  // Add this line
              />
            `;
          }).join('');
  
          // Main connection line and intermediate square
          return `
            <g>
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
              ${enzymeConnections}
            </g>
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
        enzymes: [
          { 
            id: "enzyme1", 
            label: "UCK",
            marker: { type: "P" }  // Enzyme with P marker
          },
          { 
            id: "enzyme2", 
            label: "UCK",
            marker: { type: null } // Enzyme with empty marker
          }
        ]
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