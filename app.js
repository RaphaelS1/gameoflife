
const prompt = require('prompt-sync')();
console.log("\x1b[33m John Conway's Game of Life \x1b[0m");
let test;
let size;
let rows;
let cols;
let array = [];

function testGrid() {
  size = prompt("Input grid size qas 'RowsXCols' or enter 'q' to cancel, default 5x5. ");
  if (size === "") {
    size = "5x5"
  }
  if (size === "q") {
    process.exit(0);
  }
  const regex = new RegExp('[1-9][0-9]*[xX][1-9][0-9]*')
  test = regex.test(size);
}

testGrid()
while (!test) {
  console.log("\x1b[91m Error, input size in 0x0 format. \x1b[0m");
  testGrid();
}

function printMatrix() {
  for (var i = 0; i < array.length; i++) {
      var row = "";
      for (var j = 0; j < array[i].length; j++) {
          row += array[i][j] ? alive : dead;
      }
      console.log(row);
  }
}

const dead = "\x1b[91m\u25A0 \x1b[0m"
const alive = "\x1b[92m\u25A0 \x1b[0m"

function generateGrid(size) {
  const iX = size.search(/x|X/);
  rows = size.substring(0, iX)
  cols = size.substring(iX + 1)
  for (let i = 0; i < rows; i++) {
    array[i] = [];
    for (let j = 0; j < cols; j++) {
      array[i][j] = 0;
    }
  }
}

generateGrid(size)
printMatrix()

const totalCells = rows * cols;

function testSeed() {
  const defaultSize = Math.floor(totalCells * 0.5)
  seedSize = prompt(`Enter number of cells to seed between 1 and ${totalCells} or enter 'q' to cancel, default ${defaultSize}: `);
  if (seedSize === "") {
    seedSize = defaultSize
  }
  if (seedSize === "q") {
    process.exit(0);
  }
  test = seedSize >= 1 & seedSize <= totalCells;
}

test = false;
testSeed();
while (!test) {
  console.log(`\x1b[91m Error, number of cells to seed must be between 1 and ${totalCells}. \x1b[0m`);
  testSeed();
}

initialize(seedSize)

function initialize(seedSize) {
  const min = Math.ceil(1);
  const max = Math.floor(rows * cols);

  for (let i = 0; i < seedSize; i++) {
    which = Math.floor(Math.random() * (max - min) + min);
    const row = Math.floor(which / cols);
    const col = which % cols;
    array[row][col] = 1
  }
}
printMatrix()

function nextGeneration() {
  function neighbours(r, c) {
    let out = 0;
    let p_rows = new Set()
    p_rows.add(Math.max(r - 1, 0))
    p_rows.add(r)
    p_rows.add(Math.min(rows - 1, r + 1))

    let p_cols = new Set()
    p_cols.add(Math.max(c - 1, 0))
    p_cols.add(c)
    p_cols.add(Math.min(cols - 1, c + 1))

    out = 0
    for (ri of p_rows) {
      for (ci of p_cols) {
        out += array[ri][ci]
      }
    }

    return out
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let status = neighbours(i, j)
      // Any live cell with fewer than two live neighbors dies
      // Any live cell with more than three live neighbors dies
      if (array[i][j] & (status < 2 | status > 3)) {
        array[i][j] = 0
      }
      // Any dead cell with exactly three live neighbors becomes a live cell
      if (!array[i][j] & status == 3) {
        array[i][j] = 1
      }
    }
  }
}

while (true) {
  generate = prompt(`How many generations do you want to simulate? Enter '0' to exit. Default is 5.`);

  if (generate === "0") {
    process.exit(0);
  }

  if (generate === "") {
    generate = 5;
  }

  const regex = new RegExp('[1-9][0-9]*')
  test = regex.test(generate);
  if (!test) {
    console.log("\x1b[91m Error, input generations as a number. \x1b[0m");
    continue
  }

  for (let i = 0; i < generate;  i++) {
    nextGeneration()
    printMatrix()
    console.log()
  }
}
