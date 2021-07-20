
let $container = $('#main-container');
let matrixData;
let gameArray = [];
let minutesLabel = $("#minutes");
let secondsLabel = $("#seconds");
let sec = 0;
let timer;

directions = [
    {'x': 0, 'y':-1},
    {'x': 1, 'y':-1},
    {'x': 1, 'y': 0},
    {'x': 1, 'y': 1},
    {'x': 0, 'y': 1},
    {'x':-1, 'y': 1},
    {'x':-1, 'y': 0},
    {'x':-1, 'y':-1}
]

const setOpenedByEmpty = (element) => {
    const clickedXY = element.attr('id').split('x');
    const x = parseInt(clickedXY[0])
    const y = parseInt(clickedXY[1])
    const type = element.attr('data-value');
    //let field = matrixData[y][x];
    let columns = matrixData[0].length;
    let rows = matrixData.length

    if (element.hasClass('unclicked')) {
        element.addClass(`type-${type}`);
        element.removeClass('unclicked');
        element.html(fieldContent(type));
        if(type == '0') {
            directions.map((direction) => {
                let newX = x + direction['x'];
                let newY = y + direction['y'];

                if(((0 <= newX) && (newX < columns)) && ((0 <= newY) && (newY < rows))) {
                    const newElement = $(`#${x+direction['x']}x${y+direction['y']}`)
                    setOpenedByEmpty(newElement)
                }
            });
        }
    }

}

$(document).ready(() => {
    loadNewGame();

    timer = runTimer();

    $('#newGameBtn').on('click', () => {
        $container.css('visibility', 'hidden');
        $container.html('');
        const columns = $('#columns').val();
        const rows = $('#rows').val();
        const mines = $('#mines').val();
        const data = {columns, rows, mines}
        requestNewGame(data);
    });

    $container.on('click', '.unclicked', (event) => {
        const element = $(event.target);
        const type = element.attr('data-value');

        if(type === '0') {
            setOpenedByEmpty(element);
        } else {
            element.addClass(`type-${type}`);
            element.removeClass('unclicked');
            element.html(fieldContent(type));
        }

    });

    $container.on('contextmenu','.unclicked', (event) => {
        event.preventDefault();
        const clickedElement = $(event.target);
        const str = clickedElement.attr('id');
        const clickedXY = str.split('x');


        const field = gameArray[clickedXY[0]][clickedXY[1]];
        if (!field.marked) {
            clickedElement.html('&#128681;');
            matrixData.countOfMines--;
        } else {
            clickedElement.text('');
            matrixData.countOfMines++;
        }
        field.marked = !field.marked;
        updateGameGrid();
    });
});

const requestNewGame = (data) => {
    $.ajax({
        type: 'POST',
        url: '/newGameData',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => {
            console.log(data)
            storeData(data);
            createGameGrid();
        },
        error: () => {
            alert('error sending data');
        }
    });
}

const loadNewGame = () => {
    $.ajax({
        type: 'POST',
        url: '/newGameData',
        success: (data) => {
            storeData(data);
            createGameGrid();
        },
        error: () => {
            alert('error sending data');
        }
    });
}

const storeData = (data) => {
    matrixData = JSON.parse(data);
    gameArray = JSON.parse(data);
}

const createGameGrid = () => {
    $container.empty();
    $("#rows").val(matrixData.length);
    $("#columns").val(matrixData[0].length);
    $('#mines').val(matrixData.flat().filter(item => item == 'mine').length);
    $container.css('grid-template-columns', 'repeat(' + matrixData[0].length + ', auto)');
    matrixData.forEach((row, y) => {
        row.forEach((field, x) => {
            $container.append(`<div id="${x}x${y}" data-value=${field} class="field unclicked" alt="field"></div>`);
        });
    });
    $container.css('visibility', 'visible');
}

const pad = (val) => val > 9 ? val : "0" + val;

const runTimer = () => {
    return setInterval(() => {
        secondsLabel.text(pad(++sec % 60));
        minutesLabel.text(pad(parseInt(sec / 60, 10)));
    }, 1000);
}

const showMassage = (message) => {
    if (message == 'won') {
        clearInterval(timer);
        alert('Congratulations, You Won!');
    } else if (message == 'lost') {
        clearInterval(timer);
        alert('You Lost... Try it one more time!');
    }
}

const fieldContent = (type) => {
    if(parseInt(type)) return type == '0' ? '' : type;
   
    const types = {
       'mine': '&#x1F4A3;',
       'explosion': '&#x1F4A3;',
       'flag': '&#128681;',
   }
   
   return types[type];
}

const updateGameGrid = () => {
    for (let row = 0; row < matrixData.rows; row++) {
        for (let column = 0; column < matrixData.columns; column++) {
            const currentObject = gameArray[row][column];
            if (!currentObject.clickable) {
                const $field = $container.find('#' + row + 'x' + column);
                if ($field.hasClass('unclicked')) {
                    $field.addClass(`type-${currentObject.type}`);
                    if (currentObject.type != 'empty') $field.html(fieldContent(currentObject.type));

                    $field.removeClass('unclicked');
                }
            }
        }
    }
    //$('#count-of-mines').text(matrixData.countOfMines);
}