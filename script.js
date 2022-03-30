const GameBoard = ((n) => {
    const board = new Array(3).fill(0).map(() => new Array(3).fill(0));
    const getLength = () => {
        return n;
    }
    const get = (i, j) => {
        return board[i][j];
    }
    const change = (i, j, id) => {
        board[i][j] = id;
    }
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                board[i][j] = 0;
            }
        }
    }
    return {
        board,
        getLength,
        get,
        change,
        reset
    }
})(3)

const Player = (isPlayerOne) => {
    let id = 0;
    if (isPlayerOne) {
        id = 1;
    } else {
        id = - 1;
    }
    return {id};
}

const Game = (() => {
    const player1 = Player(true);
    const player2 = Player(false);
    const board = GameBoard;
    const n = board.getLength();
    let boardPlayed = 0;

    const checkOpen = (i, j) => {
        return board.get(i, j) == 0;
    }

    const makeAction = (i, j, isPlayerOne) => {
        if (isPlayerOne) {
            board.change(i, j, player1.id);
        } else {
            board.change(i, j, player2.id);
        }
        boardPlayed += 1;
    }

    const checkGameOver = () => {
        let descendingDiagonalSum = 0;
        let ascendingDiagonalSum = 0;
        for (let i = 0; i < n; i++) {
            let rowSum = 0;
            let colSum = 0;
            for (let j = 0; j < n; j++) {
                rowSum += board.get(i, j);
                colSum += board.get(j, i);

                if (i == j) {
                    descendingDiagonalSum += board.get(i, j);
                }
                if (i == (n - j - 1)) {
                    ascendingDiagonalSum += board.get(i, j);
                }

            }
            if (rowSum == 3 || colSum == 3) {
                return 1;
            }
            if (rowSum == -3 || colSum == -3) {
                return -1;
            }
        }

        if (ascendingDiagonalSum == 3 || descendingDiagonalSum == 3) {
            return 1;
        }
        if (ascendingDiagonalSum == -3 || descendingDiagonalSum == -3) {
            return -1;
        }

        if (boardPlayed == (n * n)) {
            return 5;
        }

        return 0;
    }

    const resetGame = () => {
        board.reset();
        boardPlayed = 0;
    }

    return {
        checkOpen,
        makeAction,
        checkGameOver,
        resetGame
    }

})()


const UI = (() => {
    const board = document.querySelector(".board");
    const endMessage = document.querySelector("#game-end-message");
    const resetButton = document.querySelector("#reset-button");
    const n = GameBoard.getLength();
    let isPlayerOne = true;
    let gameOver = false;

    const open = () => {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let box = document.createElement("button");
                box.setAttribute("id", ("id" + i.toString() + j.toString()));
                box.classList.add("box");
                board.appendChild(box);
            }
        }
    }

    const changeDisplay = (i, j) => {
        if (gameOver || !Game.checkOpen(i, j)) {
            return;
        }
        Game.makeAction(i, j, isPlayerOne);
        const targetBox = document.querySelector("#id" + i.toString() + j.toString())
        if (isPlayerOne) {
            targetBox.classList.add("player-one-box");
        } else {
            targetBox.classList.add("player-two-box");
        }
        isPlayerOne = !isPlayerOne;
    }

    const gameIsOver = (winner) => {
        gameOver = true;
        if (winner == 1) {
            endMessage.textContent = "Winner is Dino 1!";
        } else if (winner == -1) {
            endMessage.textContent = "Winner is Dino 2!";
        } else {
            endMessage.textContent = "It is a tie!";
        }
        endMessage.style.visibility = "visible";
        resetButton.style.visibility = "visible";
    }

    const reset = () => {
        isPlayerOne = true;
        gameOver = false;
        endMessage.style.visibility = "hidden";
        resetButton.style.visibility = "hidden";
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const boxToReset = document.querySelector("#id" + i.toString() + j.toString())
                console.log(boxToReset);
                if (boxToReset.classList.contains("player-one-box")) {
                    boxToReset.classList.toggle("player-one-box");
                }
                if (boxToReset.classList.contains("player-two-box")) {
                    boxToReset.classList.toggle("player-two-box");
                }
            }
        }
    }

    return {
        open,
        changeDisplay,
        gameIsOver,
        reset
    }

})()


function boxClicked() {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.addEventListener("click", () => {
            i = parseInt(box.id.slice(-2, -1));
            j = parseInt(box.id.slice(-1));
            UI.changeDisplay(i, j);
            checkGameOver = Game.checkGameOver()
            if (checkGameOver == 1) {
                UI.gameIsOver(1);
            } else if (checkGameOver == -1) {
                UI.gameIsOver(-1);
            } else if (checkGameOver == 5) {
                UI.gameIsOver(5);
            }
        })
    })
}

function resetClicked() {
    const replay = document.querySelector("#reset-button");
    replay.addEventListener("click", () => {
        UI.reset();
        Game.resetGame();
    })
}


function main() {
    UI.open();
    boxClicked();
    resetClicked();
}

main();