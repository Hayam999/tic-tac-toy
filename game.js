document.addEventListener("DOMContentLoaded", () => {
    const playbtn = document.getElementById("play-button");
    playbtn.addEventListener("click", () => {
        const playDiv = document.getElementById("start-game");
        const gameName = document.getElementById("game-name");
        playDiv.remove();
        gameName.style.textAlign = "left";
        gameName.style.marginTop = "0";
        setPlayers();
    })
})


function setPlayers() {
    const playDiv = document.getElementById("start-game");
    const addPlayersDialog = document.getElementById("add-players-dialog");
    const addPlayersForm = document.getElementById("add-players-form");
    const closeBtn = document.getElementById("close-add-players-dialog");

    const oldGround = document.getElementById("ground");
    if (oldGround) {
        oldGround.remove();
    }

    addPlayersDialog.showModal();

    //closing the dialog without adding players
    closeBtn.addEventListener("click", () => {
        addPlayersDialog.close();
        addPlayersForm.reset();
        const waitForPlayersBtn = 
        document.getElementById("waitForPlayersBtn");
        waitForPlayers();
    });

    function waitForPlayers() {
        const waitForPlayersBtn = document.createElement("button");
        waitForPlayersBtn.id = "waitForPlayersBtn";
        waitForPlayersBtn.textContent = "Add Players";
        document.body.appendChild(waitForPlayersBtn);

        waitForPlayersBtn.addEventListener("click", () => {
            waitForPlayersBtn.remove();
            addPlayersDialog.showModal();
        });
    }

    function handlePlayerSubmission(e) {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(addPlayersForm);
        let player1 = addPlayer(formData.get("player1"), 0);
        let player2 = addPlayer(formData.get("player2"), 0);
        
        if ((player1.name != "") && (player2.name != "")) {
            addPlayersDialog.close();
            addPlayersForm.reset();
            createGameboard();
            GameModule.play(player1, player2);
        }
    }
    addPlayersForm.addEventListener("submit", handlePlayerSubmission);
    addPlayersDialog.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handlePlayerSubmission(e);
        }
    });

}


const GameModule = (function() {
    let clickCounter = 1;

    function nextRound(message, board, winner, loser) {
        const result = document.getElementById("result");
        const resultcontent = document.getElementById("result-content");
        const playAgain = document.getElementById("continue");
        const restartGame = document.getElementById("new-players");
        clickCounter = 1;

        if (message == "") {
            resultcontent.textContent = "It's a tie 😿";
            
        }
        else {
            resultcontent.textContent = message + " Wins 😺 🎊 🎊 🎊\n" +
            "Score (" + winner.name + ": " + winner.score + ", "
             + loser.name + ": " + loser.score + ")"; 
            
        }

        playAgain.replaceWith(playAgain.cloneNode(true));
        restartGame.replaceWith(restartGame.cloneNode(true));

        const newPlayAgain = document.getElementById("continue");
        const newRestartGame = document.getElementById("new-players");

        newPlayAgain.addEventListener("click", () => {
            result.close();
            cleanBoard(board);
        })

        newRestartGame.addEventListener("click", () => { 
            result.close();
            const oldGround = document.getElementById("ground");
            if (oldGround) {
                oldGround.remove();
            }
            board.erase();
            setPlayers();

        })

        result.showModal();

    }
    function cleanBoard(board) {
        //Earasing the X and Os from the ground
        for (let i = 0; i <= 2; i++){
            for (let j = 1; j <= 3; j++) {
                const n = ((3 * i) + j);
                const tile = document.getElementById("tile" + n);
                if (tile.textContent != null) {
                tile.textContent = "";
                }
            }
        }
        
        board.erase();
    }

    return {
        play(player1, player2) {
            const board = gameBoard();
            console.log(board.gboard)
            const ground = document.getElementById("ground");

            ground.addEventListener("click", (e) => {
                const tile = e.target;
                const idString = e.target.id;
                const p = Number(idString.charAt(idString.length - 1)) - 1;
                 
             if (tile.textContent.trim() === "") {
                if (clickCounter % 2 == 0) {
                    tile.textContent = "O";
                    board.addMark("O", p);
                    clickCounter++;
                    if ((board.checkwinner(clickCounter)) == "O") {
                        player2.incrementScore();
                        nextRound(player2.name, board, player2, player1);
                    }
                    else if (board.filled()) {
                        nextRound("", board);
                    }
                }
                else {
                    tile.textContent = "X";
                    board.addMark("X", p);
                    clickCounter++;
                    if((board.checkwinner(clickCounter)) == "X") {
                        player1.incrementScore();
                        nextRound(player1.name, board, player1, player2);
                    }
                    else if (board.filled()) {
                        nextRound("", board);
                    }
                } 
            }
        })}}}
)();


// factory function that returns objects and used to create more than one object
function addPlayer(name, score) {
    return {
        name, score,
        incrementScore() {
            this.score++;
        }
    };
}

function gameBoard() {
    const gboard = new Array(9).fill(null);
    function checkWin() {
        return(
            (((gboard[0] === gboard[1]) && (gboard[1] === gboard[2])) && gboard[2]) ||
            (((gboard[3] === gboard[4]) && (gboard[4] === gboard[5])) && gboard[5]) ||
            (((gboard[6] === gboard[7]) && (gboard[7] === gboard[8])) && gboard[8]) ||
            (((gboard[0] === gboard[3]) && (gboard[3] === gboard[6])) && gboard[6]) ||
            (((gboard[1] === gboard[4]) && (gboard[4] === gboard[7])) && gboard[7]) ||
            (((gboard[2] === gboard[5]) && (gboard[5] === gboard[8])) && gboard[8]) || 
            (((gboard[0] === gboard[4]) && (gboard[4] === gboard[8])) && gboard[8]) ||
            (((gboard[2] === gboard[4]) && (gboard[4] === gboard[6])) && gboard[6]));
    }

    return {
        gboard
        ,addMark(m, p) {
            gboard[p] = m;
       
        }
        ,checkwinner(clickCounter) {
            if (clickCounter >= 6) {
               return checkWin();     
            }
            else {
               return false;
            } 
        }
        ,erase() {
            for (let i = 0; i <= 9; i++) {
                if (gboard[i] != null) {
                    gboard[i] = null;
                }
            }
        }
        ,filled() {
            for (let i = 0; i < 9; i++) {
                if (gboard[i] == null) {
                    return false;
                }
            }
            return true;
        }
    }
}

const createGameboard = (function () {
    const ground = document.createElement("div");
    ground.id = "ground";
    

    for (let i = 0; i < 3; i++) {
        for (let j = 1; j <= 3; j++) {
            const tile = document.createElement("div");
            const n = ((3 * i) + j);
            tile.id = "tile" + n; 
            tile.className = "tile";
            if ((n % 2) == 0) {
                tile.classList.add("even");
            }
            ground.appendChild(tile);
        }
    }
    document.body.appendChild(ground);
})