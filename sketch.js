//시작화면------------------------------------
let Start = false;

//시작화면-마우스를 따라다니는 알
let eggX = 1;
let eggY = 1;
let easing = 0.05;

//시작화면-페인트 애니메이션
let startPaintY = 0;
let startPaintDY = 0.2;
//--------------------------------------------

//게임-----------------------------------------
//오징어
let squids = [
    {
        xPos: 0,
        yPos: 0,
        xSpeed: 2,
        ySpeed: 1
    },
    {
        xPos: 0,
        yPos: 0,
        xSpeed: 2,
        ySpeed: 3
    },
    {
        xPos: 0,
        yPos: 0,
        xSpeed: 4,
        ySpeed: 5
    },
];

//오징어 크기
let squidXSize = 42;
let squidYSize = 45;

//알
let eggSize = 36;

//초기점수
let Score = 0;
//이전점수
let beforeScore = 0;

//50점 증가하면 연어알 추가
let eggs = [];
let numEggs = 1;

//오징어를 맞출 때 페인트 이펙트
let success = 0;

//효과음
let soundEffect;
let soundDead;
//-------------------------------------------

function preload(){
    //시작화면
    startBg = loadImage('images/main_.png');
    eggEasing = loadImage('images/egg.png');
    startPaint = loadImage('images/startpaint.png');
    //게임화면
    squid1 = loadImage('images/squid1.png');
    squid2 = loadImage('images/squid2.png');
    squid3 = loadImage('images/squid3.png');
    back = loadImage('images/back.png');
    paint1 = loadImage('images/paint1.png');
    paint2 = loadImage('images/paint2.png');
    paint3 = loadImage('images/paint3.png');
    //효과음
    soundEffect = loadSound('sounds/soundEffect.mp3');
    soundDead = loadSound('sounds/Dead.mp3');
}


function setup() {
        createCanvas(600, 600);
    
        //알(게임 시작 시 알이 1개 있는 상태)
        eggs[0] = new egg(100, 100, random(1, 5), random(1, 5))
        
        //오징어 위치
        function squidRandom(j){
        squids[j].xPos = random(0, width+(-squidXSize));
        squids[j].yPos = random(0, height+(-squidYSize));
        }
        squidRandom(0);
        squidRandom(1);
        squidRandom(2);
}

