export let timer;

export const setClicked = (element, type) => {
    element.addClass(`type-${type}`);
    element.removeClass('unclicked');
    element.html(fieldContent(type));
}

export const runTimer = () => {
    let minutesLabel = $("#minutes");
    let secondsLabel = $("#seconds");
    let sec = 0;
    
    return setInterval(() => {
        secondsLabel.text(pad(++sec % 60));
        minutesLabel.text(pad(parseInt(sec / 60, 10)));
    }, 1000);
}

export const setExplosion = (element) => {
    setClicked(element, 'explosion');

    showAllField($('.field:not(.type-explosion)'));
    showMassage('lost');
}

export const verifyWin = () => {
    const notMines = $('.field:not([data-value="mine"])');

    const win = !notMines.toArray().some(field => $(field).hasClass('unclicked'));

    if(win) {
        showAllField($('.field'));
        showMassage('won');
    }

    return win;
}

export const showMassage = (message) => {
    const messages = {
        'won': 'Congratulations, You Won!',
        'lost': 'You Lost... Try it one more time!',
        'error': 'Error sending data'
    }

    $('.modal h2').text(message.toUpperCase());
    $('.modal p').text(messages[message]);
    $('#modal').show("closed");
    clearInterval(timer);
}

export const resetTimer = () => {
    clearInterval(timer);
    timer = runTimer();
}

const showAllField = (elements) => {
    elements.each((i, field) => {
        field = $(field);
        const type = field.attr('data-value');
        setClicked(field, type);
    });
}

const pad = (val) => val > 9 ? val : "0" + val;

const fieldContent = (type) => {
    if(parseInt(type)) return type == '0' ? '' : type;
   
    const types = {
       'mine': '&#x1F4A3;',
       'explosion': '&#x1F4A3;',
       'flag': '&#128681;',
   }
   
   return types[type];
}
