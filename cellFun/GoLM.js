// Multistate GoF

let num_states = 8;
let states = Array.from(Array(num_states).keys());


function getDistanceCalculator(x1, y1, waviness = 0.4, frequencyFactor = 0.4, max_dist = 25) {
    // Generate random coefficients for the trigonometric functions
    const randomCoeff1 = Math.random() * waviness;
    const randomCoeff2 = Math.random() * waviness;

    // Generate random base frequencies and scale them by the frequencyFactor
    const randomFreq1 = frequencyFactor * (1 + Math.floor(Math.random() * 5));
    const randomFreq2 = frequencyFactor * (1 + Math.floor(Math.random() * 5));

    return function(x2, y2) {
        // Standard Euclidean distance
        let standardDistance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

	if (standardDistance > max_dist) {
	    return 999999999
	}

	// Calculate angle to introduce perturbation
        let angle = Math.atan2(y2 - y1, x2 - x1);

        // Create a smoothly varying perturbation based on the angle
        let perturbation = 1 - Math.abs(randomCoeff1 * Math.sin(randomFreq1 * angle) + randomCoeff2 * Math.cos(randomFreq2 * angle));

        // Ensure perturbation is in [0, 1] to make the circle smaller
        perturbation = Math.max(0, Math.min(1, perturbation));

        // Return the perturbed distance
        return standardDistance * perturbation;
    };
}


// Function to initialize the grid
function initialize(width, height, radius = 15, diffuseness = 0.5, proportion = 0.5) {
    let num_states = states.length;
    let grid = new Array(height);
    let centerX = Math.floor(width / 2);
    let centerY = Math.floor(height / 2);

    // Get the distance calculator function for the center point
    let calculateDistance = getDistanceCalculator(centerX, centerY, undefined, undefined, Math.floor(height / 2));

    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            // Calculate the distance from the center of the grid to the current point
            let distance = calculateDistance(j, i);

            // Check if the point is within the circle and within the proportion
            if (distance <= radius && Math.random() < proportion) {
                // Create a gradient effect
                let gradient = Math.pow(1 - (distance / radius), diffuseness);

                // Use the gradient to determine the state
                if (Math.random() < gradient) {
                    let random_state = Math.floor(Math.random() * (num_states - 1)) + 1;
                    grid[i][j] = states[random_state];
                } else {
                    grid[i][j] = states[0];
                }
            } else {
                grid[i][j] = states[0]; // Outside the circle, set to zero state
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
