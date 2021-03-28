let skillsBar, shopBar, shopIcon; 

//------------------------AUDIO---------------------------//
let pjAttAudio = new Audio('sounds/swordAtac.ogg');
let pjDeathAudio = new Audio('sounds/die.ogg');
let victoryAudio = new Audio('sounds/victory.ogg');
let monsterDeathAudio = new Audio('sounds/dieEnemi.ogg');
let purchaseAudio = new Audio('sounds/cash.ogg');
let coin1Audio = new Audio('sounds/coin1.ogg');
let coin2Audio = new Audio('sounds/coin2.ogg');
let food1Audio = new Audio('sounds/food.ogg');
let food2Audio = new Audio('sounds/food2.ogg');
let potion1Audio = new Audio('sounds/potion.ogg');
let potion2Audio = new Audio('sounds/potion2.ogg');
let powerUpAudio = new Audio('sounds/powerUp.ogg');
let buttonAudio = new Audio('sounds/button.mp3');
let bloodAudio = new Audio('sounds/bloodlust.mp3');
let introMusic = new Audio("../musica/Evil Morty's Theme (For The Damaged Coda) [8 Bit Tribute to Blonde Redhead & Rick and Morty].mp3");
let music = [
    new Audio("../musica/Believer [8 Bit Tribute to Imagine Dragons] - 8 Bit Universe.mp3"),
    new Audio("../musica/Eye of the Tiger (8 Bit Remix Cover Version) [Tribute to Survivor] - 8 Bit Universe.mp3"),
    new Audio("../musica/Gods Plan [8 Bit Tribute to Drake] - 8 Bit Universe.mp3"),
    new Audio("../musica/Highest In The Room [8 Bit Tribute to Travis Scott] - 8 Bit Universe.mp3")
]

// ----------------------OBJETOS--------------------------- //
let skill1 = { //ATAQUE MÁS FUERTE
    img: new Image(),
    lvl: 1,
    upgradeNumber: 1,
    purchased: false,
    isItem: false,
    price: 10,
    upgradePrice: 5,
    mana: 5,
    att: 10,
    used: false,
    y: 450
}
skill1.img.src = "../images/items/sword.png"

let skill2 = { //AUMENTA A DEFENSA MAXIMA
    img: new Image(),
    lvl: 1,
    upgradeNumber: 2,
    purchased: false,
    isItem: false,
    price: 20,
    upgradePrice: 10,
    mana: 15,
    used: false,
    y: 420
}
skill2.img.src = "../images/hud/shield.png";

let skill3 ={ // ATACA y ROBA VIDA
    img: new Image(),
    lvl: 1,
    upgradeNumber: 3,
    purchased: false,
    isItem: false,
    price: 30,
    upgradePrice: 15,
    att: 6,
    mana: 10,
    used: false,
    y: 420
}
skill3.img.src = "../images/hud/bloodlust.png";

let item1 = { //LATA HP
    upgradeNumber: 1,
    hp: 10,
    price: 5,
    amount: 0,
    isItem: true 
}

let item2 = { //LATA MP
    upgradeNumber: 2,
    mana: 10,
    price: 8,
    amount: 0,
    isItem: true
}

let item3 = { //PIZZA
    upgradeNumber: 3,
    price: 100,
    amount: 0,
    isItem: true,
    pizza: false
}

// Skills
function skill1F (){
    player.hitting = true;
    monster.hp -= skill1.att;
    player.mana = player.mana - skill1.mana <= 0 ? 0 : player.mana - skill1.mana;
    pjAttAudio.currentTime = 0;
    pjAttAudio.play();
    skill1.y = 450;
    skill1.used = true;
}

function skill2F (){
    player.def = player.maxDef;
    player.mana = player.mana - skill2.mana <= 0 ? 0 : player.mana - skill2.mana;
    powerUpAudio.currentTime = 0;
    powerUpAudio.playbackRate = 2.0;
    powerUpAudio.play();
    skill2.y = 420;
    skill2.used = true;
}

function skill3F (){ 
    monster.hp -= skill3.att;
    player.hp + skill3.att >= player.maxHp ? player.hp = player.maxHp : player.hp += skill3.att;
    player.mana = player.mana - skill3.mana <= 0 ? 0 : player.mana - skill3.mana;
    bloodAudio.currentTime = 0;
    bloodAudio.play();
    skill3.y = 445;
    skill3.used = true;

}

function skillsAnimation (){
    if(skill1.used){
        game.ctx.drawImage(skill1.img, 200, skill1.y, 40, 40);
        if(pjAttAudio.paused){
            skill1.used = false;
        }
        skill1.y += 10
    }
    if(skill2.used){
        game.ctx.drawImage(skill2.img, 380, skill2.y, 50, 50);
        if(powerUpAudio.paused){
            skill2.used = false;
        }
        skill2.y += 10;
    }
    if(skill3.used){
        game.ctx.drawImage(skill3.img, 557, skill3.y, 60, 50);
        if(bloodAudio.paused){
            skill3.used = false;
        }
        skill3.y += 10;
    }
}

