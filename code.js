var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var score_view = document.querySelector('div');

const scale = 15;
var direction = 1;
var score = 0;

score_view.textContent = `Score: ${score}`;
var game_width = ~~(window.innerWidth / scale);
var game_height = ~~(window.innerHeight / scale);


canvas.width = game_width * scale;
canvas.height = game_height * scale;


var snake = newSnake(game_width, game_height);
var eat = newEat();





function newElementOfSnake(x, y) {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(x * scale, y * scale, scale, scale);
    let piece = {x, y}; 
    return piece;
}


function newSnake(width, height) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let snake = {'pieces': [], 'length': 3};
    direction = 1;
    eat = newEat();
    score = 0;
    score_view.textContent = `Score: ${score}`;

    for (let i = 0; i < snake.length; i++) {
        var piece = newElementOfSnake((~~(width / 2) - i), ~~(height / 2));
        snake.pieces.push(piece);
    }
    return snake;
}


function updateElementsOfSnake(x, y) {
    let pieceDead = snake.pieces.pop();
    ctx.clearRect(pieceDead.x * scale, pieceDead.y * scale, scale, scale);
    snake.pieces.unshift(newElementOfSnake(x, y));
}


function move() {
    switch(direction) {
        case 0:
            x = snake.pieces[0].x;
            y = snake.pieces[0].y - 1;
            break;
        case 1:
            x = snake.pieces[0].x + 1;
            y = snake.pieces[0].y;
            break;
        case 2:
            x = snake.pieces[0].x;
            y = snake.pieces[0].y + 1;
            break;
        case 3:
            x = snake.pieces[0].x - 1;
            y = snake.pieces[0].y;
            break;
    }
    return [x, y];
}


function collision() {
    let [x, y] = move();
    if (eat.x == x && eat.y == y) {
        eat = newEat();
        score_view.textContent = `Score: ${++score}`;
        snake.pieces.unshift(newElementOfSnake(x, y));
        return {'status': 'eat'};
    }
    for (let piece of snake.pieces) {
        if (x == piece.x && y == piece.y) return {'status': 'coll'};
        if (x >= game_width) return {'status': 'ok', 'pos': [0, y]};
        if (x < 0) return {'status': 'ok', 'pos': [game_width, y]};
        if (y >= game_height) return {'status': 'ok', 'pos': [x, 0]};
        if (y < 0) return {'status': 'ok', 'pos': [x, game_height]};
    }
    return {'status': 'ok', 'pos': [x, y]};
}


document.addEventListener('keydown', (event) => {
    switch(event.key) { 
        case 'w':
            if (direction != 2) {
                direction = 0; 
                break;
            } 
        case 'd':
            if (direction != 3) {
                direction = 1; 
                break;
            }
        case 's': 
            if (direction != 0) {
                direction = 2; 
                break;
            }
        case 'a': 
            if (direction != 1) {
                direction = 3; 
                break;
            }
    }
})


function newEat() {
    if (eat) {
        ctx.clearRect(eat.x * scale, eat.y * scale, scale, scale);
    }

    ctx.beginPath();
    ctx.fillStyle = 'red';
    let x = ~~(Math.random() * game_width);
    let y = ~~(Math.random() * game_height);
    ctx.fillRect(x * scale, y * scale, scale, scale);
    return {x, y};
}




var update = setInterval(update, 1000/10);
function update() {

    let coll = collision();
    if (coll.status == 'coll') {
        snake = newSnake(game_width, game_height);
        return;
    } else if (coll.status == 'ok') {
        updateElementsOfSnake(coll.pos[0], coll.pos[1]);
    }

}



