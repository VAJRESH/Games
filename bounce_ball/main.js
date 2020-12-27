// setup canvas for painting the browser
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// buttons to control evil ball on a mobile device
const buttons = document.querySelectorAll('button');

// modal buttons
const modalButton = document.getElementById('modalButton');
const modalClose = document.getElementById('closeButton');
const modalWindow = document.getElementById('modalView');

// onclick event to show modal
modalButton.addEventListener('click', () => {
    modalWindow.style.display = 'block';
});

modalClose.addEventListener('click',() => {
    modalWindow.style.display = 'none';
});

window.onclick = function(e){
    if(e.target === modalWindow){
        modalWindow.style.display = 'none';
    }
}

// instructions page for new comers
if(!(localStorage.getItem('visited'))){
    modalWindow.style.display = 'block';
}
localStorage.setItem('visited','true');

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

class Shape{
    constructor(x, y, velocityX, velocityY, exists){
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.exists = exists;
    }
}

class Ball extends Shape{
    constructor(x, y, velocityX, velocityY, exists, color, size){
        super(x, y, velocityX, velocityY, exists, color, size);
        this.color = color;
        this.size = size;
    }
    draw = function (){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }
    update = function() {
        if((this.x + this.size) >= width){
            this.velocityX = -(this.velocityX);
        }
        if((this.x - this.size) <= 0){
            this.velocityX = -(this.velocityX);
        }
        if((this.y + this.size) >= height){
            this.velocityY = -(this.velocityY);
        }
        if((this.y - this.size) <= 0){
            this.velocityY = -(this.velocityY);
        }
        
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
    collisionDetect = function (){
        for(let j=0; j<balls.length; j++){
            if(!(this === balls[j])){
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.size + balls[j].size) {
                  balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
                }
            }
        }
    }
    addNewBall = function (numOfBalls = 1){
        while(numOfBalls > 0){
            let size = random(10, 30);
            let ball = new Ball(
                random(size, width-size),
                random(size, height-size),
                random(-7, 7),
                random(-7, 7),
                true,
                'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
                size
            );
            balls.push(ball);
            totalBalls++;
            displayCount.textContent = `Ball Count: ${totalBalls}`;
            numOfBalls--;
        }
    }
}

class EvilCircle extends Shape{
    constructor(x, y, exists){
        super(x, y, 20, 20, exists);
        this.color = 'white';
        this.size = 10;
    }

    draw = function (){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.stroke();
    }

    checkBounds = function (){
        if((this.x + this.size) >= width){
            this.x = this.x - this.size;
        }
        if((this.x - this.size) <= 0){
            this.x = this.x + this.size;
        }
        if((this.y + this.size) >= height){
            this.y = this.y - this.size;
        }
        if((this.y - this.size) <= 0){
            this.y = this.y + this.size;
        }
    }

    setControls = function (){
        let _this = this;
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if(button.textContent === 'A'){
                    _this.x -= _this.velocityX;
                }else if(button.textContent === 'D'){
                    _this.x += _this.velocityX;
                }else if(button.textContent === 'W'){
                    _this.y -= _this.velocityY;
                }else if(button.textContent === 'S'){
                    _this.y += _this.velocityY;
                }else if(button.textContent === 'Q'){
                    if(_this.size>10){
                        _this.size--;
                    }else{
                        _this.size = 10;
                    }
                }else if(button.textContent === 'E'){
                    if(_this.size < 30){
                        _this.size++;
                    }else{
                        _this.size = 30;
                    }
                }
            })
        })
        window.onkeydown = function(e){
            if (e.key === 'a') {
                _this.x -= _this.velocityX;
            }else if (e.key === 'd') {
                _this.x += _this.velocityX;
            }else if (e.key === 'w') {
                _this.y -= _this.velocityY;
            }else if (e.key === 's') {
                _this.y += _this.velocityY;
            }else if (e.key === 'q') {
                if(_this.size>10){
                    _this.size--;
                }else{
                    _this.size = 10;
                }
            }else if (e.key === 'e') {
                if(_this.size < 30){
                    _this.size++;
                }else{
                    _this.size = 30;
                }
            }
        }
    }

    collisionDetect = function (){
        for(let j=0; j<balls.length; j++){
            if(balls[j].exists){
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.size + balls[j].size){
                    balls[j].exists = false;
                    totalBalls--;
                    displayCount.textContent = `Ball Count: ${totalBalls}`;
                }
            }
        }
    }
}