// Asignar BUY
function asignBuy (skill){
    if (skill.isItem == false){
        let skillId = '#upgrade' + skill.upgradeNumber;
        document.querySelector(skillId).innerHTML += 'BUY $' + skill.price;
    }
    else{
        let skillId = '#item' + skill.upgradeNumber;
        document.querySelector(skillId).innerHTML += 'BUY $' + skill.price;
    }
}

//Mejorar skill
function upgradeSkill(skill){
    if(skill.upgradeNumber == 1){
        skill.lvl ++;
        player.money -= skill.upgradePrice;
        skill.upgradePrice += 5;
        skill.mana += 2;
        skill.att += 2;
    }
    else if(skill.upgradeNumber == 2){
        skill.lvl ++;
        player.money -= skill.upgradePrice;
        player.maxDef += 5;
        skill.upgradePrice += 5;
        skill.mana += 2;
    }
    else if(skill.upgradeNumber == 3){
        skill.lvl ++;
        player.money -= skill.upgradePrice;
        skill.upgradePrice += 5;
        skill.att += 2;
        skill.mana += 5;
    }
}

// Usar skills (va como addevent de la imagen)
function useSkill1 (){
    if (skill1.purchased){
        if (player.mana - skill1.mana >= 0){
            skill1F();
        }
        else{alert("Not enough mana!")};
    }
    else {alert("You have to buy this skill first!")};
}  

function useSkill2 (){
    if (skill2.purchased){
        if (player.mana - skill2.mana >= 0){
            skill2F();
        }
        else{alert("Not enough mana!")};
    }
    else {alert("You have to buy this skill first!")};
}  

function useSkill3 (){
    if (skill3.purchased){
        if (player.mana - skill3.mana >= 0){
            skill3F();
        }
        else{alert("Not enough mana!")};
    }
    else {alert("You have to buy this skill first!")};
}  

// Comprar / mejorar cada skill
function buySkill1(){
    if(skill1.purchased == false){
        if (player.money - skill1.price >= 0){
            player.money -= skill1.price;
            document.querySelector("#upgrade1").innerHTML = 'UP $' + skill1.upgradePrice;
            skill1.purchased = true;
            purchaseAudio.play();
            document.querySelector("#s1").style.opacity = 1;
            document.querySelector("#s1_lvl").innerHTML = '<p>Lvl.' + skill1.lvl + '</p>';
            document.querySelector("#s1_mana").innerHTML = '<p>MP ' + skill1.mana + '</p>';
        }
        else{alert("Not enough money!")};
    }
    else if(player.money - skill1.upgradePrice >= 0){
            upgradeSkill(skill1);
            purchaseAudio.play();
            document.querySelector("#upgrade1").innerHTML = 'UP $' + skill1.upgradePrice;
            document.querySelector("#s1_lvl").innerHTML = '<p>Lvl.' + skill1.lvl + '</p>';
            document.querySelector("#s1_mana").innerHTML = '<p>MP ' + skill1.mana + '</p>';
    }
    else {alert("Not enough money!")}
}

function buySkill2(){
    if(skill2.purchased == false){
        if (player.money - skill2.price >= 0){
            player.money -= skill2.price;
            document.querySelector("#upgrade2").innerHTML = 'UP $' + skill2.upgradePrice;
            skill2.purchased = true;
            purchaseAudio.play();
            document.querySelector("#s2").style.opacity = 1;
            document.querySelector("#s2_lvl").innerHTML = '<p>Lvl.' + skill2.lvl + '</p>';
            document.querySelector("#s2_mana").innerHTML = '<p>MP' + skill2.mana + '</p>';
        }
        else{alert("Not enough money!")};
    }
    else if(player.money - skill2.upgradePrice >= 0){
            upgradeSkill(skill2);
            purchaseAudio.play();
            document.querySelector("#upgrade2").innerHTML = 'UP $' + skill2.upgradePrice;
            document.querySelector("#s2_lvl").innerHTML = '<p>Lvl.' + skill2.lvl + '</p>';
            document.querySelector("#s2_mana").innerHTML = '<p>MP ' + skill2.mana + '</p>';
    }
    else {alert("Not enough money!")}
}

