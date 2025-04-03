/**
 * Math utilities for pathway visualizations
 */

const mathUtils = {
    /**
     * Calculate endpoint of a branch with given angle and length
     * @param {number} startX - Start X position
     * @param {number} startY - Start Y position
     * @param {number} angle - Angle in degrees
     * @param {number} length - Length of branch
     * @param {number} verticalOffset - Additional vertical offset
     * @returns {Object} End point {x, y}
     */
    calculateBranchEndpoint(startX, startY, angle, length, verticalOffset = 0) {
      const radians = (angle * Math.PI) / 180;
      return {
        x: startX + length * Math.sin(radians),
        y: startY + length * Math.cos(radians) + verticalOffset
      };
    },
  
    /**
     * Calculate midpoint between two points
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @returns {Object} Midpoint {x, y}
     */
    calculateMidpoint(x1, y1, x2, y2) {
      return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
      };
    },
  
    /**
     * Calculate control points for a cubic Bezier curve
     * @param {number} x1 - Start point X
     * @param {number} y1 - Start point Y
     * @param {number} x2 - End point X
     * @param {number} y2 - End point Y
     * @param {number} curvature - Curvature factor (0-1)
     * @returns {Array} Control points [{x, y}, {x, y}]
     */
    calculateBezierControlPoints(x1, y1, x2, y2, curvature = 0.5) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Default curvature is 50% of the distance
      const controlDistance = distance * curvature;
      
      return [
        {
          x: x1 + dx / 3,
          y: y1 + dy / 3
        },
        {
          x: x2 - dx / 3,
          y: y2 - dy / 3
        }
      ];
    },
  
    /**
     * Calculate points for a quadratic Bezier curve
     * @param {number} x1 - Start point X
     * @param {number} y1 - Start point Y
     * @param {number} x2 - End point X
     * @param {number} y2 - End point Y
     * @param {number} curveFactor - Curve factor
     * @returns {Object} Control point {x, y}
     */
    calculateQuadraticControlPoint(x1, y1, x2, y2, curveFactor = 0.5) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      // For vertical connections, offset horizontally
      if (Math.abs(x2 - x1) < 10) {
        return {
          x: midX + curveFactor * 100,
          y: midY
        };
      }
      
      // For horizontal connections, offset vertically
      if (Math.abs(y2 - y1) < 10) {
        return {
          x: midX,
          y: midY + curveFactor * 100
        };
      }
      
      // For diagonal connections, offset perpendicular to the connection line
      const dx = x2 - x1;
      const dy = y2 - y1;
      const norm = Math.sqrt(dx * dx + dy * dy);
      
      return {
        x: midX + curveFactor * 100 * (-dy / norm),
        y: midY + curveFactor * 100 * (dx / norm)
      };
    },
  
    /**
     * Calculate a point at a relative position along a line
     * @param {number} x1 - Start point X
     * @param {number} y1 - Start point Y
     * @param {number} x2 - End point X
     * @param {number} y2 - End point Y
     * @param {number} ratio - Position ratio (0-1)
     * @returns {Object} Point {x, y}
     */
    calculatePointAlongLine(x1, y1, x2, y2, ratio) {
      return {
        x: x1 + (x2 - x1) * ratio,
        y: y1 + (y2 - y1) * ratio
      };
    },
  
    /**
     * Calculate a point at a given offset from a line
     * @param {number} x1 - Line start X
     * @param {number} y1 - Line start Y
     * @param {number} x2 - Line end X
     * @param {number} y2 - Line end Y
     * @param {number} distance - Perpendicular distance from line
     * @returns {Object} Offset point {x, y}
     */
    calculatePerpendicularOffset(x1, y1, x2, y2, distance) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize and rotate 90 degrees
      const nx = -dy / length;
      const ny = dx / length;
      
      return {
        x: (x1 + x2) / 2 + nx * distance,
        y: (y1 + y2) / 2 + ny * distance
      };
    },
  
    /**
     * Get SVG path string for a curved line
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {string} curveType - Type of curve (linear, curved, stepped)
     * @param {number} curvature - Curvature factor
     * @returns {string} SVG path string
     */
    getConnectionPath(x1, y1, x2, y2, curveType = 'linear', curvature = 0.5) {
      switch (curveType) {
        case 'curved': {
          const cp = this.calculateQuadraticControlPoint(x1, y1, x2, y2, curvature);
          return `M ${x1} ${y1} Q ${cp.x} ${cp.y} ${x2} ${y2}`;
        }
        case 'stepped': {
          const midY = (y1 + y2) / 2;
          return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        }
        case 'linear':
        default:
          return `M ${x1} ${y1} L ${x2} ${y2}`;
      }
    }
  };
  
  module.exports = { mathUtils };