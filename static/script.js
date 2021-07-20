
let $container = $('#main-container');
let matrixData;
let gameArray = [];
let minutesLabel = $("#minutes");
let secondsLabel = $("#seconds");
let sec = 0;
let timer;

const directions = [
    {'x': 0, 'y':-1},
    {'x': 1, 'y':-1},
    {'x': 1, 'y': 0},
    {'x': 1, 'y': 1},
    {'x': 0, 'y': 1},
    {'x':-1, 'y': 1},
    {'x':-1, 'y': 0},
    {'x':-1, 'y':-1}
]

$(document).ready(() => {
    loadNewGame();

    $('#columns').change(requestNewGame);
    $('#rows').change(requestNewGame);
    $('#mines').change(requestNewGame);


    $container.on('click', '.unclicked', (event) => {
        const element = $(event.target);
        const type = element.attr('data-value');

        if(type === '0') {
            setOpenedByEmpty(element);
        } else if (type == 'mine') {
            setExplosion(element);
        } else if (!element.hasClass('type-flag')) {
            setClicked(element, type);
            verifyWin();
        }

    });

    $container.on('contextmenu','.unclicked', (event) => {
        event.preventDefault();
        const clickedElement = $(event.target);
        const str = clickedElement.attr('id');
        const clickedXY = str.split('x');
    
        const field = gameArray[clickedXY[0]][clickedXY[1]];
        if (!clickedElement.hasClass('type-flag')) {
            clickedElement.html(fieldContent('flag'));
            clickedElement.addClass(`type-flag`);
            matrixData.countOfMines--;
        } else {
            clickedElement.text('');
            clickedElement.removeClass(`type-flag`);
            matrixData.countOfMines++;
        }
    });
});

const setClicked = (element, type) => {
    element.addClass(`type-${type}`);
    element.removeClass('unclicked');
    element.html(fieldContent(type));
}

const requestNewGame = () => {
    $container.css('visibility', 'hidden');
    $container.empty();
    const columns = $('#columns').val();
    const rows = $('#rows').val();
    const mines = $('#mines').val();
    const data = {columns, rows, mines}

    $.ajax({
        type: 'POST',
        url: '/newGameData',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => {
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
    clearInterval(timer);
    timer = runTimer();
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
    const text = message == 'won' ? 'Congratulations, You Won!' : 'You Lost... Try it one more time!';
    $('.modal h2').text(message.toUpperCase());
    $('.modal p').text(text);
    $('#modal').show("closed");
    clearInterval(timer);

    $('#btnCancel').on('click', () => {
        $("#modal").fadeOut();
    });

    $('#btnNewGame').on('click', () => {
        $("#modal").fadeOut();
        requestNewGame();
    });
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

const setOpenedByEmpty = (element) => {
    const clickedXY = element.attr('id').split('x');
    const x = parseInt(clickedXY[0])
    const y = parseInt(clickedXY[1])
    const type = element.attr('data-value');
    let columns = matrixData[0].length;
    let rows = matrixData.length

    if (element.hasClass('unclicked') && !element.hasClass('type-flag')) {
        setClicked(element, type);

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

const setExplosion = (element) => {
    setClicked(element, 'explosion');

    showAllField($('.field:not(.type-explosion)'))

    showMassage('lost')
}

const verifyWin = () => {
    const notMines = $('.field:not([data-value="mine"])');

    const win = !notMines.toArray().some(field => $(field).hasClass('unclicked'));

    if(win) {
        showAllField($('.field'));
        showMassage('won');
    }

    return win;
}

const showAllField = (elements) => {
    elements.each((i, field) => {
        field = $(field);
        const type = field.attr('data-value');
        setClicked(field, type);
    });
}