function buySkill3(){
    if(skill3.purchased == false){
        if (player.money - skill3.price >= 0){
            player.money -= skill3.price;
            document.querySelector("#upgrade3").innerHTML = 'UP $' + skill3.upgradePrice;
            skill3.purchased = true;
            purchaseAudio.play();
            document.querySelector("#s3").style.opacity = 1;
            document.querySelector("#s3_lvl").innerHTML = '<p>Lvl.' + skill3.lvl + '</p>';
            document.querySelector("#s3_mana").innerHTML = '<p>MP ' + skill3.mana + '</p>';
        }
        else{alert("Not enough money!")};
    }
    else if(player.money - skill3.upgradePrice >= 0){
            upgradeSkill(skill3);
            purchaseAudio.play();
            document.querySelector("#upgrade3").innerHTML = 'UP $' + skill3.upgradePrice;
            document.querySelector("#s3_lvl").innerHTML = '<p>Lvl. ' + skill3.lvl + '</p>';
            document.querySelector("#s3_mana").innerHTML = '<p>MP' + skill3.mana + '</p>';
    }
    else {alert("Not enough money!")}
}

// -------------------------- SHOP ---------------------//

// COMPRAR ITEM
function buyItem1(){
    if (player.money - item1.price >= 0){
        player.money -= item1.price;
        item1.amount ++;
        document.querySelector("#i1").style.opacity = "1";
        purchaseAudio.currentTime = 0;
        purchaseAudio.play();
        document.querySelector("#i1_quantity").innerHTML = "<p>x" + item1.amount + '</p>';
    }
    else{alert("Not enough money!")};
}

function buyItem2(){
    if (player.money - item2.price >= 0){
        player.money -= item2.price;
        item2.amount ++;
        document.querySelector("#i2").style.opacity = "1";
        purchaseAudio.currentTime = 0;
        purchaseAudio.play();
        document.querySelector("#i2_quantity").innerHTML = "<p>x" + item2.amount + '</p>';
    }
    else{alert("Not enough money!")};
}

function buyItem3(){
    if (player.money - item3.price >= 0){
        player.money -= item3.price;
        item3.amount ++;
        document.querySelector("#i3").style.opacity = "1";
        purchaseAudio.currentTime = 0;
        purchaseAudio.play();
        document.querySelector("#i3_quantity").innerHTML = "<p>x" + item3.amount + '</p>';
    }
    else{alert("Not enough money!")};
}

// document.querySelector("#item1").addEventListener('click', buyItem1);
// document.querySelector("#item2").addEventListener('click', buyItem2);
// document.querySelector("#item3").addEventListener('click', buyItem3);

// USAR ITEM
function useItem1 (){
if (item1.amount > 0){
    item1.amount --;
    if (item1.amount == 0){
        document.querySelector("#i1").style.opacity = "0.4";
    }
    document.querySelector("#i1_quantity").innerHTML = "<p>x " + item1.amount + '</p>';
    potion2Audio.currentTime = 0;
    potion2Audio.play();

    if (player.hp + item1.hp >= player.maxHp){
        player.hp = player.maxHp;
    }
    else{
        player.hp += item1.hp;
    };
}
else {alert("You don´t have any!")};
}

function useItem2 (){
if (item2.amount > 0){
    item2.amount --;
    if (item2.amount == 0){
        document.querySelector("#i2").style.opacity = "0.4";
    }
    document.querySelector("#i2_quantity").innerHTML = "<p>x " + item2.amount + '</p>';
    potion1Audio.currentTime = 0;
    potion1Audio.play();

    if (player.mana + item2.mana >= player.maxMana){
        player.mana = player.maxMana;
    }
    else{
        player.mana += item2.mana;
    };
}
else {alert("You don´t have any!")};
}

function useItem3 (){
if(item3.amount > 0) {
    item3.amount --;
    if (item3.amount == 0){
        document.querySelector("#i3").style.opacity = "0.4";
    }
    document.querySelector("#i3_quantity").innerHTML = "<p>x " + item3.amount + '</p>';

    item3.pizza = true;
    game.music.pause();
    game.music.currentTime = 0;
    victoryAudio.currentTime = 0;
    victoryAudio.playbackRate =1.5;
    victoryAudio.play();
    alert("Wow you won a pizza!, If you want more, keep playing ;)");
}
else {alert("You don´t have any!")
}
}

// Usar cada item
// document.querySelector('#i1').addEventListener('click', useItem1);
// document.querySelector('#i2').addEventListener('click', useItem2);
// document.querySelector('#i3').addEventListener('click', useItem3);

// Mostrar o no el shop
function showHideShop (){
    if (skillsBar.style.display == "flex"){
        skillsBar.style.display = "none";
        shopBar.style.display = "flex";
        shopIcon.style.backgroundImage = "url('../images/hud/red_arrow.png')";
        shopIcon.style.backgroundSize = "100% 100%"
        buttonAudio.currentTime = 0;
        buttonAudio.play();

    }
    else{
        skillsBar.style.display = "flex";
        shopBar.style.display = "none";
        shopIcon.style.backgroundImage = "url('../images/hud/store.png')";
        shopIcon.style.backgroundSize = "110% 200%"
        buttonAudio.currentTime = 0;
        buttonAudio.play();
    }
}
