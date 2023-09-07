import {initialize as initialize1, update as update1, states as states1} from './GoLM.js';
import {update as update2, states as states2} from './zoomGoL.js';
import {cellFunctor} from './cellFun-GoLM-zoomGoL.js';
import {colors} from './colors.js'; // new import

let width = 50;
let height = 50;
let cellSizes = [6,12]; // Size of a cell in pixels

let grid1 = {data: initialize1(width, height)};
let grid2 = {data: cellFunctor(grid1.data)}; // Initial grid of CA2 is obtained by applying cellFunctor to grid1
let grid4 = {data: JSON.parse(JSON.stringify(grid1.data))};
let grid5 = {data: JSON.parse(JSON.stringify(grid2.data))};

let canvas1, ctx1;
let canvas2, ctx2;
let canvas4, ctx4;
let canvas5, ctx5;
let timeoutId; // to store the id of the setTimeout

let updateSpeed = 400;
let notInitialized = 2;
let updateCount = 0;

let grids, canvasContexts, updateFunctions;

let totalCells = grid2.data.length * grid2.data[0].length; // calculate total cells

function drawAndEvolve() {
    // clear previous timeout
    clearTimeout(timeoutId);
    for (let i = 0; i < grids.length; i++) {
        let grid = grids[i];
        let ctx = canvasContexts[i];
        let canvas = ctx.canvas;
        let updateFunction = updateFunctions[i];
	let currentCellSize = i === 0 || i === 2 ? cellSizes[0] : cellSizes[1]; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < grid.data.length; i++) {
	    for (let j = 0; j < grid.data[0].length; j++) {
		if (grid.data[i][j] === 0) {
		    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Fully transparent
		} else {
		    ctx.fillStyle = colors[grid.data[i][j] % colors.length];
		}
		ctx.fillRect(j * currentCellSize, i * currentCellSize, currentCellSize, currentCellSize);
	    }
	}

        if (notInitialized || updateCount) {
            let newGrid = new Array(grid.data.length);
            for (let i = 0; i < grid.data.length; i++) {
                newGrid[i] = new Array(grid.data[0].length);
                for (let j = 0; j < grid.data[0].length; j++) {
                    newGrid[i][j] = updateFunction(grid.data, i, j);
                }
            }
            grid.data = newGrid;
            if (notInitialized)  {notInitialized = Math.max(0, notInitialized - 1);}
	    else {updateCount = Math.max(0, updateCount - 1);}
        }
    }
    timeoutId = setTimeout(drawAndEvolve, updateSpeed);
    updateCount = 4;
}

window.onload = function() {
    canvas1 = document.getElementById("canvas1");
    ctx1 = canvas1.getContext("2d");

    canvas2 = document.getElementById("canvas2");
    ctx2 = canvas2.getContext("2d");

    canvas4 = document.getElementById("canvas4");
    ctx4 = canvas4.getContext("2d");

    canvas5 = document.getElementById("canvas5");
    ctx5 = canvas5.getContext("2d");

    grids = [grid1, grid2, grid4, grid5];
    canvasContexts = [ctx1, ctx2, ctx4, ctx5];
    updateFunctions = [update1, update2, update1, update2];
    drawAndEvolve();
};

