$(document).ready(function () {
    const tileDistribution = [
        { letter: "A", value: 1, amount: 9 },
        { letter: "B", value: 3, amount: 2 },
        { letter: "C", value: 3, amount: 2 },
        { letter: "D", value: 2, amount: 4 },
        { letter: "E", value: 1, amount: 12 },
        { letter: "F", value: 4, amount: 2 },
        { letter: "G", value: 2, amount: 3 },
        { letter: "H", value: 4, amount: 2 },
        { letter: "I", value: 1, amount: 9 },
        { letter: "J", value: 8, amount: 1 },
        { letter: "K", value: 5, amount: 1 },
        { letter: "L", value: 1, amount: 4 },
        { letter: "M", value: 3, amount: 2 },
        { letter: "N", value: 1, amount: 6 },
        { letter: "O", value: 1, amount: 8 },
        { letter: "P", value: 3, amount: 2 },
        { letter: "Q", value: 10, amount: 1 },
        { letter: "R", value: 1, amount: 6 },
        { letter: "S", value: 1, amount: 4 },
        { letter: "T", value: 1, amount: 6 },
        { letter: "U", value: 1, amount: 4 },
        { letter: "V", value: 4, amount: 2 },
        { letter: "W", value: 4, amount: 2 },
        { letter: "X", value: 8, amount: 1 },
        { letter: "Y", value: 4, amount: 2 },
        { letter: "Z", value: 10, amount: 1 },
        { letter: "Blank", value: 0, amount: 2 }
    ];

    const bonusTiles = [
        { position: 3, type: "doubleWord" },
        { position: 7, type: "doubleLetter" },
        { position: 9, type: "doubleLetter" },
        { position: 13, type: "doubleWord" }
    ];

    let totalScore = 0;

    function initializeBoard() {
        const squarePositions = Array.from({ length: 15 }, (_, i) => ({
            left: i * 60 
        }));

        squarePositions.forEach((position, index) => {
            const square = $("<div class='square'></div>").css({
                left: `${position.left}px`,
                top: 0
            });

            const bonus = bonusTiles.find(b => b.position === index + 1);
            if (bonus) {
                square.addClass(bonus.type);
                if (bonus.type === "doubleWord") {
                    square.text("");
                } else if (bonus.type === "doubleLetter") {
                    square.text("");
                }
            }

            $("#board").append(square);
        });

        $(".square").droppable({
            accept: ".tile",
            drop: function (event, ui) {
                const tileLetter = ui.draggable.data("letter");
                const tileValue = ui.draggable.data("value");
                const tileImage = `Scrabble_Tiles/Scrabble_Tile_${tileLetter}.jpg`;

                $(this).html(`<img src="${tileImage}" alt="${tileLetter}" style="width: 60px; height: 60px;" />`);
                $(this).data("tile", { letter: tileLetter, value: tileValue });
                updateCurrentWord(); 
                ui.draggable.remove();
            }
        });
    }

    function resetBoard() {
        $(".square").each(function () {
            $(this).empty();
            $(this).removeData("tile");
        });
        updateCurrentWord();
    }

    function resetGame() {
        resetBoard();
        dealTiles();
        totalScore = 0;
        $("#totalScore").text("Total Score: 0");
    }

    function dealTiles() {
        $("#rack").empty();
        let availableTiles = [];
        tileDistribution.forEach(tile => {
            for (let i = 0; i < tile.amount; i++) {
                availableTiles.push({ letter: tile.letter, value: tile.value });
            }
        });

        for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            const tile = availableTiles.splice(randomIndex, 1)[0];
            addTileToRack(tile);
        }
    }

    function addTileToRack(tile) {
        const tileImage = `Scrabble_Tiles/Scrabble_Tile_${tile.letter}.jpg`;
        const tileDiv = $(`<div class="tile"><img src="${tileImage}" alt="${tile.letter}" style="width: 60px; height: 60px;" /></div>`);
        tileDiv.data("value", tile.value);
        tileDiv.data("letter", tile.letter);
        $("#rack").append(tileDiv);
        tileDiv.draggable({
            revert: "invalid",
            containment: "body"
        });
    }

    function getCurrentWord() {
        const word = [];
        $(".square").each(function () {
            const tile = $(this).data("tile");
            if (tile) {
                word.push(tile.letter);
            }
        });
        return word.join("");
    }

    function getTilesOnBoard() {
        const tiles = [];
        $(".square").each(function (index) {
            const tile = $(this).data("tile");
            if (tile) {
                tiles.push({
                    letter: tile.letter,
                    value: tile.value,
                    position: index + 1 
                });
            }
        });
        return tiles;
    }

    function updateCurrentWord() {
        const currentWord = getCurrentWord();
        $("#currentWord").text(`Current Word: ${currentWord || "None"}`);
    }

    function calculateScore(tiles) {
        let score = 0;
        let wordMultiplier = 1;

        tiles.forEach(tile => {
            const bonus = bonusTiles.find(b => b.position === tile.position);
            if (bonus) {
                if (bonus.type === "doubleLetter") {
                    score += tile.value * 2;
                } else if (bonus.type === "doubleWord") {
                    score += tile.value;
                    wordMultiplier *= 2;
                }
            } else {
                score += tile.value;
            }
        });

        return score * wordMultiplier;
    }

    $("#dealTiles").click(function () {
        dealTiles();
    });

    $("#restartGame").click(function () {
        resetGame();
    });

    $("#submitWord").click(function () {
        const word = getCurrentWord();
        const tilesOnBoard = getTilesOnBoard();

        if (word.length === 0) {
            alert("No tiles placed on the board.");
            return;
        }

        const score = calculateScore(tilesOnBoard);
        totalScore += score;

        $("#totalScore").text(`Total Score: ${totalScore}`);
        alert(`Word submitted! Word: ${word}, Score: ${score}`);


        resetBoard();
        updateCurrentWord();
    });

    initializeBoard();
    dealTiles();
});
