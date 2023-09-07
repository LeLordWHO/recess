// Multistate GoF

let num_states = 8;
let states = Array.from(Array(num_states).keys());

// Function to initialize the grid
function initialize(width, height) {
    let num_states = states.length;
    let grid = new Array(height);
    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            if (Math.random() < 0.5) {
                grid[i][j] = states[0];
            } else {
                let random_state = Math.floor(Math.random() * (num_states - 1)) + 1;
                grid[i][j] = states[random_state];
            }
        }
    }
    return grid;
}

// Function to count the alive neighbors of a cell
function countAliveNeighbors(grid, i, j) {
    let count = 0;
    for (let x = Math.max(i-1, 0); x <= Math.min(i+1, grid.length-1); x++) {
        for (let y = Math.max(j-1, 0); y <= Math.min(j+1, grid[0].length-1); y++) {
            count += grid[x][y] !== 0 ? 1 : 0;  // Counts any non-zero state as 1
        }
    }
    count -= grid[i][j] !== 0 ? 1 : 0; // Reduce the count by one if the cell itself is alive (non-zero)
    return count;
}

function confuse(num1, num2, num3, num4) {
  let result = (num1 ^ num2 ^ num3 ^ num4) + 1;
  result = result % 7 + 1;

  return result;
}

// Function to get the next state of a cell
function update(grid, i, j) {
    let aliveNeighbors = countAliveNeighbors(grid, i, j);
    if (grid[i][j] !== 0) {  // Consider any non-zero state as "alive"
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            return 0;  // The cell dies
        } else {
            // Get the states of the four neighbors
            let top = grid[Math.max(0, i-1)][j];
            let bottom = grid[Math.min(grid.length-1, i+1)][j];
            let left = grid[i][Math.max(0, j-1)];
            let right = grid[i][Math.min(grid[0].length-1, j+1)];

            // Confuse function applied on the neighboring states
            return confuse(top, bottom, left, right);
        }
    } else {
        if (aliveNeighbors === 3) {
            // Get the states of the four neighbors
            let top = grid[Math.max(0, i-1)][j];
            let bottom = grid[Math.min(grid.length-1, i+1)][j];
            let left = grid[i][Math.max(0, j-1)];
            let right = grid[i][Math.min(grid[0].length-1, j+1)];

            // Confuse function applied on the neighboring states
            return confuse(top, bottom, left, right);  
        } else {
            return 0;  // The cell stays dead
        }
    }
}



export {initialize, update, states};
//module.exports = {initialize, update, states};