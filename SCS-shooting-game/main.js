//캔버스 세팅
let canvas;
//우리가 앞으로 이미지를 만드는 것을 도와줄 변수
let ctx; 
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
//캔버스 사이즈 정하기
canvas.width = 400;
canvas.height = 700;
//canvas를 body태그안에 넣어줌
document.body.appendChild(canvas);


let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; //true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64

let bulletList = [] //총알들을 저장하는 리스트
function Bullet(){
  this.x = 0;
  this.y = 0;
  this.init = function(){
    this.x = spaceshipX+20;
    this.y = spaceshipY-15;
    this.alive = true //true면 살아있는 총알 false면 죽은 총알
    bulletList.push(this);
  };
  //총알 발사
  this.update = function() {
    this.y -= 7 ; //총알이 나가는 속도
  };
  this.checkHit=function(){
//총알이 닿았을 때
    for(let i = 0; i < enemyList.length;i++){
      if(this.y <=enemyList[i].y && this.x>=enemyList[i].x && this.x<=enemyList[i].x+40){
        //총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false; //죽은 총알
        enemyList.splice(i,1)
      }
    }
  };
}

function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1)) + min
  return randomNum
}

let enemyList=[];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function (){
    this.y = 0; //적군의 위치가 y좌표 맨 위에서 시작됨.
    this.x = generateRandomValue(0,canvas.width-48)
    enemyList.push(this);
  };
  this.update = function() {
    this.y += 5; //적이 내려오는 속도

    if(this.y >= canvas.height - 48) {
      gameOver = true;
    }
  };
}

//이미지를 가져오는 함수
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpg";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.jpg";
}

//키보드 조작
let keysDown = {}
function setupKeyboardListener(){
  document.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function(){
    delete keysDown[event.keyCode];

    if(event.keyCode == 32) {
      createBullet() //총알 생성 함수
    }
  })
}
//keydown은 버튼이 눌릴때 일어나는 일, keyup은 버튼이 떼질 때 일어나는 일

function createBullet(){
  console.log("총알 생성");
  let b = new Bullet() //총알 하나 생성
  b.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy(){
  const interval = setInterval(function(){
    let e = new Enemy();//적군을 실제로 새로 하나 만들겠다는 의미
    e.init();
  },1000);
}
//setInterval(내가 호출하고 싶은 함수, 반복되는 시간 간격)

function update() {
  if( 39 in keysDown) {
    spaceshipX += 5; //우주선의 속도
  } //right
  if (37 in keysDown){
    spaceshipX -= 5;
  }//left
  //우주선이 화면 밖으로 나가지 않게함
  if (spaceshipX <= 0) {
    spaceshipX=0;
  }
  if(spaceshipX >= canvas.width-64){
    spaceshipX=canvas.width-64;
  }
  //총알의 y좌표 업데이트하는 함수 호출
  for(let i=0;i<bulletList.length;i++){
    if(bulletList[i].alive){
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  //적이 내려오는 것을 화면에 출력  
  for(let i=0;i<enemyList.length;i++){
    enemyList[i].update();
  }
}


//이미지를 보여주는 함수
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  //점수 증가 코드
  ctx.fillText(`Score${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for(let i=0;i<bulletList.length;i++){
    //총알이 살아있을때 보여줌
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
    
  }

  for(let i=0;i<enemyList.length;i++){
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

//함수를 불러와서 화면에 출력
function main () {
//바닥에 적이 닿으면 false가 true로 바뀌면서 화면이 멈춘다(gameover사진이 화면에 뜸)
    if(!gameOver) {
        update(); //좌표값을 업데이트하고
        render(); //그려주고
        requestAnimationFrame(main);
    } else {
      ctx.drawImage(gameOverImage, 10,100,380,380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
//render(); main함수에서 이미 render를 호출하고 있기 때문에 또 호출할 필요가 없다.
main();

//방향키 조작
//방향키를 누르면 우주선의 xy좌표가 바뀌고 다시 render 그려준다.

//총알만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알의 y값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x죄표
//3. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 모든 총알들은 x, y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 그려준다.

//적군 규칙
//1. 적군은 위치가 랜덤하다
//2. 적군은 밑응로 내려운다.
//3. 1초마다 하나씩 적군이 나온다.
//4. 적군의 우주선이 바닥에 닿으면 게임 오버
//5. 적군과 총알이 만나면 우주선이 사라진다 그리고 점수 1점 획득

//적군이 죽는다
//총알이 적군에게 닿는다.(총알의 y <= 적군.y and 총알.x >= 적군.x and 총알.x <= 적군.x + 40 
//=> 닿았다라고 표현)
//=> 총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득