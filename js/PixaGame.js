var game = {
    canvas: undefined,
    canvasContext: undefined,
    canvasEnemy: undefined,
    canvasEnemyContext: undefined,
    background: undefined,
    startBackground: undefined,
    pjSprite: undefined,
    enemySprite: undefined,
}

let body = document.getElementById("body")
//variables used for animation of sprites
const scale = 2.5;
const width = 120;
const height = 80;
const widthPj = 300;
const heightPj = 300;
const scaleWidth = scale * width;
const scaleHeight = scale * height;
const scaleWidthPj = scale * widthPj;
const scaleHeightPj = scale * heightPj;
const cycleLoopX = [0, 1];
const cycleLoopY = [0, 1, 2, 3];
const cycleLoopY_pj = [0, 1, 2];
let currentLoopIndexX = 0;
let currentLoopIndexY = 0;
let currentLoopIndexX_pj = 0;
let currentLoopIndexY_pj = 0;
let frameCount = 0;
let frameCountPj = 0;


startScreen = function(){
    body.innerHTML += `<div id="gameArea" class="d-flex justify-content-center"></div>`;
    let gameArea = document.getElementById("gameArea");
    gameArea.style.background = "/images/elements/begginingScreen.jpg";
    gameArea.innerHTML = `<button id="startButton">START</button>`;
}

game.loadImg = function (imgName){
    var img = new Image();
    img.src = imgName;
    return img;
}

game.start = function(){
    body.innerHTML = `
    <div id="gameArea">

    <div id="rules" class="sideDiv">
        <h1>Intructions</h1>
        <ul>
            <li>Click on the screen to attack</li>
            <li>Buy skills/ items to use them</li>
            <li>Each skill consumes MP, pay attention to your mana</li>
            <li>Buy and use the HD pizza to win the game!</li>
        </ul>
    </div>

    <div id="pantalla">
        <canvas id="myCanvas"></canvas>
        <canvas id="canvasEnemy" width="301" height="301"></canvas>
        <canvas id="canvasMalo" width="301" height="301"></canvas>
        <div id="main_bar">
            <div id="leftDiv">
                <div id="store"></div> 
                <div id="health"></div>        
            </div>
            

            <div id="skills_bar" class="bar">
                <div class="sdiv">
                    <button id="upgrade1" class="upgrade"></button>
                    <input id="s1" class="skill" type="image" src="images/hud/cebolla.png">
                    <div class="level" id="s1_lvl"></div>
                    <div class="mana_cost" id="s1_mana"></div>
                </div>
                <div class="sdiv">
                    <button id="upgrade2" class="upgrade"></button>
                    <input id="s2" class="skill" type="image" src="images/hud/champignones.png">
                    <div class="level" id="s2_lvl"></div>
                    <div class="mana_cost" id="s2_mana"></div>
                </div>
                <div class="sdiv">
                    <button id="upgrade3" class="upgrade"></button>
                    <input id="s3" class="skill" type="image" src="images/hud/jamonymorron.png">
                    <div class="level" id="s3_lvl"></div>
                    <div class="mana_cost" id="s3_mana"></div>
                </div> 
            </div>

            <div id="shop_bar" class="bar">
                <div class="sdiv">
                    <button id="item1" class="upgrade"></button>
                    <input id="i1" class="skill item" type="image" src="images/items/hp_soda.png">
                    <div class="mana_cost item_quantity" id="i1_quantity"></div>
                </div>
                <div class="sdiv">
                    <button id="item2" class="upgrade"></button>
                    <input id="i2" class="skill item" type="image" src="images/items/mp_soda.png">
                    <div class="mana_cost item_quantity" id="i2_quantity"></div>
                </div>
                <div class="sdiv">
                    <button id="item3" class="upgrade"></button>
                    <input id="i3" class="skill item" type="image" src="images/items/pizza.png">
                    <div class="mana_cost item_quantity" id="i3_quantity"></div>
                </div> 
            </div>
            
            <div id="rightDiv">
                <div id="money">
                    <img id="goldcoin" src="images/hud/coin.png" alt="gold coin">
                    <p id="money_amount"></p>
                </div> 
                <div id="mana"></div>        
            </div>
        </div>
    </div>

    <div id="itemsDiv" class="sideDiv">
        <div id="itemDiv">
            <h1>Skills</h1>
            <div class="skill_container">
                <img src="images/hud/cebolla.png" alt="pizza de cebolla">
                <div>
                    <p class="skillname">Onion Pizza</p>
                    <p class="skilldesc">Make your enemy suffer with the smell!</p>
                </div>
            </div>
            <div class="skill_container">
                <img src="images/hud/champignones.png" alt="pizza de cebolla">
                <div>
                    <p class="skillname">Mushroom Pizza</p>
                    <p class="skilldesc">Increases your defenses. Mushroom power!</p>
                </div>
            </div>
            <div class="skill_container">
                <img src="images/hud/jamonymorron.png" alt="pizza de cebolla">
                <div>
                    <p class="skillname">Ham and Pepper Pizza</p>
                    <p class="skilldesc">HP Vampirism. Sweet sweet peppers...</p>
                </div>
            </div>
        </div>
    </div>
</div>
    `
    game.canvas = document.getElementById("myCanvas");
    game.canvasContext = game.canvas.getContext("2d");
    game.canvasEnemy = document.getElementById("canvasEnemy");
    game.canvasEnemyContext = game.canvasEnemy.getContext("2d");
    game.background = game.loadImg("images/background.jpg")
    game.pjSprite = game.loadImg("images/characters/mainCh/mainChSprite.png")
    assignEnemySprite();
    game.mainLoop();
    // game.animatePjSprite();
    // game.animateEnemySprite();
    ajustarVentana();
    game.canvas.addEventListener("click", game.mainLoop); //se adhiere el evento cada vez q entra al ciclo, mejorar¿¿¿¿
    game.canvasEnemy.addEventListener("click", game.mainLoop);
    asignBuy(skill1);
    asignBuy(skill2);
    asignBuy(skill3);
    asignBuy(item1);
    asignBuy(item2);
    asignBuy(item3);
    document.querySelector("#upgrade1").addEventListener('click', buySkill1);
    document.querySelector("#upgrade2").addEventListener('click', buySkill2);
    document.querySelector("#upgrade3").addEventListener('click', buySkill3);
    document.querySelector('#s1').addEventListener('click', useSkill1);
    document.querySelector('#s2').addEventListener('click', useSkill2);
    document.querySelector('#s3').addEventListener('click', useSkill3);
    showHpMpMoney();
    onclick = showHpMpMoney;
    document.querySelector("#item1").addEventListener('click', buyItem1);
    document.querySelector("#item2").addEventListener('click', buyItem2);
    document.querySelector("#item3").addEventListener('click', buyItem3);
    document.querySelector('#i1').addEventListener('click', useItem1);
    document.querySelector('#i2').addEventListener('click', useItem2);
    document.querySelector('#i3').addEventListener('click', useItem3);

    document.querySelector("#store").addEventListener('click', showHideShop);
}

