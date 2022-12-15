import Tile, { RemovedTile } from "./tile.js";

let canvas, ctx;

let rows = 2;
let cols = 2;
let w, h;
let tiles = []
let board = []
let removedTile

const source = "./material/slidePuzzle2/Weihnachtsmann-Motorrad.jpg";
const img = new Image();
img.addEventListener("load", () => setup())
img.src = source;



function setup() {
    const createdCanvas = document.createElement("canvas")
    createdCanvas.id = "canvas"
    createdCanvas.width = img.width
    createdCanvas.height = img.height
    document.body.insertBefore(createdCanvas, document.getElementById("finalImage"))
    canvas = document.getElementById("canvas");
    ["click", "touchstart"].forEach(touch => {
        canvas.addEventListener(touch, e => {
            const rect = canvas.getBoundingClientRect()
            const relativeX = e.clientX - rect.left
            const relativeY = e.clientY - rect.top
            const selectedColumn = Math.floor(relativeX / (rect.width / cols))
            const selectedRow = Math.floor(relativeY / (rect.height / rows))
            move(selectedColumn, selectedRow)
            draw()
            if (solved()) {
                finalAnimation()
            }
        })
    })

    ctx = canvas.getContext("2d")
    ctx.strokeStyle = "white"
    ctx.fillStyle = "#fee4a3"
    start()
}

document.querySelector("select").addEventListener("change", e => changeDifficulty(e.target.value))


function changeDifficulty(level) {
    if (level === "lifeOrDeath") {rows = 15, cols = 15}
    else if (level === "extreme") { rows = 9, cols = 9 }
    else if (level === "hard") { rows = 7, cols = 7 }
    else if (level === "medium") { rows = 4, cols = 4 }
    else { rows = 2, cols = 2 };
    tiles = []
    board = []
    start()
}

function start() {
    w = img.width / cols
    h = img.height / rows

    let middleIndex = Math.floor((rows - 1) * cols / 2)
    for (let y = 0; y < rows; y++) {
        let row = []
        for (let x = 0; x < cols; x++) {
            let i = x + y * cols
            tiles.push((i === middleIndex) ? new RemovedTile(x, y, i, cols - 1, rows - 1) : new Tile(x, y, i))
            row.push(i)
        }
        board.push(row)
    }

    removedTile = tiles[middleIndex]
    shuffle()
    draw()
}


function shuffle() {
    for (let reps = Math.pow(rows * cols, 2); reps > 0; reps--) {
        move(...removedTile.randomNeighbor())
    }
}


function move(x, y) {
    if (Math.abs(x - removedTile.x) + Math.abs(y - removedTile.y) === 1) {
        [board[removedTile.y][removedTile.x], board[y][x]] = [board[y][x], board[removedTile.y][removedTile.x]]
        removedTile.updatePosition(x, y)
    }
}


function draw() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let tile = tiles[board[y][x]]
            if (tile.i === removedTile.i) {
                ctx.fillRect(
                    removedTile.x * w, removedTile.y * h, w, h
                )
            } else {
                ctx.drawImage(
                    img, tile.x * w, tile.y * h, w, h,
                    x * w, y * h, w, h
                )
                ctx.strokeRect(
                    tile.x * w, tile.y * h, w, h
                )
            }
        }
    }
}

function solved() {
    const boardIndices = board.flat()
    for (let i = 0; i < boardIndices.length; i++) {
        if (boardIndices[i] !== tiles[i].i) {
            return false
        }
    }
    return true
}

function finalAnimation() {
    const finalImg = new Image()
    finalImg.addEventListener("load", () => {
        ctx.drawImage(finalImg, 0, 0, canvas.width, canvas.height)
        setTimeout(() => {
            if (confirm("Glückwunsch, du hast das Puzzle gelöst! Nochmal spielen?")) {
                start()
            }
        }, 1000);
    })
    finalImg.src = source
}