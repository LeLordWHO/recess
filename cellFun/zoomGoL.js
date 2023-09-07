// Zoomed out GoL

let num_states = 16;
let states = Array.from(Array(num_states).keys());

// Function to initialize the grid
function initialize(width, height) {
    let grid = new Array(height);
    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            grid[i][j] = states[Math.floor(Math.random() * states.length)];  // Assigns a random state
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

// Function to get the next state of a cell
function updateGoL(grid, i, j) {
    let aliveNeighbors = countAliveNeighbors(grid, i, j);
    if (grid[i][j] === 1) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            return 0;  // The cell dies
        } else {
            return 1;  // The cell stays alive
        }
    } else {
        if (aliveNeighbors === 3) {
            return 1;  // The cell becomes alive
        } else {
            return 0;  // The cell stays dead
        }
    }
}

function binaryArrayToNumber(arr) {
    // Concatenate the binary values in row-major order.
    let binaryString = arr[0][0] + "" + arr[0][1] + "" + arr[1][0] + "" + arr[1][1];
    
    // Convert binary string to a decimal number.
    let decimalNumber = parseInt(binaryString, 2);
    
    return decimalNumber;
}

function convertBinaryArray(binaryArray) {
    let n = binaryArray.length / 2;
    let outputArray = new Array(n).fill(0).map(() => new Array(n).fill(0));

    for (let i = 0; i < binaryArray.length; i += 2) {
        for (let j = 0; j < binaryArray[i].length; j += 2) {
            let chunk = [
                [binaryArray[i][j], binaryArray[i][j + 1]],
                [binaryArray[i + 1][j], binaryArray[i + 1][j + 1]]
            ];
            outputArray[i / 2][j / 2] = binaryArrayToNumber(chunk);
        }
    }

    return outputArray;
}

function numberToBinaryArray(num) {
    // Convert number to binary string
    let binaryString = num.toString(2).padStart(4, '0');
    
    // Create 2x2 array
    let binaryArray = [
        [parseInt(binaryString[0]), parseInt(binaryString[1])],
        [parseInt(binaryString[2]), parseInt(binaryString[3])]
    ];
    
    return binaryArray;
}


function update(grid, i, j) {   
    // Initialize a 6x6 array with all zeroes
    var localGrid = Array(6).fill().map(() => Array(6).fill(0));

    // Array of the 9 2x2 arrays
    var miniGrids = [
        i-1 < 0 || j-1 < 0 ? 0 : grid[i-1][j-1],
        i-1 < 0 ? 0 : grid[i-1][j],
        i-1 < 0 || j+1 >= grid[0].length ? 0 : grid[i-1][j+1],
        j-1 < 0 ? 0 : grid[i][j-1],
        grid[i][j],
        j+1 >= grid[0].length ? 0 : grid[i][j+1],
        i+1 >= grid.length || j-1 < 0 ? 0 : grid[i+1][j-1],
        i+1 >= grid.length ? 0 : grid[i+1][j],
        i+1 >= grid.length || j+1 >= grid[0].length ? 0 : grid[i+1][j+1]
    ].map(numberToBinaryArray);

    // Assign the 9 miniGrids to their positions in the 6x6 result array
    for (var k = 0; k < 2; k++) {
        localGrid[k].splice(0, 2, ...miniGrids[0][k]);
        localGrid[k].splice(2, 2, ...miniGrids[1][k]);
        localGrid[k].splice(4, 2, ...miniGrids[2][k]);
        localGrid[2+k].splice(0, 2, ...miniGrids[3][k]);
        localGrid[2+k].splice(2, 2, ...miniGrids[4][k]);
        localGrid[2+k].splice(4, 2, ...miniGrids[5][k]);
        localGrid[4+k].splice(0, 2, ...miniGrids[6][k]);
        localGrid[4+k].splice(2, 2, ...miniGrids[7][k]);
        localGrid[4+k].splice(4, 2, ...miniGrids[8][k]);
    }

    let miniGrid = [[], []];

    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 2; j++){
            miniGrid[i][j] = updateGoL(localGrid, i + 2, j + 2);
        }
    }

    return binaryArrayToNumber(miniGrid);
}


export {initialize, update, states, convertBinaryArray};
