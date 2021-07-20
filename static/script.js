import {setClicked, setExplosion, verifyWin, showMassage, resetTimer, setFlag} from './utils/utils.js';
import variables from './utils/variables.js';


let {
    $container, 
    $rows, 
    $columns, 
    $mines,
    matrixData, 
} = variables;

//let $container = $('#main-container');
//let matrixData;
//let timer;

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

    $columns.change(requestNewGame);
    $rows.change(requestNewGame);
    $mines.change(requestNewGame);

    $('#btnNewGame').on('click', () => {
        $("#modal").fadeOut();
        requestNewGame();
    });

    $('#btnCancel').on('click', () => { 
        $("#modal").fadeOut();
    });

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

    $container.on('contextmenu','.unclicked', setFlag);
});



const requestNewGame = () => {
    $container.css('visibility', 'hidden');
    $container.empty();
    const columns = $columns.val();
    const rows = $rows.val();
    const mines = $mines.val();
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
            showMassage('error');
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
            showMassage('error');
        }
    });
}

const storeData = (data) => {
    matrixData = JSON.parse(data);
}

const createGameGrid = () => {
    resetTimer();
    $container.empty();
    $rows.val(matrixData.length);
    $columns.val(matrixData[0].length);
    $mines.val(matrixData.flat().filter(item => item == 'mine').length);
    $container.css('grid-template-columns', 'repeat(' + matrixData[0].length + ', auto)');
    matrixData.forEach((row, y) => {
        row.forEach((field, x) => {
            $container.append(`<div id="${x}x${y}" data-value=${field} class="field unclicked" alt="field"></div>`);
        });
    });
    $container.css('visibility', 'visible');
}

const setOpenedByEmpty = (element) => {
    const clickedXY = element.attr('id').split('x');
    const x = parseInt(clickedXY[0])
    const y = parseInt(clickedXY[1])
    const type = element.attr('data-value');
    const columns = matrixData[0].length;
    const rows = matrixData.length

    if (element.hasClass('unclicked') && !element.hasClass('type-flag')) {
        setClicked(element, type);
        if(type !== '0') return;
        
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

