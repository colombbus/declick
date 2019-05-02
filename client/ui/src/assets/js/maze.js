import shuffle from 'lodash.shuffle'

const UP = 1
const RIGHT = 2
const DOWN = 3
const LEFT = 4

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

export function generateMaze(maze) {
    const height = maze.length
    const width = maze[0].length
    // Generate random row
    let row = getRandomInt(height)
    while (row % 2 === 0) {
        row = getRandomInt(height)
    }
    // Generate random col
    let col = getRandomInt(width)
    while (col % 2 == 0) {
        col = getRandomInt(width)
    }
    // Starting cell
    maze[row][col] = 0

    // Allocate the maze with recursive method
    recursion(maze, row, col)

    return maze
}

export function recursion(maze, row, col) {
    const height = maze.length
    const width = maze[0].length

    // 4 random directions array
    const randDirs = generateRandomDirections()

    // Examine each direction
    randDirs.map(dir => {
        switch (dir) {
            case UP:
                // Whether 2 cells up is out or not
                if (row - 2 <= 0) { } else {
                    if (maze[row - 2][col] != 0) {
                        maze[row - 2][col] = 0
                        maze[row - 1][col] = 0
                        recursion(maze, row - 2, col)
                    }
                }
                break
            case RIGHT:
                // Whether 2 cells to the right is out or not
                if (col + 2 >= width - 1) { } else {
                    if (maze[row][col + 2] != 0) {
                        maze[row][col + 2] = 0
                        maze[row][col + 1] = 0
                        recursion(maze, row, col + 2)
                    }
                }
                break
            case DOWN:
                // Whether 2 cells down is out or not
                if (row + 2 >= height - 1) { } else {
                    if (maze[row + 2][col] != 0) {
                        maze[row + 2][col] = 0
                        maze[row + 1][col] = 0
                        recursion(maze, row + 2, col)
                    }
                }
                break
            case LEFT:
                // Whether 2 cells to the left is out or not
                if (col - 2 <= 0) { } else {
                    if (maze[row][col - 2] != 0) {
                        maze[row][col - 2] = 0
                        maze[row][col - 1] = 0
                        recursion(maze, row, col - 2)
                    }
                }
                break
        }
    })

}

/**
* Generate an array with random directions 1-4
* @return Array containing 4 directions in random order
*/
export function generateRandomDirections() {
    return shuffle([UP, RIGHT, DOWN, LEFT])
}