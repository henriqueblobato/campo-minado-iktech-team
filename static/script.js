
let $container = $('#main-container');
let jsonData;
let gameArray = [];
let minutesLabel = $("#minutes");
let secondsLabel = $("#seconds");
let sec = 0;
let timer;

$(document).ready(() => {
    loadNewGame();

    timer = runTimer();

    $('#newGameBtn').on('click', () => {
        $container.css('visibility', 'hidden');
        $container.html('');
        jsonData.columns = $('#columns').val();
        jsonData.rows = $('#rows').val();
        console.log(jsonData)
        loadNewGame();
    });

    $container.on('click', '.unclicked', (event) => {
        const str = $(event.target).attr('id');
        const clickedXY = str.split('x');
        if (gameArray[clickedXY[0]][clickedXY[1]].marked) return;

        jsonData.clickedY = parseInt(clickedXY[0]);
        jsonData.clickedX = parseInt(clickedXY[1]);
        jsonData.data = gameArray;

        $.ajax({
            type: 'POST',
            url: '/postMoveData',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            success: (data) => {
                storeData(data);
                updateGameGrid();
                showMassage(data.message);
            },
            error: () => {
                alert('error sending data');
            }
        });
    });

    $container.on('contextmenu','.unclicked', (event) => {
        event.preventDefault();
        const clickedElement = $(event.target);
        const str = clickedElement.attr('id');
        const clickedXY = str.split('x');


        const field = gameArray[clickedXY[0]][clickedXY[1]];
        if (!field.marked) {
            clickedElement.html('&#128681;');
            jsonData.countOfMines--;
        } else {
            clickedElement.text('');
            jsonData.countOfMines++;
        }
        field.marked = !field.marked;
        updateGameGrid();
    });
});

const loadNewGame = () => {
    $.ajax({
        type: 'GET',
        url: '/newGameData',
        success: (data) => {
            storeData(data);
            createGameGrid();
        },
        error: () => {
            alert('error loading data');
        }
    });
}

const storeData = (data) => {
    console.log(data)
    jsonData =  JSON.parse(data);
    gameArray = JSON.parse(data);
}

const createGameGrid = () => {
    $("#rows").val(jsonData.rows);
    $("#columns").val(jsonData.columns);
    $('#mines').val(jsonData.countOfMines);
    $container.css('grid-template-columns', 'repeat(' + gameArray[0].length + ', auto)');
    gameArray.forEach((row, i) => {
        row.forEach((field, j) => {
            $container.append(`<div id="${i}x${j}" class="field unclicked" alt="field"></div>`);
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
    if(Number.isInteger(type)) return type
   
    const types = {
       'mine': '&#x1F4A3;',
       'explosion': '&#x1F4A3;',
       'flag': '&#128681;',
       'empty': '',
   } 
   return types[type];
}

const updateGameGrid = () => {
    for (let row = 0; row < jsonData.rows; row++) {
        for (let column = 0; column < jsonData.columns; column++) {
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
    $('#count-of-mines').text(jsonData.countOfMines);
}