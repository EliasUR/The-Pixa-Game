const BODY = document.getElementById("body")
const SCALE = 0.75;
let principalLoop, monsterAtack; 

let game = {
    canvas: undefined,
    ctx: undefined,
    backgroundImg: undefined,
    music: undefined,
    over: false,
    start() {
        introMusic.pause();
        introMusic.currentTime = 0;
        this.setMusic();
        this.setScreen();
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.backgroundImg = new Image();
        this.backgroundImg.src = "images/background.jpg";
        monster.assignSprite();
        player.born();
        this.over = false;

        this.setListeners();
        
        principalLoop = setInterval(this.loop, 1000/12 + player.lvl);
        monsterAtack = setInterval(monster.atack, monster.delayAtt);
    },
    loop() {
        if(!game.over){
            game.clearCanvas();
            game.ctx.drawImage(game.backgroundImg, 0, 0);
            monster.animation();
            game.draw(monster);
            player.animation();
            game.draw(player);
            player.showStats();
            skillsAnimation();
            if(game.music.paused){
                game.setMusic();
            }
        }
        else{
            game.music.pause();
            game.music.currentTime = 0;
            clearInterval(monsterAtack);
            clearInterval(principalLoop);
            startScreen();
        }
        
    },
    clearCanvas() { //function that restarts the canvas
        this.canvas.width = 800;
        this.canvas.height = 500;
        // game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        
    },
    draw(e) {
        this.ctx.drawImage(e.img, e.spriteX * e.width, e.spriteY * e.height, 
            e.width, e.height, e.x, e.y, e.scaleWidth, e.scaleHeight);
        },
    nextLvl() {
        player.money += player.lvl;
        player.kills++;
        monster.destroyed();
        if(player.kills % 5 == 0){
            player.lvlUp();
        }
        else if(player.kills % 2 == 0){
            monster.lvlUp()
            let hp = player.hp + 3
            player.hp = hp < player.maxHp ? hp : player.maxHp
        }
    },
    setMusic() {
        this.music = music[Math.floor (Math.random() * 3)];
        this.music.playbackRate = 1.5;
        this.music.volume = 0.1;
        this.music.currentTime = 0;
        this.music.play();
    }
}

let player = {
    // sprite properties
    img: undefined,
    spriteX: 0,
    spriteY: 0,
    width: 300,
    height: 200,
    x: 285, //game.canvas.width/2 - 300/2,
    y: 350,
    scaleWidth: 300 * SCALE,
    scaleHeight: 200 * SCALE,

    // game properties
    lvl: 1,
    maxHp: 30,
    hp: 15,
    mana: 20,
    maxMana: 20,
    att: 5,
    maxDef: 3,
    def: 2,
    critChance: 10,
    critMult: 1.5,
    money: 200,
    kills: 0,
    hitting: false,
    dead: false,
    // methods
    atack() {
        if(!monster.dead && !player.hitting){
            player.hitting = true;
            let critical = Math.random()*100 <= player.critChance;
            let hit = critical ? (player.att)*player.critMult - monster.def : player.att - monster.def;
            monster.hp -= hit;
            pjAttAudio.currentTime = 0;
            pjAttAudio.play()
            if(monster.hp <= 0){
                game.nextLvl();
            } 
        }
    },
    animation() {
        if(this.hitting){
            if(this.spriteX < 3){
                this.spriteX++;
            }
            else{
                this.spriteY = this.spriteY == 0? 1 : 0;
                this.spriteX = 0;
                this.hitting = false
            }
        }
        if(this.dead){
            if(this.dead && this.spriteY == 1 && this.spriteX >= 2){
                game.over = true;
            }
            else if(this.spriteX < 2){
                this.spriteX++;
            }
            else{
                this.spriteY = this.spriteY == 0? 1 : 0;
                this.spriteX = 0;
            }
        }
    },
    showStats() {
        let hpColor = player.hp >= player.maxHp ? 'yellow' : 'black';
        document.querySelector("#health").style.color = hpColor;
        document.querySelector("#health").innerHTML= '<p>' + player.hp + '</p>';
        
        let manaColor = player.mana >= player.maxMana ? 'yellow' : 'black';
        document.querySelector("#mana").style.color = manaColor;
        document.querySelector("#mana").innerHTML = '<p>' + player.mana + '</p>';
        
        document.querySelector("#money_amount").innerHTML = '<p>' + player.money + '</p>';
    },
    lvlUp (){
        player.lvl ++;
        player.hp = Math.round(player.hp * 1.15);
        player.maxHp = Math.round(player.maxHp * 1.15);
        player.att = Math.round(player.att * 1.15);
        player.maxMana = Math.round(player.maxMana * 1.15);
        player.maxDef = Math.round(player.maxDef * 1.1);
    },
    born() {
        this.img = new Image();
        this.img.src = "images/characters/mainCh/player.png";
        this.spriteX = 0;
        this.spriteY = 0;
        this.hp = 15;
        this.maxHp = 30;
        this.dead = false;
        this.lvl = 1;
        this.att = 5;
        this.maxDef = 3;
        this.def = 2;
        this.kills = 0;
        this.money = 0;
        this.mana = 20;
        this.maxMana = 20;
    }
}

