export default class Tile {
    constructor(x, y, i) {
        this.x = x;
        this.y = y
        this.i = i
    }

    originalPosition(currentIndex) {
        return this.index === currentIndex ? true : false
    }
}

export class RemovedTile extends Tile {
    constructor(x, y, i, totalCols, totalRows) {
        super(x, y, i)
        this.totalRows = totalRows
        this.totalCols = totalCols
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
    }

    randomNeighbor() {
        let self = this
        let randomDirection = Math.floor(Math.random() * 4)
        if (randomDirection === 0 && self.x > 0) { return [self.x - 1, self.y] }
        if (randomDirection === 1 && self.y > 0) { return [self.x, self.y - 1] } 
        if (randomDirection === 2 && self.x < self.totalCols) { return [self.x + 1, self.y] }
        if (randomDirection === 3 && self.y < self.totalRows) { return [self.x, self.y + 1] }   
        return self.randomNeighbor()
    }
}