function draw() {
    
    if(!Start){//시작화면
        background(startBg);
        noStroke();

        //마우스 위치에 따라 눈알 굴리는 인터랙션
        let eye1x = map(mouseX, 0, width, 255, 275, true);
        let eye2x = map(mouseX, 0, width, 330, 350, true);
        let eyey = map(mouseY, 0, height, 195, 218, true);
        fill(143, 17, 99);
        circle(eye1x, eyey, 46);
        circle(eye2x, eyey, 46);
        
        //물감이 흘러내리는 애니메이션
        fill(126, 52, 247);
        rect(0, 0, 600, 30);
        fill(130, 240, 55);
        rect(368, 0, 240, 30);
        image(startPaint, 0, startPaintY, 600, 160);
        startPaintY = startPaintY + startPaintDY;
        if(startPaintY > 30){
        startPaintDY = startPaintDY * (-1);
        }
        if(startPaintY <= 0){
        startPaintDY = startPaintDY * (-1);
        }
        
        //마우스를 따라다니는 알
        image(eggEasing, eggX-18, eggY-18, 36, 36);
        let dx = mouseX - eggX;
        eggX += dx * easing;
        let dy = mouseY - eggY;
        eggY += dy * easing;
        
    }else{//게임시작
        
        background(back);
        textFont("Acme");
        textSize(18);
    
        //배열에 연어알 추가
        for(var i in eggs){
        eggs[i].show();
        }
        
        //오징어
        image(squid1, squids[0].xPos, squids[0].yPos, squidXSize, squidYSize);
        image(squid2, squids[1].xPos, squids[1].yPos, squidXSize, squidYSize);
        image(squid3, squids[2].xPos, squids[2].yPos, squidXSize, squidYSize);
        
        //오징어 움직임
        function squidPlay(i) {
            squids[i].xPos = squids[i].xPos + squids[i].xSpeed;
            squids[i].yPos = squids[i].yPos + squids[i].ySpeed;
        
            if(squids[i].xPos < 0 || squids[i].xPos+(squidXSize) > width){
                squids[i].xSpeed = squids[i].xSpeed*(-1);
            }
            if(squids[i].yPos < 0 || squids[i].yPos+(squidYSize)> height){
                squids[i].ySpeed = squids[i].ySpeed*(-1);
            }
        }
        for(let i = 0; i < squids.length; i++){
        squidPlay(i);
        }

        //조준점
        noFill();
        strokeWeight(2);
        stroke(197);
        ellipse(mouseX, mouseY, 80, 80);
        strokeWeight(1);
        ellipse(mouseX, mouseY, 50, 50);
        line(mouseX-68, mouseY, 0, mouseY);
        line(mouseX, mouseY-68, mouseX, 0);
        line(mouseX+68, mouseY, width, mouseY);
        line(mouseX, mouseY+68, mouseX, height);
        strokeWeight(2);
        line(mouseX, mouseY, mouseX-60, mouseY);
        line(mouseX, mouseY, mouseX, mouseY-60);
        line(mouseX, mouseY, mouseX+60, mouseY);
        line(mouseX, mouseY, mouseX, mouseY+60);
        ellipse(mouseX, mouseY, 12, 12);

        //오징어에 닿으면 조준점 색상 변화
        function targetColor(k){
            if(dist(mouseX, mouseY, squids[k].xPos, squids[k].yPos) < squidXSize){
                noFill();
                strokeWeight(2);
                stroke(255, 93, 169);
                ellipse(mouseX, mouseY, 80, 80);
                strokeWeight(1);
                ellipse(mouseX, mouseY, 50, 50);
                strokeWeight(2);
                line(mouseX, mouseY, mouseX-60, mouseY);
                line(mouseX, mouseY, mouseX, mouseY-60);
                line(mouseX, mouseY, mouseX+60, mouseY);
                line(mouseX, mouseY, mouseX, mouseY+60);
                // fill(255, 93, 169);
                ellipse(mouseX, mouseY, 12, 12);
            }
        }
        for(let i = 0; i < squids.length; i++){
        targetColor(i);
        }
        
        //연어알에 닿으면 조준점 색상 변화
        function targetColor2(i){
            if(dist(mouseX, mouseY, eggs[i].x, eggs[i].y) < eggSize){
                noFill();
                strokeWeight(2);
                stroke(255, 93, 169);
                ellipse(mouseX, mouseY, 80, 80);
                strokeWeight(1);
                ellipse(mouseX, mouseY, 50, 50);
                strokeWeight(2);
                line(mouseX, mouseY, mouseX-60, mouseY);
                line(mouseX, mouseY, mouseX, mouseY-60);
                line(mouseX, mouseY, mouseX+60, mouseY);
                line(mouseX, mouseY, mouseX, mouseY+60);
                // fill(255, 93, 169);
                ellipse(mouseX, mouseY, 12, 12);
            }
        }
        for(let i = 0; i < eggs.length; i++){
        targetColor2(i);
        }

        //상단 디자인
        function scoreBox(){
        //배경
        noStroke();
        fill(0, 0, 0, 160);
        rect(0, 0, width, 80);
        //점수안내
        fill(255, 93, 169);
        rect(50, 18, 60, 10);
        fill(130, 240, 55);
        rect(50, 36, 60, 10);
        fill(150, 89, 252);
        rect(50, 54, 60, 10);
        
        fill(255);
        text("5", 130, 28);
        text("10", 130, 46);
        text("30", 130, 64);
        //SCORE 표시
        textAlign(CENTER);
        fill(255);
        text("SCORE", 500, 30);
        circle(470, 52, 30);
        rect(470, 37, 60, 30);
        circle(530, 52, 30);
        noStroke();
        fill(0);
        textSize(20);
        text(Score, 500, 58);
        }
        scoreBox();

        //연어알에 닿으면 게임 끝
        for(let i = 0; i < eggs.length; i++){
            if(dist(mouseX, mouseY, eggs[i].x, eggs[i].y) < eggSize){
            soundDead.play();
            //GAME OVER 글씨 표시
            fill(255, 203, 19);
            stroke(255, 203, 19);
            textFont("Acme");
            textAlign(CENTER);
            textSize(32);
            text("G a m e   O v e r", width/2, 50);
            //오징어들 멈추기
            noLoop();
            //재시작 버튼 마련
            button = createButton("restart");
            button.mousePressed(() => {
                //버튼 클릭 시 스코어 초기화
                Score = 0;
                //버튼 클릭 시 버튼 다시 사라지도록
                removeElements();
                //버튼 클릭 시 알수개수 초기화
                eggs.length = 1;
                numEggs = 1;
                //시작
                loop();
            });
            // button.position(520, 560);
            }
        }
    
        //오징어 명중 시 오징어 색상에 따라 물감 효과가 나타남
        if(success == 1){
        image(paint1, mouseX-70, mouseY-70, 140, 140);
        success = 0;
        }
        if(success == 2){
        image(paint2, mouseX-70, mouseY-70, 140, 140);
        success = 0;
        }
        if(success == 3){
        image(paint3, mouseX-70, mouseY-70, 140, 140);
        success = 0;
        }
    }
    


}//draw 함수 끝

