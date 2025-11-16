const board = document.querySelector('.board');
const startButton=document.querySelector(".btn-start");
const modall=document.querySelector(".modal");
const startgameModal=document.querySelector(".start-game");
const gameoverModal=document.querySelector(".game-over");
const restartBtn=document.querySelector(".btn-restart");
const highscoreElement=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElement=document.querySelector("#time"); 


const blockHeight = 50
const blockWidth = 50



let highScore=localStorage.getItem("highscore") || 0;
let score=0;
let time=`00-00`;

highscoreElement.innerText=highScore;

const cols = Math.floor(board.clientWidth / blockWidth); //divide the width of the board by the width of each block to get number of columns
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId=null; 
let timerId=null;
let food = { 
    x: Math.floor(Math.random() * rows), 
    y: Math.floor(Math.random() * cols)
};
const blocks=[];
let snake = [
    { x: 1, y: 3 }];

let direction = 'down';

  



for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`]=block;
    }
}

function render() {

     snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    blocks[`${food.x}-${food.y}`].classList.add("food");

    let head = null;

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } 
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }
if (
    head.x < 0 || 
    head.x >= rows || 
    head.y < 0 || 
    head.y >= cols
) {
    clearInterval(intervalId);
    clearInterval(timerId);   
    modall.style.display="flex";
    startgameModal.style.display="none";
    gameoverModal.style.display="flex";
    return;
}

    if(head.x==food.x && head.y===food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols)
        };
        blocks[`${food.x}-${food.y}`].classList.add("food");
    
    snake.unshift(head);
    score+=10;
    scoreElement.innerText=score;
    if(score>highScore){
        highScore=score;
        localStorage.setItem("highscore",highScore.toString());
    }
    }
    else {
        snake.pop();      
        snake.unshift(head); 
    }
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    });
  }
  
intervalId=setInterval(() => {
    render();
  }, 600);
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        direction = "up";
    } 
    else if (event.key === "ArrowRight") {
        direction = "right";
    } 
    else if (event.key === "ArrowLeft") {
        direction = "left";
    } 
    else if (event.key === "ArrowDown") {
        direction = "down";
    }
});

startButton.addEventListener("click",()=>{
    clearInterval(intervalId);   
    clearInterval(timerId);   
    modall.style.display="none";
    intervalId=setInterval(() => {
        render();
      }, 600)
      timerId=setInterval(()=>{
        let [min, sec] = time.split("-").map(Number);

        if (sec === 59) {
          min += 1;
          sec = 0;
        } else {
          sec += 1;
        }
    
        time = `${min}-${sec}`;
        timeElement.innerText = time;
      }, 1000);
})
restartBtn.addEventListener("click",restartgame)
function restartgame(){
    clearInterval(intervalId);  
    clearInterval(timerId);
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });
    score=0;
    time=`00-00`;

    scoreElement.innerText=score;
    timeElement.innerText=time;
    highscoreElement.innerText=highScore;
    modall.style.display="none";
    direction='down';
    snake = [
        { x: 1, y: 3 }]; 
    food = { 
        x: Math.floor(Math.random() * rows), 
        y: Math.floor(Math.random() * cols)
    };
    intervalId=setInterval(() => {
        render();
      }, 600)
}