let monster = {
    // sprite properties
    img: undefined,
    spriteX: 0,
    spriteY: 0,
    width: 300,
    height: 300,
    x: 260,
    y: 220,
    scaleWidth: 300 * SCALE,
    scaleHeight: 300 * SCALE,

    // game properties
    lvl: 1,
    maxHp: 20,
    hp: 20,
    att: 5,
    def: 2,
    critChance: 8,
    critMult: 1.5,
    dead: false,
    delayAtt: 5000,

    //methods
    assignSprite() { //saves name of file on game.enemysprite
        let index = ( Math.floor (Math.random() * 5) ) + 1;
        let srcName = `images/characters/enemies/monster-${index}.png`;
        if(player.dead){
            this.lvl = 1;
            this.maxHp = 20;
            this.att = 5;
            this.def = 2;
            this.delayAtt = 5000;
        }
        this.img = new Image();
        this.img.src = srcName;
        this.hp = this.maxHp;
        this.y = 220;
        this.scaleWidth = 300 * SCALE;
        this.scaleHeight = 300 * SCALE;
    },
    animation() {
        if(this.spriteX < 2){
            this.spriteX++;
        }
        else if(this.dead && this.spriteY == 1 && this.spriteX == 2){
            this.assignSprite();
            this.dead = false;
            clearInterval(monsterAtack);
            monsterAtack = setInterval(monster.atack, monster.delayAtt);    
        }
        else{
            this.spriteY = this.spriteY == 0? 1 : 0;
            this.spriteX = 0;
        }
        if(!this.dead){
            this.y += 1200/this.delayAtt;
            this.scaleHeight += 1200/this.delayAtt;
            this.scaleWidth += 1200/this.delayAtt;
        }
    },
    atack() {
        bloodAudio.currentTime = 0;
        bloodAudio.play();
        player.hp -= Math.random()*100 <= monster.critChance ? Math.round((monster.att)*monster.critMult - player.def) : monster.att - player.def;
        monster.y = 220;
        monster.scaleWidth = 300 * SCALE;
        monster.scaleHeight = 300 * SCALE;
        if(player.hp <= 0){
            player.hp = 0;
            player.dead = true;
            player.img.src = "images/characters/enemies/monster-dead.png";
            player.spriteX = 0;
            player.spriteY = 0;
            player.lvl = -5;
            pjDeathAudio.playbackRate = 2.0;
            pjDeathAudio.play();
        }        
    },
    destroyed() {
        monsterDeathAudio.currentTime = 0;
        monsterDeathAudio.playbackRate = 2.5;
        monsterDeathAudio.play()
        this.img.src = "images/characters/enemies/monster-dead.png";
        this.spriteX = 0;
        this.spriteY = 0;
        this.dead = true;
    },
    lvlUp (){
        monster.lvl ++;
        monster.maxHp = Math.round(monster.maxHp * 1.15);
        monster.att = Math.round(monster.att * 1.1);
        monster.def = Math.round(monster.def * 1.10);
        monster.delayAtt = Math.round(monster.delayAtt / 1.001);
    }
}



BODY.onload = startScreen;