function keyPressed() {
    if(!Start) {Start = true;}
}

//점수 증가
function mousePressed(){
        beforeScore = Score;
    
        if(dist(mouseX, mouseY, squids[0].xPos, squids[0].yPos) < squidXSize){
            success = 1;
            Score = Score + 5;
            soundEffect.play();
        
            //50점 증가할 때마다 알 추가
            if(Score >= 50*numEggs && beforeScore < 50*numEggs){
            let newEggs = new egg(30, 30, random(1, 5), random(1, 5));
            eggs.push(newEggs)
            numEggs++;
            }
            
        }
        if(dist(mouseX, mouseY, squids[1].xPos, squids[1].yPos) < squidXSize){
            success = 2;
            Score = Score + 10;
            soundEffect.play();

            if(Score >= 50*numEggs && beforeScore < 50*numEggs){
            let newEggs = new egg(30, 30, random(1, 5), random(1, 5));
            eggs.push(newEggs)
            numEggs++;
            }

        }
        if(dist(mouseX, mouseY, squids[2].xPos, squids[2].yPos) < squidXSize){
            success = 3;
            Score = Score + 30;
            soundEffect.play();

            if(Score >= 50*numEggs && beforeScore < 50*numEggs){
            let newEggs = new egg(30, 30, random(1, 5), random(1, 5));
            eggs.push(newEggs)
            numEggs++;
            }
        }
}

//알 구조
class egg{
    constructor(x, y, xs, ys){
        this.x = x;
        this.y = y;

        this.xspeed = xs;
        this.yspeed = ys;
    }
    show(){
        noStroke();
        fill(255, 203, 19);
        circle(this.x, this.y, eggSize);
        fill(241, 113, 22);
        circle(this.x, this.y, 30);
        fill(241, 165, 111);
        circle(this.x+3, this.y-3, 10);
        this.x += this.xspeed;
        this.y += this.yspeed;
        if(this.x+(-12) < 0 || this.x+(12) > width){
        this.xspeed = this.xspeed*(-1);
        }
        if(this.y+(-12) < 0 || this.y+(12) > height){
        this.yspeed = this.yspeed*(-1);
        }
    }
}