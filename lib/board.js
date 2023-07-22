export class Square {
    /** @type {HTMLElement} The square HTML element. */
    element;
    /** @type {Board} The board this square belongs to. */
    board;
    /** @type {number} The x coordinate of this square starting from the upper left corner, zero-based. */
    x;
    /** @type {number} The y coordinate of this square starting from the upper left corner, zero-based. */
    y;
    /** @type {boolean} Whether this square has been visited or not. */
    visited = false;

    /**
     * @param {Board} board The board this square belongs to.
     * @param {number} x The x coordinate of this square starting from the upper left corner, zero-based.
     * @param {number} y The y coordinate of this square starting from the upper left corner, zero-based.
     */
    constructor(board, x, y) {
        this.element = document.createElement("article");
        this.element.classList.add("square");
        this.board = board;
        this.x = x;
        this.y = y;

        this.element.addEventListener("click", () => {
            if (
                this.board.visitedSquares.length > 0 &&
                this.board.nextSquares.indexOf(this) === -1
            ) {
                return;
            }
            this.visited = true;
            this.mark();
            this.board.currentSquare = this;
            this.board.clickListener();
        });
    }

    /** Mark this square as visited. */
    mark() {
        this.element.insertAdjacentHTML("afterbegin", "<span>&#9822;</span>");
        if (this.board.visitedSquares.length > 0) {
            this.board.visitedSquares[
                this.board.visitedSquares.length - 1
            ].element.getElementsByTagName("span")[0].textContent = String(
                this.board.visitedSquares.length
            );
        }
        this.board.visitedSquares.push(this);
    }
    /** Hint this square as the next possible destination by coloring it. */
    hint() {
        this.element.style.backgroundColor = "var(--background-hint-color)";
    }
    /** Unhint this square. */
    unhint() {
        this.element.style.backgroundColor = "transparent";
    }
}
export class Board {
    /** @type {number} The size of this board. */
    size;
    /** @type {boolean} Whether to show hints(available moves) or not. */
    showHints;
    /** @type {HTMLElement} The board HTML element. */
    element;
    /** @type {Array<Array<Square>>} The ranks that consist this board. */
    ranks;
    /** @type {Square} The square the knight is currently on. */
    currentSquare;
    /** @type {Array<Square>} The squares that have been visited in order. */
    visitedSquares = [];

    /**
     * @param {number} size The size of this board.
     * @param {boolean} showHints Whether to show hints(available moves) or not.
     */
    constructor(size, showHints) {
        this.size = size;
        this.showHints = showHints;
        this.element = document.createElement("article");
        this.element.classList.add("board");
        this.element.style.setProperty("--board-size", String(this.size));
        this.ranks = [];
        for (let y = 0; y < this.size; y++) {
            this.ranks.push([]);
            for (let x = 0; x < this.size; x++) {
                this.ranks[y].push(new Square(this, x, y));
                this.element.appendChild(this.getSquare(x, y).element);
            }
        }
    }

    /** @returns {Array<Square>} All the squares in this board. */
    get squares() {
        return this.ranks.reduce((prev, rank) => prev.concat(rank), []);
    }
    /** @returns {?Array<Square>} All the squares the next move can lead to. */
    get nextSquares() {
        if (!this.currentSquare) return [];
        const { x, y } = this.currentSquare;
        const nextSquares = [
            this.getSquare(x + 1, y + 2),
            this.getSquare(x + 2, y + 1),
            this.getSquare(x - 1, y + 2),
            this.getSquare(x - 2, y + 1),
            this.getSquare(x - 1, y - 2),
            this.getSquare(x - 2, y - 1),
            this.getSquare(x + 1, y - 2),
            this.getSquare(x + 2, y - 1),
        ].filter((square) => square && !square.visited);
        return nextSquares;
    }

    /**
     * Gets the square by its x, y coordinate.
     * @param {number} x The x coordiante of the square to get starting from the upper left corner, zero-based.
     * @param {number} y The y coordiante of the square to get starting from the upper left corner, zero-based.
     * @returns {?Square} The matching Square instance, null if it doesn't exist.
     */
    getSquare(x, y) {
        return this.ranks[y]?.[x];
    }
    /**
     * Attaches the board element to the end of the parent element.
     * @param {HTMLElement} parent The parent element to attach this board to.
     */
    attach(parent) {
        parent.appendChild(this.element);
    }
    /** Resets the board. */
    reset() {
        const parent = this.element.parentElement;
        this.element.remove();
        const board = new Board(this.size, this.showHints);
        board.attach(parent);
    }
    /** Executed when an available square is hit. */
    clickListener() {
        if (this.showHints) {
            this.squares.forEach((square) => square.unhint());
            this.nextSquares.forEach((square) => square.hint());
        }
        if (this.visitedSquares.length === this.size ** 2) {
            alert("Congratulations!");
        } else if (this.nextSquares.length === 0) {
            setTimeout(() => {
                alert("Try again.");
                this.reset();
            }, 500);
        }
    }
}