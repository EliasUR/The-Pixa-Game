// ----------------------RESPONSIVE----------------------//
let screen, rules, itemsDiv,mainBar, skillsBar, shopBar, shopIcon;

function ajustarVentana (){
     screen = document.querySelector("#gameArea");
     rules = document.querySelector('#rules');
     itemsDiv = document.querySelector('#itemsDiv')
     mainBar = document.querySelector("#main_bar");
     skillsBar = document.querySelector("#skills_bar");
     shopBar = document.querySelector("#shop_bar");
     shopIcon = document.querySelector("#store");

    screen.style.height = (window.innerHeight);
    screen.style.width = (window.innerWidth);

    game.canvas.width = (window.innerWidth / 1.7);
    game.canvas.height = (window.innerHeight / 1.4);

    mainBar.style.width = game.canvas.width + "px";
    mainBar.style.height = (game.canvas.height / 3) + "px";
}


window.addEventListener('resize', ajustarVentana);


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
let bloodAudio = new Audio('sounds/bloodlust.mp3')


// ----------------------OBJETOS--------------------------- //
let player = {
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
    xp: 0,
    money: 200
}

let monster = {
    lvl: 1,
    maxHp: 20,
    hp: 20,
    att: 5,
    def: 2,
    critChance: 8,
    critMult: 1.5
}

let skill1 = { //ATAQUE MÁS FUERTE
    lvl: 1,
    upgradeNumber: 1,
    purchased: false,
    isItem: false,
    price: 10,
    upgradePrice: 5,
    mana: 5,
    att: 10
}

let skill2 = { //AUMENTA A DEFENSA MAXIMA
    lvl: 1,
    upgradeNumber: 2,
    purchased: false,
    isItem: false,
    price: 20,
    upgradePrice: 10,
    mana: 15
}

let skill3 ={ // ATACA y ROBA VIDA
    lvl: 1,
    upgradeNumber: 3,
    purchased: false,
    isItem: false,
    price: 30,
    upgradePrice: 15,
    att: 6,
    mana: 10
}

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


//--------------------FUNCIONES-------------------------//

// Daño basico del jugador (calcula si es crítico o no)
function playerDmg (){
    monster.hp -= Math.random()*100 <= player.critChance ? (player.att)*player.critMult - monster.def : player.att - monster.def;
}

// Daño del monstruo (calcula si es crítico o no)
function monsterDmg (){
    player.hp -= Math.random()*100 <= monster.critChance ? Math.round((monster.att)*monster.critMult - player.def) : monster.att - player.def;
}

// Level up
function playerLvlUp (){
    player.lvl ++;
    player.hp = Math.round(player.hp * 1.15);
    player.att = Math.round(player.att * 1.15);
    player.maxDef = Math.round(player.def * 1.1);
}

// Monster level up
function monsterLvlUp (){
    monster.lvl ++;
    monster.hp = Math.round(monster.hp * 1.15);
    monster.att = Math.round(monster.att * 1.15);
    monster.def = Math.round(monster.def * 1.10);
}

// Skills
function skill1F (){
    monster.hp -= skill1.att;
    player.mana = player.mana - skill1.mana <= 0 ? 0 : player.mana - skill1.mana;
    pjAttAudio.play();
}

function skill2F (){
    player.def = player.maxDef;
    player.mana = player.mana - skill2.mana <= 0 ? 0 : player.mana - skill2.mana;
    powerUpAudio.play();
}

function skill3F (){ 
    monster.hp -= skill3.att;
    player.hp + skill3.att >= player.maxHp ? player.hp = player.maxHp : player.hp += skill3.att;
    player.mana = player.mana - skill3.mana <= 0 ? 0 : player.mana - skill3.mana;
    bloodAudio.play();
}

// Asignar BUY
function asignBuy (skill){
    if (skill.isItem == false){
        let skillId = '#upgrade' + skill.upgradeNumber;
        document.querySelector(skillId).innerHTML += '<p>BUY $' + skill.price + '</p>';
    }
    else{
        let skillId = '#item' + skill.upgradeNumber;
        document.querySelector(skillId).innerHTML += '<p>BUY $' + skill.price + '</p>';
    }
}