let numberOfBalls = 20;

let balls = [];
let displayCount = document.getElementById('displayCount');
let totalBalls = 0;


while(balls.length < numberOfBalls){
    let size = random(10, 30);
    let ball = new Ball(
        random(size, width-size),
        random(size, height-size),
        random(-7, 7),
        random(-7, 7),
        true,
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
        size
    );
    balls.push(ball);
    totalBalls++;
    displayCount.textContent = `Ball Count: ${totalBalls}`;
}

// evil circle
let evilBall = new EvilCircle(20, 20, true);
evilBall.setControls()

let timerSeconds = 0;
let timerMinutes = 0;
let timerHours = 0;
const displayTimer = document.getElementById('timer');

function displayTime(){
    if(timerSeconds%60 === 0 && timerSeconds !== 0){
        timerMinutes++;
        timerSeconds = 0;
    }
    if(timerMinutes%60 === 0 && timerMinutes !== 0){
        timerHours++;
        timerMinutes = 0;
    }
    displayTimer.textContent = `Time: ${timerHours}: ${timerMinutes}: ${timerSeconds}`;
    timerSeconds++;
    const timeSpent = `${timerHours} hours ${timerMinutes} minutes ${timerSeconds} seconds`;
    return timeSpent;
}
let timerReset = setInterval(displayTime, 1000);
displayTime();

let loop =  function (){
    // bouncing balls and there methods
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for(let i=0; i<balls.length; i++){
        if(balls[i].exists){
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
        buttons.forEach(button => {
            button.onclick = () => {
                if(button.textContent === 'B'){
                    balls[i].addNewBall();
                }else if(button.textContent === 'R'){
                    window.location.reload();
                }
            }
        })
        window.onkeypress = e => {
            if(e.key === 'b'){
                balls[i].addNewBall();
            }else if(e.key === 'r'){
                window.location.reload();
            }
        }
        
    }
    
    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();
    
    
    let frames = requestAnimationFrame(loop);

    if(totalBalls === 0){
        winner();
        clearTimeout(timerReset);
        cancelAnimationFrame(frames);
        
    }
}

loop();

// shows a winner page after you eat all the balls on screen
function winner(){
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    const article = document.createElement('article');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const input = document.createElement('input');
    const resetButton = document.createElement('button');

    div.className = 'winnerPage';
    
    h1.className = 'winnerHeading';
    h1.textContent = 'You Won!';
    
    article.className = 'winnerArticle';
    p1.className = 'winnerPara';
    p2.className = 'winnerPara';
    p1.textContent = 'Time Spent:';
    p2.textContent = displayTime();

    input.type = 'number';
    input.className = 'winnerInput'
    input.placeholder = "Enter Number of Balls to Start Game.";

    resetButton.id = 'winnerBtn';
    resetButton.textContent = 'Restart';
    resetButton.onclick = () => restartGame();

    article.appendChild(p1);
    article.appendChild(p2);

    div.appendChild(h1);
    div.appendChild(article);
    div.appendChild(input);
    div.appendChild(resetButton);
    document.body.appendChild(div);
}

function restartGame(){
    const limit = balls.length-1;
    // deleting balls eaten by user
    for(let i=0; i<limit; i++){
        balls.pop();
    }
    
    // resetting timer
    timerSeconds = 0;
    timerMinutes = 0;
    timerHours = 0;
    timerReset = setInterval(displayTime, 1000);

    // adding new balls on screen
    const winnerInput = document.querySelector('.winnerInput');
    const inputFromUser = winnerInput.value === '' ? 20: winnerInput.value;
    balls[0].addNewBall(inputFromUser);
    loop();


    // deleting winner page
    const div = document.querySelector('.winnerPage');
    document.body.removeChild(div);
}