startScreen(); //invoques main menu to start the chain of events

startIntro = function(){
    gameArea.innerHTML = `<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="d-block w-100" src="dibujos/intro/intro1.jpg" alt="First slide">
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="dibujos/intro/intro2.jpg" alt="Second slide">
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="dibujos/intro/intro3.jpg" alt="Third slide">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
  <div id="thirdSlide"></div>`
  let thirdSlide = document.getElementById("thirdSlide");
  thirdSlide.innerHTML += `<button id="cntButton">CONTINUE</button>`

  document.getElementById("cntButton").addEventListener("click", game.start);
}

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startIntro);

game.clearCanvas = function () { //function that restarts the canvas
    game.canvasContext.clearRect(0, 0, game.canvas.width, game.canvas.height)
}

game.clearCanvasEnemy = function () { //function that restarts the canvas enemy
    game.canvasEnemyContext.clearRect(0, 0, game.canvasEnemy.width, game.canvasEnemy.height)
}

// game.draw = function(){
//     game.canvasContext.drawImage(game.background, 0, 0);
//     game.canvasContext.drawImage(game.pjSprite, game.canvas.width / 3, game.canvas.height / 2 )
// }

game.drawFrame = function(sprite, frameX, frameY, canvasX, canvasY){
    game.canvasContext.drawImage(sprite, frameX * widthPj, frameY * heightPj, widthPj, heightPj, canvasX, canvasY, scaleWidthPj, scaleHeightPj)
}

game.drawFrameMonster = function(sprite, frameX, frameY, canvasX, canvasY){
    game.canvasEnemyContext.drawImage(sprite, frameX * width, frameY * height, width, height, canvasX, canvasY, scaleWidth, scaleHeight)
}

game.animateEnemySprite = function(){
    frameCount++;
    if(frameCount < 5){ //frame rate
        window.requestAnimationFrame(game.animateEnemySprite);
        return;
    }
    frameCount = 0;
    game.clearCanvasEnemy();
    // game.draw();
    game.drawFrameMonster(game.pjSprite, cycleLoopX[currentLoopIndexX], cycleLoopY[currentLoopIndexY], 0, 0);
    currentLoopIndexX++;
    if (currentLoopIndexX >= cycleLoopX.length){
        currentLoopIndexX = 0;
        currentLoopIndexY++;
    }
    if (currentLoopIndexY >= cycleLoopY.length){
        currentLoopIndexY = 0;
        return;
    }
    window.requestAnimationFrame(game.animateEnemySprite);
}

// game.animatePjSprite = function(){
//     frameCountPj++;
//     if(frameCountPj < 5){
//         window.requestAnimationFrame(game.animatePjSprite);
//         return;
//     }
//     frameCountPj = 0;
//     game.clearCanvas();
//     // game.draw();
//     game.drawFrame(game.enemySprite, cycleLoopX[currentLoopIndexX_pj], cycleLoopY_pj[currentLoopIndexY_pj],0, 0);
//     currentLoopIndexX_pj++;
//     if (currentLoopIndexX_pj >= cycleLoopX.length){
//         currentLoopIndexX_pj = 0;
//         currentLoopIndexY_pj++;
//     }
//     if (currentLoopIndexY_pj >= cycleLoopY_pj.length){
//         currentLoopIndexY_pj = 0;
//         return;
//     }
//     window.requestAnimationFrame(game.animatePjSprite);
// }
let clicks = 0;
game.mainLoop = function(){
    clicks++;
    game.clearCanvas(); //restarts
    game.update();
    game.animateEnemySprite();
    playerDmg();
    if(clicks % 5 == 0){
        monsterDmg();
    }
    if(monster.hp <= 0){game.endLevel()}
    else{
        game.canvas.addEventListener("click", game.mainLoop);
    }
    
    
}
game.update = function(){
    if(monster.hp <= 0)
    {
        game.endLevel();
    };
}

assignEnemySprite = function(){ //saves name of file on game.enemysprite
    game.enemySprite = new Image;
    let index = ( Math.floor (Math.random() * 1) ) + 1;
    let srcName = `images/characters/enemies/monster${index}.gif`;
    game.enemySprite.src = srcName;
    monster.hp = monster.maxHp;
}

game.endLevel = function(){
    monsterLvlUp();
    assignEnemySprite();
    //restore resources, gain gold
}


