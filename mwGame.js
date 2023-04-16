const mainCharacter = document.getElementById("mainCharacter");
const timer = document.getElementById("timer");
const gameOverContainer = document.getElementById("gameOverContainer");
const redoButton = document.getElementById("redoButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const bkBall = document.getElementById("bkBall");
const obstacleList = [
    document.getElementById("obstacle0"),
    document.getElementById("obstacle1"),
    document.getElementById("obstacle2"),
    document.getElementById("obstacle3"),
    document.getElementById("obstacle4"),
    document.getElementById("obstacle5"),
    document.getElementById("obstacle6"),
];
  
let interval;
let spawnInterval;
let gameTime = 0;
let obstacleSpeed = 1;
let obstacles = [];
let bkBalls = [];
let bkBallInterval;
let bkBallSpawnTime = 5; 

function spawnObstacle() {
  const randomObstacle = obstacleList[Math.floor(Math.random() * obstacleList.length)].cloneNode();
  randomObstacle.style.display = "block"; // 이 줄을 추가하세요
  randomObstacle.style.left = `${Math.random() * 100}%`;
  randomObstacle.style.top = "-30%";
  document.getElementById("gameArea").appendChild(randomObstacle);
  obstacles.push(randomObstacle);
}


function spawnBkBall() {
    const newBkBall = bkBall.cloneNode();
    newBkBall.style.left = `${Math.random() * 100}%`;
    newBkBall.style.top = "-30%";
    newBkBall.style.display = "block";
    document.getElementById("gameArea").appendChild(newBkBall);
    bkBalls.push(newBkBall);
  }

  function collision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
  
    const threshold = 20;
    const collided = !(
      aRect.right - threshold < bRect.left ||
      aRect.left + threshold > bRect.right ||
      aRect.bottom - threshold < bRect.top ||
      aRect.top + threshold > bRect.bottom
    );
  
    return collided;
  }
  
  
  function updateGame() {
    gameTime += 0.01;
    timer.innerText = `우성이를 ${gameTime.toFixed(1)}초 동안 피하는 중`;
  
    if (Math.floor(gameTime) === bkBallSpawnTime) {
      spawnBkBall();
      bkBallSpawnTime += 4;
    }
  
    if (Math.floor(gameTime) % 2 === 0 && gameTime.toFixed(2) % 2 === 0) {
      obstacleSpeed *= 1.2;
    }
  
    for (let i = 0; i < obstacles.length; i++) {
        const currentObstacle = obstacles[i];
        currentObstacle.style.top = `${parseFloat(currentObstacle.style.top) + obstacleSpeed}%`;
    
        const isCollision = collision(mainCharacter, currentObstacle);
    
        if (isCollision) {
          clearInterval(interval);
          clearInterval(spawnInterval);
          gameOverContainer.style.display = "block";
          document.getElementById("gameOverImage").style.display = "block";
          document.removeEventListener("keydown", keydownHandler); // Disable movement on game over
          return;
        }
         else if (parseFloat(currentObstacle.style.top) > 100) {
          document.getElementById("gameArea").removeChild(currentObstacle);
          obstacles.splice(i, 1);
          i--;
        }
      }
  
      for (let i = 0; i < bkBalls.length; i++) {
        const currentBkBall = bkBalls[i];
        currentBkBall.style.top = `${parseFloat(currentBkBall.style.top) + obstacleSpeed}%`;
    
        const isCollision = collision(mainCharacter, currentBkBall);
    
        if (isCollision) {
          obstacleSpeed /= 1.4;
          document.getElementById("gameArea").removeChild(currentBkBall);
          bkBalls.splice(i, 1);
          i--;
        } else if (parseFloat(currentBkBall.style.top) > 100) {
          document.getElementById("gameArea").removeChild(currentBkBall);
          bkBalls.splice(i, 1);
          i--;
        }
      }
  }

  function keydownHandler(e) {
    if (e.key === "ArrowLeft") {
      moveCharacter("left");
    } else if (e.key === "ArrowRight") {
      moveCharacter("right");
    }
}

document.addEventListener("keydown", keydownHandler);

redoButton.addEventListener("click", () => {
    gameOverContainer.style.display = "block";
    gameOverContainer.style.display = "none";
    clearInterval(spawnInterval); // 게임이 재시작될 때 장애물 생성 중지
    obstacles.forEach(obstacle => document.getElementById("gameArea").removeChild(obstacle)); // 게임이 재시작될 때 이전 장애물 제거
    obstacles = [];
    startGame();
  });
  
  function startGame() {
    gameOverContainer.style.display = "none";
    clearInterval(interval); // 이전 인터벌을 초기화
    clearInterval(spawnInterval); // 이전 스폰 인터벌을 초기화
    mainCharacter.style.left = "50%";
    gameTime = 0;
    timer.innerText = gameTime.toFixed(2);
    obstacleSpeed = 0.3; // 게임 재시작 시 속도를 초기화
    interval = setInterval(updateGame, 10);
    spawnInterval = setInterval(spawnObstacle, 740);
    bkBalls.forEach(bkBall => document.getElementById("gameArea").removeChild(bkBall));
    bkBalls = [];
    bkBallSpawnTime = 5;
}


function collision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(aRect.right < bRect.left || aRect.left > bRect.right || aRect.bottom < bRect.top || aRect.top > bRect.bottom);
}

function moveCharacter(direction) {
  const currentLeft = parseFloat(mainCharacter.style.left);
  if (direction === "left" && currentLeft > 0) {
    mainCharacter.style.left = `${currentLeft - 2.5}%`;
  } else if (direction === "right" && currentLeft < 90) {
    mainCharacter.style.left = `${currentLeft + 2.5}%`;
  }
} 

leftButton.addEventListener("click", () => moveCharacter("left"));
rightButton.addEventListener("click", () => moveCharacter("right"));
redoButton.addEventListener("click", () => {
  gameOverContainer.style.display = "none";
  window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
  });
  clearInterval(spawnInterval);
  obstacles = [];
  document.addEventListener("keydown", keydownHandler); // Re-enable movement after starting a new game
  startGame();
});
  

startGame();
