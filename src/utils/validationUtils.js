/**
 * Validation utilities for pathway visualizations
 */

const validationUtils = {
    /**
     * Validate a pathway data object
     * @param {Object} data - Pathway data
     * @returns {Object} Validation result {valid, errors}
     */
    validatePathwayData(data) {
      const errors = [];
      
      // Check for nodes array
      if (!data.nodes || !Array.isArray(data.nodes)) {
        errors.push('Pathway data must contain a nodes array');
        return { valid: false, errors };
      }
      
      // Validate nodes
      const nodeIds = new Set();
      data.nodes.forEach((node, index) => {
        // Check for node ID
        if (!node.id) {
          errors.push(`Node at index ${index} is missing an ID`);
        } else if (nodeIds.has(node.id)) {
          errors.push(`Duplicate node ID: ${node.id}`);
        } else {
          nodeIds.add(node.id);
        }
        
        // Validate connections
        if (node.connections) {
          if (!Array.isArray(node.connections)) {
            errors.push(`Connections for node ${node.id} must be an array`);
          } else {
            node.connections.forEach((connection, connIndex) => {
              // Check for target ID
              if (!connection.targetId) {
                errors.push(`Connection at index ${connIndex} for node ${node.id} is missing a targetId`);
              }
              
              // Validate connection type
              if (connection.type && !['main', 'branch'].includes(connection.type)) {
                errors.push(`Invalid connection type for node ${node.id}: ${connection.type}`);
              }
            });
          }
        }
      });
      
      // Validate compartments
      if (data.compartments) {
        if (!Array.isArray(data.compartments)) {
          errors.push('Compartments must be an array');
        } else {
          data.compartments.forEach((compartment, index) => {
            // Check for compartment ID or label
            if (!compartment.id && !compartment.label) {
              errors.push(`Compartment at index ${index} must have either an ID or a label`);
            }
            
            // Check for intersect nodes
            if (compartment.intersectNodes) {
              if (!Array.isArray(compartment.intersectNodes)) {
                errors.push(`IntersectNodes for compartment ${compartment.id || index} must be an array`);
              } else {
                compartment.intersectNodes.forEach((nodeId, nodeIndex) => {
                  if (!nodeIds.has(nodeId)) {
                    errors.push(`Compartment ${compartment.id || index} references non-existent node ID: ${nodeId}`);
                  }
                });
              }
            }
          });
        }
      }
      
      // Validate config if present
      if (data.config) {
        if (typeof data.config !== 'object') {
          errors.push('Config must be an object');
        }
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    },
  
    /**
     * Validate a node object
     * @param {Object} node - Node data
     * @returns {Object} Validation result {valid, errors}
     */
    validateNode(node) {
      const errors = [];
      
      // Check for node ID
      if (!node.id) {
        errors.push('Node is missing an ID');
      }
      
      // Validate connections
      if (node.connections) {
        if (!Array.isArray(node.connections)) {
          errors.push('Connections must be an array');
        } else {
          node.connections.forEach((connection, index) => {
            // Check for target ID
            if (!connection.targetId) {
              errors.push(`Connection at index ${index} is missing a targetId`);
            }
            
            // Validate connection type
            if (connection.type && !['main', 'branch'].includes(connection.type)) {
              errors.push(`Invalid connection type: ${connection.type}`);
            }
          });
        }
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    },
  
    /**
     * Check if a node ID exists in a dataset
     * @param {string} nodeId - Node ID to check
     * @param {Array} nodes - Array of nodes
     * @returns {boolean} True if node exists
     */
    nodeExists(nodeId, nodes) {
      return nodes.some(node => node.id === nodeId);
    },
  
    /**
     * Find circular connections in a pathway
     * @param {Array} nodes - Array of nodes
     * @returns {Array} Array of circular paths
     */
    findCircularConnections(nodes) {
      const circularPaths = [];
      const visited = new Set();
      const path = [];
      
      const dfs = (nodeId, pathIndex) => {
        // Check if node is already in current path
        const nodePathIndex = path.indexOf(nodeId);
        if (nodePathIndex !== -1 && nodePathIndex >= pathIndex) {
          // Found a circular path
          circularPaths.push(path.slice(nodePathIndex).concat(nodeId));
          return;
        }
        
        // Check if node was already visited
        if (visited.has(nodeId)) {
          return;
        }
        
        // Mark node as visited
        visited.add(nodeId);
        path.push(nodeId);
        
        // Find node in nodes array
        const node = nodes.find(n => n.id === nodeId);
        if (node && node.connections) {
          // Visit all connections
          node.connections.forEach(conn => {
            dfs(conn.targetId, path.length - 1);
          });
        }
        
        // Remove node from path
        path.pop();
      };
      
      // Start DFS from each node
      nodes.forEach(node => {
        dfs(node.id, 0);
      });
      
      return circularPaths;
    }
  };
  
  module.exports = { validationUtils };