// asignBuy(skill1);
// asignBuy(skill2);
// asignBuy(skill3);
// asignBuy(item1);
// asignBuy(item2);
// asignBuy(item3);

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
            document.querySelector("#upgrade1").innerHTML = '<p>UPGRADE    $' + skill1.upgradePrice + '</p>';
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
            document.querySelector("#upgrade1").innerHTML = '<p>UPGRADE    $' + skill1.upgradePrice + '</p>';
            document.querySelector("#s1_lvl").innerHTML = '<p>Lvl.' + skill1.lvl + '</p>';
            document.querySelector("#s1_mana").innerHTML = '<p>MP ' + skill1.mana + '</p>';
    }
    else {alert("Not enough money!")}
}

function buySkill2(){
    if(skill2.purchased == false){
        if (player.money - skill2.price >= 0){
            player.money -= skill2.price;
            document.querySelector("#upgrade2").innerHTML = '<p>UPGRADE    $' + skill2.upgradePrice + '</p>';
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
            document.querySelector("#upgrade2").innerHTML = '<p>UPGRADE     $' + skill2.upgradePrice + '</p>';
            document.querySelector("#s2_lvl").innerHTML = '<p>Lvl.' + skill2.lvl + '</p>';
            document.querySelector("#s2_mana").innerHTML = '<p>MP ' + skill2.mana + '</p>';
    }
    else {alert("Not enough money!")}
}

function buySkill3(){
    if(skill3.purchased == false){
        if (player.money - skill3.price >= 0){
            player.money -= skill3.price;
            document.querySelector("#upgrade3").innerHTML = '<p>UPGRADE    $' + skill3.upgradePrice + '</p>';
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
            document.querySelector("#upgrade3").innerHTML = '<p>UPGRADE     $' + skill3.upgradePrice + '</p>';
            document.querySelector("#s3_lvl").innerHTML = '<p>Lvl. ' + skill3.lvl + '</p>';
            document.querySelector("#s3_mana").innerHTML = '<p>MP' + skill3.mana + '</p>';
    }
    else {alert("Not enough money!")}
}

// document.querySelector("#upgrade1").addEventListener('click', buySkill1);
// document.querySelector("#upgrade2").addEventListener('click', buySkill2);
// document.querySelector("#upgrade3").addEventListener('click', buySkill3);

// Usar cada skill
// document.querySelector('#s1').addEventListener('click', useSkill1);
// document.querySelector('#s2').addEventListener('click', useSkill2);
// document.querySelector('#s3').addEventListener('click', useSkill3);

//Mostrar HP, MP y PLATA
function showHpMpMoney (){
    if (player.hp == player.maxHp){
        document.querySelector("#health").style.color = 'yellow';
        document.querySelector("#health").innerHTML= '<p>' + player.hp + '</p>';
    }
    else{
        document.querySelector("#health").style.color = 'black';
        document.querySelector("#health").innerHTML= '<p>' + player.hp + '</p>';
    }

    if (player.mana == player.maxMana){
        document.querySelector("#mana").style.color = 'yellow';
        document.querySelector("#mana").innerHTML = '<p>' + player.mana + '</p>';
    }
    else{
        document.querySelector("#mana").style.color = 'black';
        document.querySelector("#mana").innerHTML = '<p>' + player.mana + '</p>';
    }
    
    document.querySelector("#money_amount").innerHTML = '<p>  x' + player.money + '</p>';
}

// showHpMpMoney();
// onclick = showHpMpMoney;


// -------------------------- SHOP ---------------------//

// COMPRAR ITEM
function buyItem1(){
        if (player.money - item1.price >= 0){
            player.money -= item1.price;
            item1.amount ++;
            document.querySelector("#i1").style.opacity = "1";
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
        buttonAudio.play();

    }
    else{
        skillsBar.style.display = "flex";
        shopBar.style.display = "none";
        shopIcon.style.backgroundImage = "url('../images/hud/store.png')";
        shopIcon.style.backgroundSize = "110% 200%"
        buttonAudio.play();
    }
}

// document.querySelector("#store").addEventListener('click', showHideShop);