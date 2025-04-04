export class PathwayConfig {
    constructor(config = {}) {
      // Layout configuration
      this.layout = {
        nodeWidth: config.nodeWidth ?? 180,
        nodeHeight: 50,
        verticalSpacing: 120,
        horizontalSpacing: config.horizontalSpacing ?? 140,
        enzymeBoxSize: config.enzymeBoxSize ?? 60,
        intermediateBoxSize: config.intermediateBoxSize ?? 20,
        width: config.width ?? 800,
        height: 1600,
        markerRadius: config.markerRadius ?? 8,
        defaultBranchAngle: config.defaultBranchAngle ?? 30,
        defaultBranchLength: 200
      };
      this.compartments = {
          lineSpacing: 10, // Space between double lines
          labelOffset: 30, // Distance of label from line
          curveControl: 50, // Controls curve intensity
          opacity: 0.3, // Background fill opacity
        };
      // Style configuration
      this.styles = {
        node: {
          fill: config.nodeFill ?? 'white',
          stroke: config.nodeStroke ?? 'black',
          strokeWidth: config.nodeStrokeWidth ?? 2,
          className: config.nodeClassName ?? 'cursor-pointer hover:stroke-blue-500'
        },
        connection: {
          stroke: config.connectionStroke ?? 'black',
          strokeWidth: config.connectionStrokeWidth ?? 2,
          className: config.connectionClassName ?? ''
        },
        enzyme: {
          fill: config.enzymeFill ?? 'white',
          stroke: config.enzymeStroke ?? 'black',
          strokeWidth: config.enzymeStrokeWidth ?? 2,
          className: config.enzymeClassName ?? 'cursor-pointer hover:stroke-blue-500'
        },
        marker: {
          colors: {
            P: config.markerPColor ?? '#FFD700',
            O: config.markerOColor ?? '#FF4444'
          }
        }
      };
    }
  }
  
  export class PathwayGenerator {
      constructor(config = {}) {
        this.config = new PathwayConfig(config);
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
          const processedNodes = new Set();
          
          const processNode = (node, x, y, parentId = null) => {
            if (processedNodes.has(node.id)) return;
            processedNodes.add(node.id);
            
            positions.set(node.id, { x, y });
            
            // Count branches first
            const branchConnections = (node.connections || []).filter(c => c.type === 'branch');
            const hasTwoBranches = branchConnections.length === 2;
            
            node.connections?.forEach((connection, index) => {
              const targetNode = nodes.find(n => n.id === connection.targetId);
              if (!targetNode) return;
              
              if (connection.type === 'main') {
                const nextY = y + this.config.layout.verticalSpacing * 2;
                const nextX = x;
                
                // Store intermediate position
                const intermediatePos = {
                  x: (x + nextX) / 2,
                  y: (y + nextY) / 2
                };
                positions.set(`intermediate-${node.id}-${connection.targetId}`, intermediatePos);
                
                // Process enzymes
                connection.enzymes?.forEach((enzyme, eIdx) => {
                  const isRightSide = ~connection.angle || connection.angle > 0;
                  const enzymeOffset = this.config.layout.horizontalSpacing;
                  
                  positions.set(`enzyme-${node.id}-${connection.targetId}-${eIdx}`, {
                    x: intermediatePos.x + (isRightSide ? enzymeOffset : -enzymeOffset),
                    y: intermediatePos.y + (eIdx % 2 === 0 ? -40 : 40)
                  });
                });
                
                processNode(targetNode, nextX, nextY, node.id);
                
              } else if (connection.type === 'branch') {
                // Calculate vertical offset first
                const verticalOffset = hasTwoBranches ? this.config.layout.verticalSpacing * 2 : 0;
                
                // Adjust the branch length to accommodate the vertical offset
                const defaultLength = hasTwoBranches ? Math.sqrt((300 * 300) + (verticalOffset * verticalOffset)) : this.config.layout.defaultBranchLength;
                const angle = connection.angle ?? this.config.layout.defaultBranchAngle * (index % 2 ? 1 : -1);
                const length = connection.length ?? defaultLength;
                
                // Calculate end point including the vertical offset
                const branchEnd = {
                  x: x + length * Math.sin(angle * Math.PI / 180),
                  y: y + length * Math.cos(angle * Math.PI / 180) + verticalOffset
                };
                positions.set(`branch-${node.id}-${connection.targetId}`, branchEnd);
                
                // Calculate and store intermediate position - maintain the same ratio
                const branchMid = {
                  x: x + (length/2) * Math.sin(angle * Math.PI / 180),
                  y: y + (length/2) * Math.cos(angle * Math.PI / 180) + (verticalOffset/2)
                };
                positions.set(`intermediate-branch-${node.id}-${connection.targetId}`, branchMid);
                
                // Process enzymes for branch
                connection.enzymes?.forEach((enzyme, eIdx) => {
                  const isRightSide = angle > 0;
                  const enzymeOffset = this.config.layout.horizontalSpacing;
                  
                  positions.set(`enzyme-${node.id}-${connection.targetId}-${eIdx}`, {
                    x: branchMid.x + (isRightSide ? enzymeOffset : -enzymeOffset),
                    y: branchMid.y + (eIdx % 2 === 0 ? -40 : 40)  
                  });
                });
                
                processNode(targetNode, branchEnd.x, branchEnd.y, node.id);
              }
            });
          };
          
          // Process from root nodes
          const rootNodes = nodes.filter(node => 
            !nodes.some(n => n.connections?.some(c => c.targetId === node.id))
          );
          
          rootNodes.forEach((rootNode, index) => {
            const x = this.config.layout.width / 2;
            const y = this.config.layout.verticalSpacing + (index * this.config.layout.verticalSpacing * 3);
            processNode(rootNode, x, y);
          });
          
          return positions;
        }
        generateDNAHelix(x, y, width = 100, height = 40) {
          const numberOfWaves = 3;
          const strand1Points = [];
          const strand2Points = [];
          
          // Generate points for both strands
          for (let i = 0; i <= numberOfWaves * 16; i++) {
            const t = (i / (numberOfWaves * 16)) * Math.PI * 2 * numberOfWaves;
            const xPos = x + (width * t) / (Math.PI * 2 * numberOfWaves);
            
            // First strand
            strand1Points.push({
              x: xPos,
              y: y + Math.sin(t) * height/2
            });
            
            // Second strand (phase shifted)
            strand2Points.push({
              x: xPos,
              y: y + Math.sin(t + Math.PI) * height/2
            });
          }
          
          // Create path strings
          const strand1Path = strand1Points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
          ).join(' ');
          
          const strand2Path = strand2Points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
          ).join(' ');
      
          return `
                    <g class="dna-helix">
                      <path d="${strand1Path}" stroke="#4299E1" fill="none" stroke-width="2"/>
                      <path d="${strand2Path}" stroke="#805AD5" fill="none" stroke-width="2"/>
                      <text x="${x + width + 10}" y="${y + height / 2}" fill="black" class="font-medium">DNA</text>
                    </g>
                  `;
        }
      
        generateRNA(x, y, width = 100, height = 30) {
          const numberOfWaves = 4;
          const points = [];
          
          // Generate points for RNA wave
          for (let i = 0; i <= numberOfWaves * 16; i++) {
            const t = (i / (numberOfWaves * 16)) * Math.PI * 2 * numberOfWaves;
            points.push({
              x: x + (width * t) / (Math.PI * 2 * numberOfWaves),
              y: y + Math.sin(t) * height/2
            });
          }
          
          const path = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
          ).join(' ');
      
          return `
            <g class="rna-strand">
              <path 
                d="${path}" 
                stroke="#C05621" 
                fill="none" 
                stroke-width="2"
                stroke-linecap="round"
              />
            </g>
          <text x="${x + width + 10}" y="${y + height / 2}" fill="black" class="font-medium">RNA</text>
  
          `;
        }
      generateEnzymeConnections(node, positions) {
        if (!node.connections) return '';
        
        return node.connections.map(connection => {
          if (!connection.enzymes) return '';
          
          const intermediateKey = connection.type === 'branch' 
            ? `intermediate-branch-${node.id}-${connection.targetId}`
            : `intermediate-${node.id}-${connection.targetId}`;
          
          const intermediatePos = positions.get(intermediateKey);
          if (!intermediatePos) return '';
    
          return connection.enzymes.map((enzyme, eIdx) => {
            if (eIdx % 2 !== 0) return ''; // Skip odd indices to handle pairs
            
            const enzyme1Pos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx}`);
            const enzyme2Pos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx + 1}`);
            
            if (!enzyme1Pos || !enzyme2Pos) return '';
            
            // condition for staright connections and right angle connections
            if(!connection.angle || connection.angle > 0){
              var con_info = `
              <path
                d="M ${enzyme1Pos.x - 30} ${enzyme1Pos.y}
                   L ${intermediatePos.x + 11} ${intermediatePos.y}
                   L ${enzyme2Pos.x - 30} ${enzyme2Pos.y}"
                fill="none"
                stroke="black"
                stroke-width="2"
                marker-end="url(#arrowhead)"
              />
            `;
            }else{
              var con_info = `
              <path
                d="M ${enzyme1Pos.x + 30 } ${enzyme1Pos.y}
                   L ${intermediatePos.x - 11} ${intermediatePos.y}
                   L ${enzyme2Pos.x + 30} ${enzyme2Pos.y}"
                fill="none"
                stroke="black"
                stroke-width="2"
                marker-end="url(#arrowhead)"
              />
            `;
            }
            return con_info
          }).join('');
        }).join('');
      }
  
      renderMarker(x, y, marker) {
          return `
            <g>
              <circle
                cx="${x}"
                cy="${y}"
                r="${this.config.layout.markerRadius}"
                fill="${marker.type ? this.config.styles.marker.colors[marker.type] : 'white'}"
                stroke="black"
                stroke-width="1"
              />
              ${marker.type ? `
                <text
                  x="${x}"
                  y="${y}"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  class="font-bold"
                >${marker.type}</text>
              ` : ''}
            </g>
          `;
        }
      
        generateIntermediateElement(x, y, config) {
          const {
            label,
            width = 120,
            height = 40,
            attachedBox
          } = config;
        
          const isRightSide = attachedBox.side === 'right';
          const markerRadius = 8;
          const spacing = 20;  // Space between elements
        
          // Calculate positions
          const markerX = isRightSide ? x + width/2 : x - width/2;
          const attachedBoxX = isRightSide ? 
            markerX + markerRadius + spacing + attachedBox.width/2 : 
            markerX - markerRadius - spacing - attachedBox.width/2;
        
          return `
            <g class="intermediate-element">
              <!-- Main rectangle -->
              <rect
                x="${x - width/2}"
                y="${y - height/2}"
                width="${width}"
                height="${height}"
                fill="white"
                stroke="black"
                stroke-width="2"
              />
              <text
                x="${x}"
                y="${y}"
                text-anchor="middle"
                dominant-baseline="middle"
                class="font-medium"
              >${label}</text>
        
              <!-- Marker circle -->
              <circle
                cx="${markerX}"
                cy="${y}"
                r="${markerRadius}"
                fill="white"
                stroke="black"
                stroke-width="1"
              />
        
              <!-- Attached box -->
              <rect
                x="${attachedBoxX - attachedBox.width/2}"
                y="${y - attachedBox.height/2}"
                width="${attachedBox.width}"
                height="${attachedBox.height}"
                rx="20"
                ry="20"
                fill="white"
                stroke="black"
                stroke-width="2"
              />
              <text
                x="${attachedBoxX}"
                y="${y}"
                text-anchor="middle"
                dominant-baseline="middle"
                class="font-medium"
              >${attachedBox.label}</text>
        
              <!-- Connection line between marker and attached box -->
              <line
                x1="${markerX}"
                y1="${y}"
                x2="${isRightSide ? attachedBoxX - attachedBox.width/2 : attachedBoxX + attachedBox.width/2}"
                y2="${y}"
                stroke="black"
                stroke-width="2"
              />
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
            
            connections: data.nodes.map(node => {
              if (!node.connections) return '';
              
              return node.connections.map(connection => {
                const startPos = positions.get(node.id);
                const targetNode = data.nodes.find(n => n.id === connection.targetId);
                if (!targetNode) return '';
                
                if (connection.endDecoration) {
                  const endPos = positions.get(connection.targetId);
                  if (endPos) {
                    const decorationY = endPos.y + this.config.layout.nodeHeight/2 + 20;
                    if (connection.endDecoration === 'DNA') {
                      return this.generateDNAHelix(endPos.x - 50, decorationY);
                    } else if (connection.endDecoration === 'RNA') {
                      return this.generateRNA(endPos.x - 50, decorationY);
                    }
                  }
                }
  
                const intermediatePos = positions.get(`intermediate-${node.id}-${connection.targetId}`);
    
    let intermediateElement = '';
    if (connection.intermediateElement) {
      intermediateElement = this.generateIntermediateElement(
        intermediatePos.x,
        intermediatePos.y,
        connection.intermediateElement
      );
    }
                if (connection.type === 'main') {
                  const endPos = positions.get(connection.targetId);
                  const intermediatePos = positions.get(`intermediate-${node.id}-${connection.targetId}`);
                  
                  const enzymeElements = connection.enzymes?.map((enzyme, eIdx) => {
                    const enzymePos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx}`);
                    if (!enzymePos) return '';
      
                    // Calculate enzyme marker position (top left corner)
                    const markerX = enzymePos.x - this.config.layout.enzymeBoxSize/2;
                    const markerY = enzymePos.y - this.config.layout.enzymeBoxSize/2;
                    return `
                      <g>
                        <rect
                          x="${enzymePos.x - this.config.layout.enzymeBoxSize / 2}"
                          y="${enzymePos.y - this.config.layout.enzymeBoxSize / 2}"
                          width="${this.config.layout.enzymeBoxSize}"
                          height="${this.config.layout.enzymeBoxSize}"
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
                          class="font-medium"
                        >${enzyme.label}</text>
                        ${enzyme.marker ? this.renderMarker(markerX, markerY, enzyme.marker) : ''}
                      </g>
                    `;
                  }).join('') || '';
                  
                  // middle branch
                  return `
                    <g class="main-connection">
                      <line
                        x1="${startPos.x}"
                        y1="${startPos.y + (this.config.layout.nodeHeight / 2)}"
                        x2="${endPos.x}"
                        y2="${endPos.y - (this.config.layout.nodeHeight / 2)}"
                        stroke="black"
                        stroke-width="2"
                        marker-end="url(#arrowhead)"
                      />
                      <rect
                        x="${intermediatePos.x - this.config.layout.intermediateBoxSize / 2}"
                        y="${intermediatePos.y - this.config.layout.intermediateBoxSize / 2}"
                        width="${this.config.layout.intermediateBoxSize}"
                        height="${this.config.layout.intermediateBoxSize}"
                        fill="white"
                        stroke="black"
                        stroke-width="2"
                      />
                      ${intermediateElement}
                      ${enzymeElements}
                    </g>
                  `;
                } else if (connection.type === 'branch') {
                  const branchEnd = positions.get(`branch-${node.id}-${connection.targetId}`);
                  const intermediatePos = positions.get(`intermediate-branch-${node.id}-${connection.targetId}`);
                  
                  const enzymeElements = connection.enzymes?.map((enzyme, eIdx) => {
                    const enzymePos = positions.get(`enzyme-${node.id}-${connection.targetId}-${eIdx}`);
                    if (!enzymePos) return '';
      
                    const markerX = enzymePos.x - this.config.layout.enzymeBoxSize/2;
                    const markerY = enzymePos.y - this.config.layout.enzymeBoxSize/2;
      
                    return `
                      <g>
                        <rect
                          x="${enzymePos.x - this.config.layout.enzymeBoxSize / 2}"
                          y="${enzymePos.y - this.config.layout.enzymeBoxSize / 2}"
                          width="${this.config.layout.enzymeBoxSize}"
                          height="${this.config.layout.enzymeBoxSize}"
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
                          class="font-medium"
                        >${enzyme.label}</text>
                        ${enzyme.marker ? this.renderMarker(markerX, markerY, enzyme.marker) : ''}
                      </g>
                    `;
                  }).join('') || '';
                  
                  return `
                    <g class="branch-connection">
                      <line
                        x1="${startPos.x}"
                        y1="${startPos.y + (this.config.layout.nodeHeight / 2)}"
                        x2="${branchEnd.x}"
                        y2="${branchEnd.y - (this.config.layout.nodeHeight / 2)}"
                        stroke="black"
                        stroke-width="2"
                        marker-end="url(#arrowhead)"
                      />
                      <rect
                        x="${intermediatePos.x - this.config.layout.intermediateBoxSize / 2}"
                        y="${intermediatePos.y - this.config.layout.intermediateBoxSize / 2}"
                        width="${this.config.layout.intermediateBoxSize}"
                        height="${this.config.layout.intermediateBoxSize}"
                        fill="white"
                        stroke="black"
                        stroke-width="2"
                      />
                      ${enzymeElements}
                    </g>
                  `;
                }
              }).join('') + this.generateEnzymeConnections(node, positions);
            }).join(''),
      
            nodes: data.nodes.map(node => {
              const pos = positions.get(node.id);
              if (!pos) return '';
            
              // Calculate corner positions for markers
              const corners = [
                { x: pos.x - this.config.layout.nodeWidth/2 + 10, y: pos.y - this.config.layout.nodeHeight/2 + 10 },
                { x: pos.x + this.config.layout.nodeWidth/2 - 10, y: pos.y - this.config.layout.nodeHeight/2 + 10 },
                { x: pos.x - this.config.layout.nodeWidth/2 + 10, y: pos.y + this.config.layout.nodeHeight/2 - 10 },
                { x: pos.x + this.config.layout.nodeWidth/2 - 10, y: pos.y + this.config.layout.nodeHeight/2 - 10 }
              ];
              
              if (node.type === 'DNA') {
                  return this.generateDNAHelix(pos.x - 50, pos.y);
                }
                
                if (node.type === 'RNA') {
                  return this.generateRNA(pos.x - 50, pos.y);
                }
  
              const markers = (node.marks || []).map((mark, index) => 
                this.renderMarker(corners[index].x, corners[index].y, mark)
              ).join('');
            
              // Calculate inner ellipse dimensions - make it slightly smaller
              const innerPadding = 5; // Adjust this value to control the space between ellipses
              const innerRx = this.config.layout.nodeWidth / 2 - innerPadding;
              const innerRy = this.config.layout.nodeHeight / 2 - innerPadding;
            
              return `
                <g>
                  <!-- Outer ellipse -->
                  <ellipse
                    cx="${pos.x}"
                    cy="${pos.y}"
                    rx="${this.config.layout.nodeWidth / 2}"
                    ry="${this.config.layout.nodeHeight / 2}"
                    fill="${this.config.styles.node.fill || 'white'}"
                    stroke="${this.config.styles.node.stroke || 'black'}"
                    stroke-width="${this.config.styles.node.strokeWidth || 2}"
                    class="${this.config.styles.node.className || 'cursor-pointer hover:stroke-blue-500'}"
                  />
                  <!-- Inner ellipse -->
                  <ellipse
                    cx="${pos.x}"
                    cy="${pos.y}"
                    rx="${innerRx}"
                    ry="${innerRy}"
                    fill="none"
                    stroke="${this.config.styles.node.stroke || 'black'}"
                    stroke-width="${this.config.styles.node.strokeWidth || 2}"
                  />
                  <text
                    x="${pos.x}"
                    y="${pos.y}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="font-medium"
                  >${node.label}</text>
                  ${markers}
                </g>
              `;
            }).join('')
          };
        }
  
        // In the generateCompartments method, modify the double curved lines section:
  generateCompartments(data, positions) {
      if (!data.compartments) return '';
    
      return data.compartments.map(compartment => {
        const pos = positions.get(compartment.intersectNodes[0])
        const y = pos.y + compartment.y;
        const width = this.config.layout.width;
        
        // For arc, we'll use different parameters
        const arcHeight = 80; // Controls how much the arc bows
        const y2 = y + this.config.compartments.lineSpacing;
        
        return `
          <!-- Gradient definition -->
          <defs>
            <linearGradient id="gradient-${compartment.id}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${compartment.color}" stop-opacity="0"/>
              <stop offset="50%" stop-color="${compartment.color}" stop-opacity="${this.config.compartments.opacity}"/>
              <stop offset="100%" stop-color="${compartment.color}" stop-opacity="0"/>
            </linearGradient>
          </defs>
    
          <g class="compartment-${compartment.id}">
            <!-- Background fill -->
            <path
              d="M 0 ${y - 100}
                 L ${width} ${y - 100}
                 L ${width} ${y + 100}
                 L 0 ${y + 100}
                 Z"
              fill="url(#gradient-${compartment.id})"
              mask="url(#mask-${compartment.id})"
            />
            
            <!-- Double arc lines -->
            <path
              d="M 0 ${y} 
                 Q ${width/2} ${y - arcHeight} ${width} ${y}"
              fill="none"
              stroke="${compartment.color}"
              stroke-width="${compartment.strokeWidth}"
              stroke-opacity="0.8"
            />
            <path
              d="M 0 ${y2} 
                 Q ${width/2} ${y2 - arcHeight} ${width} ${y2}"
              fill="none"
              stroke="${compartment.color}"
              stroke-width="${compartment.strokeWidth}"
              stroke-opacity="0.8"
            />
            
            <!-- Compartment label -->
            <text
              x="20"
              y="${y - this.config.compartments.labelOffset}"
              fill="${compartment.color}"
              font-weight="bold"
              class=""
            >${compartment.label}</text>
          </g>
        `;
      }).join('');
    }
        
        // Modify generateSVG method:
        generateSVG(data) {
          const positions = this.calculatePositions(data.nodes);
          console.log(positions)
          const elements = this.generatePathwayElements(data);
          return `
            <svg 
              width="${this.config.layout.width}" 
              height="${this.config.layout.height}"
              viewBox="0 0 ${this.config.layout.width} ${this.config.layout.height}"
              class="bg-white shadow-lg rounded-lg"
            >
              ${elements.defs}
              <g id="pathway-content-wrapper">
                ${this.generateCompartments(data, positions)}
                ${elements.connections}
                ${elements.nodes}
              </g>
            </svg>
          `;
        }
    }
    
    export const sampleData = {
      compartments: [
          {
            id: "plasma-membrane",
            label: "Plasma Membrane",
            y: 150, // Y position from top
            color: "#FF9999",
            strokeWidth: 3,
            intersectNodes: ["glucose"], // IDs of nodes/connections this boundary intersects with
          },
          {
            id: "nucleus",
            label: "Nucleus",
            y: -100,
            color: "#9999FF",
            strokeWidth: 3,
            intersectNodes: ["6pg", "g1p"], // Example nodes
          }
        ],
      nodes: [
        {
          id: "glucose",
          label: "Glucose",
          marks: [
            { type: "P" },
            { type: "O" },
            { type: null },
            { type: null }
          ],
          connections: [
            {
              targetId: "glucose2",
              type: "main",
              enzymes: [
              ]
            }
          ],
          style: {
            fill: "#f0f0f0",
            stroke: "#333333"
          }
        },
        {
          id: "glucose2",
          label: "Glucose",
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
                  id: "hk1",
                  label: "Hex",
                  marker: { type: "P" }
                },
                { 
                  id: "hk2",
                  label: "Gluc",
                  marker: { type: null }
                }
              ]
            }
          ],
          style: {
            fill: "#f0f0f0",
            stroke: "#333333"
          }
        },
        {
          id: "g6p",
          label: "Glucose-6-Phosphate",
          marks: [
            { type: "P" },
            { type: "P" },
            { type: "O" },
            { type: null }
          ],
          connections: [
            {
              targetId: "jn9",
              type: "branch",
              angle: 35,
              length: 200,
              enzymes: [
                {
                  id: "g6pd",
                  label: "G6P",
                  marker: { type: "P" }
                },
                {
                  id: "lactonase",
                  label: "Lact",
                  marker: { type: null }
                }
              ]
            },
            {
              targetId: "lkj3",
              type: "branch",
              angle: -35,
              length: 180,
              enzymes: [
                {
                  id: "pgm",
                  label: "Phosph",
                  marker: { type: "O" }
                },
                {
                  id: "pgm",
                  label: "Phosph",
                  marker: { type: null }
                },
              ]
            }
          ]
        },
  
        {
          id: "jn9",
          label: "6-Phosphogl",
          marks: [
            { type: "P" },
            { type: "O" },
            { type: null },
            { type: "P" }
          ],
          connections: [
            {
              targetId: "6pg",
              type: "main",
              enzymes: [
              ],
            }
          ]
        },
  
        {
          id: "lkj3",
          label: "6-Phosphogl",
          marks: [
            { type: "P" },
            { type: "O" },
            { type: null },
            { type: "o" }
          ],
          connections: [
            {
              targetId: "g1p",
              type: "main",
              enzymes: [
              ],
            }
          ]
        },
        // Branch pathway endpoints
        {
          id: "6pg",
          label: "6-Phosphogl",
          marks: [
            { type: "P" },
            { type: "O" },
            { type: "p" },
            { type: null }
          ],
          connections: [
            {
              targetId: "dna-node",
              type: "main",
              enzymes: [
              ],
              intermediateElement: {
                  label: "Incorporation",  
                  width: 120, 
                  height: 40, 
                  attachedBox: {
                    label: "DNA-pol",
                    side: 'right',
                    width: 80, 
                    height: 40
                  }
                }
            }
          ]
        },
        {
          id: "g1p",
          label: "Glucose-1",
          marks: [
            { type: "P" },
            { type: null },
            { type: "O" },
            { type: "P" }
          ],
          connections: [
            {
              targetId: "rna-node",
              type: "main",
              intermediateElement: {
                  label: "Incorporation",  
                  width: 120, 
                  height: 40,             
                  attachedBox: {
                    label: "DNA-pol",
                    side: 'left', 
                    width: 80,
                    height: 40
                  }
                }
            }
          ]
        },
        {
          id: "rna-node",
          label: "RNA",
          type: "RNA", // Add this type to trigger RNA visualization
  
          // ... other node properties
        },
        {
          id: "dna-node",
          label: "DNA",
          type: "DNA", // Add this type to trigger DNA visualization
  
          // ... other node properties
        }
  
      ],
      config: {
        // Custom configuration for this specific pathway
        height:1400,
        nodeWidth: 200,
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
              P: "#ffd700",
              O: "#ff6b6b"
            }
          }
        }
      }
    };