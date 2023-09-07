// cellFunctor.js Functor between GoFM and zoomGoL.js

import {convertBinaryArray} from './zoomGoL.js';

function cellFunctor(grid) {
    let newGrid = grid.map(row => row.map(cell => (cell !== 0) ? 1 : 0));
    //Sabotage!
    //newGrid[3][3] = 1 - newGrid[3][3]
    return convertBinaryArray(newGrid)
}

export {cellFunctor};