function startScreen() {
    introMusic.pause();
    introMusic.currentTime = 0;
    game.over = true;
    BODY.innerHTML = `
            <main>
                <header>
                    <div onclick="startScreen();">
                        <h1>Steam Pixa</h1>
                        <img src="./images/pizza.png" alt="pizza">
                    </div>
                    <a href="#instructions">Instructions</a>
                </header>
                <div id="instructions" class="sideDiv">
                    <h4>Intructions</h4>
                    <ul>
                        <li>Click on the screen to attack.</li>
                        <li>Buy skills/ items to use them.</li>
                        <li>Each skill consumes MP, pay attention to your mana.</li>
                        <li>Buy and use the HD pizza to win the game!</li>
                    </ul>
                </div>
                <div id="startScreen" class="screen">
                    
                    <a id="credits-button" href="#" onclick="showCredits()">CREDITS</a>
                    <p class="rightArrow" onclick="intro()">START</p>
                </div>
                <div id="skills" class="sideDiv">
                    <h4>Skills</h4>
                    <div class="skill_container">
                        <img src="images/hud/cebolla.png" alt="pizza de cebolla">
                        <div>
                            <h6 class="skillname">Onion Pizza:</h6>
                            <p class="skilldesc">Make your enemy suffer with the smell!</p>
                        </div>
                    </div>
                    <div class="skill_container">
                        <img src="images/hud/champignones.png" alt="pizza de cebolla">
                        <div>
                            <h6 class="skillname">Mushroom Pizza:</h6>
                            <p class="skilldesc">Increases your defenses. Mushroom power!</p>
                        </div>
                    </div>
                    <div class="skill_container">
                        <img src="images/hud/jamonymorron.png" alt="pizza de cebolla">
                        <div>
                            <h6 class="skillname">Ham and Pepper Pizza:</h6>
                            <p class="skilldesc">HP Vampirism. Sweet sweet peppers...</p>
                        </div>
                    </div>
                </div>
            </main>
        `
}

function intro () {
    document.getElementById("startScreen").remove();
    BODY.firstElementChild.innerHTML += `
        <div id="intro" class="screen">
            <div id="introCarousel" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#introCarousel" data-slide-to="0" class="active"></li>
                    <li data-target="#introCarousel" data-slide-to="1"></li>
                    <li data-target="#introCarousel" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img src="./dibujos/intro/intro1.jpg" class="d-block" alt="intro1">
                    </div>
                    <div class="carousel-item">
                    <img src="./dibujos/intro/intro2.jpg" class="d-block" alt="intro2">
                    </div>
                    <div class="carousel-item">
                    <img src="./dibujos/intro/intro3.jpg" class="d-block" alt="intro3">
                    <p class="rightArrow" onclick="game.start()">START</p>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#introCarousel" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#introCarousel" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>
    `
    introMusic.volume = 0.3;
    introMusic.playbackRate = 2.0;
    introMusic.play();
}

game.setScreen = function () {
    document.getElementById("intro").remove();
    BODY.firstElementChild.innerHTML += `        
        <div id="gameArea" class="screen">
                <canvas id="canvas"></canvas>
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
    `
}

game.setListeners = function () {
    this.canvas.onmousedown = player.atack;
    this.canvas.ontouchstart = player.atack;

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
    
    document.querySelector("#item1").addEventListener('click', buyItem1);
    document.querySelector("#item2").addEventListener('click', buyItem2);
    document.querySelector("#item3").addEventListener('click', buyItem3);
    document.querySelector('#i1').addEventListener('click', useItem1);
    document.querySelector('#i2').addEventListener('click', useItem2);
    document.querySelector('#i3').addEventListener('click', useItem3);

    skillsBar = document.querySelector("#skills_bar");
    shopBar = document.querySelector("#shop_bar");
    shopIcon = document.querySelector("#store");
    skillsBar.style.display = "flex";
    shopIcon.addEventListener('click', showHideShop);
}

function showCredits () {
    document.getElementById("startScreen").remove();
    BODY.firstElementChild.innerHTML += `
        <div id="credits" class="screen">
            <a href="#" onclick="startScreen()"> &lt;BACK</a>
            <h2>MADE BY:</h2>
            <hr>
            <div>
                <a>Agustín Sardella</a>
                <hr>
                <a>Ariel Sequeira</a>
                <hr>
                <a target="blank" href="https://github.com/EliasUR">Elías Rodríguez</a>
                <hr>
                <a>Gabriel Ríos</a>
                <hr>
                <a>José Luis Pérez</a>
                <hr>
                <a>Nicolás Sauco</a>
                <hr>
            </div>
        </div>
    `
    console.log("credits")
}