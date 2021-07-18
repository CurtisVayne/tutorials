//HTML elemek
const statusDiv = document.querySelector('.status');
const newDiv = document.querySelector('.new');

//játék változói
let gameOn = true;
let xIsNext = true;

const maxDimension = 15;

let gridData = new Array(maxDimension);

domReady(() => loadPage());

function loadPage() {
    initData();
    displayGrid();
}

function initData() {
    gridData = new Array(maxDimension);
    for (let i = 0; i < maxDimension; i++) {
        gridData[i] = new Array(maxDimension);
    }
}

function cleanGrid() {
    let gamediv = document.getElementById("gamediv");
    while (gamediv.hasChildNodes()) {
        gamediv.removeChild(gamediv.lastChild);
    }
}

function displayGrid() {
    cleanGrid();
    let gamediv = document.getElementById("gamediv");
    for (let y = 0; y < maxDimension; y++) {
        for (let x = 0; x < maxDimension; x++) {
            let elem = document.createElement("div");
            elem.className = "game-cell";

            if (gridData[x][y] == 1) {
                elem.className = "game-cell x";
            }

            if (gridData[x][y] == 2) {
                elem.className = "game-cell o";
            }
            elem.dataset.x = x;
            elem.dataset.y = y;
            elem.onclick = (ev) => {
                const x = Number(ev.target.dataset.x);
                const y = Number(ev.target.dataset.y);
                if (!gameOn || gridData[x][y] > 0) return;
                if (xIsNext) {
                    gridData[x][y] = 1;
                }
                else {
                    gridData[x][y] = 2;
                }
                xIsNext = !xIsNext;
                calcResult(x, y);
                displayGrid();
            };
            gamediv.append(elem);
        }
    }

}

function calcResult(startX, startY) {
    const shifter = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
    for (let i = 0; i < shifter.length; i++) {
        const element = shifter[i];
        let res = calcOnelineResult(startX, startY, element[0], element[1]);
        if (res > 0) {
            statusDiv.innerHTML = `Nyert:${res}`;
            console.log("Nyert", res);
            gameOn = false;
        }
    }
}

function calcOnelineResult(startX, startY, shiftX, shiftY) {
    let actX = startX;
    let actY = startY;
    let cnt = 0;
    let lastItem = gridData[actX][actY];
    while (true) {
        if (lastItem == gridData[actX][actY]) {
            cnt++;
            if (cnt == 5) {
                return lastItem;
            }
            actX += shiftX;
            actY += shiftY;
            if (actX >= maxDimension || actY >= maxDimension || actX < 0 || actY < 0) {
                return 0;
            }
        }
        else {
            return 0;
        }
    }

}

const handleReset = () => {
    xIsNext = true;
    statusDiv.innerHTML = 'Következő lépés: X';
    winner = null;
    gameOn = true;
    initData();
    displayGrid();
};

newDiv.addEventListener('click', handleReset);

function domReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
    if (document.readyState === "interactive" || document.readyState === "complete") {
        fn();
    }
}