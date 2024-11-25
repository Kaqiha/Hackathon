// Select the canvas and set up the 2D drawing context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let tick = 0;
let tickstart = false;
mode = 0;
const images = [
    {name: "note", src: "Note.png", image: new Image()},
    {name: "bg", src: "sheet.png", image: new Image()},
    {name: "start", src: "Start.png", image: new Image()}
];

class Player {
    constructor(x, key) {
        this.x = x;
        this.key = key;
        this.y = 666; 
    }

    static width = canvas.width / 4;
    static height = 20;
}

class FallingObject {
    constructor(x, ky,iy) {
        this.x = x * canvas.width; 
        this.ly = ky; // local y
        this.iy = iy; // Where the shit spawns
        this.speed = 5; 
        if (this.ly >= 0) {
            this.y = this.ly;
        } else {
            this.y = -1;
        }
    }
    objectCollected = false;
    static width = canvas.width / 4;
    static height = 30;
}

const playerf = new Player(0, "f");
const playerg = new Player(100, "g");
const playerh = new Player(200, "h");
const playerj = new Player(300, "j");
const players = [playerf, playerg, playerh, playerj];

let objects = [];
let score = 0;
let onum = 1; 
let isGameOver = false;
let hp = 10;

document.addEventListener("keydown", (e) => {
    if (e.key === "f") playerf.y = 530;
    if (e.key === "g") playerg.y = 530;
    if (e.key === "h") playerh.y = 530;
    if (e.key === "j") playerj.y = 530;
    if (tickstart == false) tick = 0;
    tickstart = true;

});
document.addEventListener("keyup", (e) => {
    if (e.key === "f") playerf.y = 666;
    if (e.key === "g") playerg.y = 666;
    if (e.key === "h") playerh.y = 666;
    if (e.key === "j") playerj.y = 666;
    tickstart = false;
});
let mX = 4;
let mY = 3;
document.addEventListener("click", (e) => {
    mX = e.offsetX;
    mY = e.offsetY;
});

let highscore = 0;

function map(val, sy) {
    for (i = 0; i < 4; i++) {
        if (val.charAt(i) == '1') {
            objects.push(new FallingObject(i / 4, sy, sy));
        }
    }
    return;
}

let start = true;
let menu = false;
let aspeed = 0;
function gameLoop() {
    if (start) {
        ctx.drawImage(images.find(img => img.name === "start").image,0,0,canvas.width,canvas.height);
        ctx.fillText(`Score: ${score}  Highscore: ${highscore} Hp: ${hp}`, 10, 20);
        if (
            mX < 230 &&
            mX > 170 &&
            mY < 370 &&
            mY > 270
        ) {
            o = 0
            start = false;
            setInterval(spawnObjects, 200);
        }
    } else if (menu) {
        ctx.drawImage(images.find(img => img.name === "start").image,0,0,canvas.width,canvas.height);
        ctx.fillText(`Score: ${score}  Highscore: ${highscore} Hp: ${hp}`, 10, 20);
        if (
            mX < 230 &&
            mX > 170 &&
            mY < 370 &&
            mY > 270
        ) {
            
            o = 0
            aspeed = 0;
            menu = false;
            setInterval(spawnObjects, 200);
        }
    } else {
        if (isGameOver) {
            menu = true;
            isGameOver = false;
            objects = []
            mX = 0;
            mY = 0;
            hp = 10;
            if (score > highscore) highscore = score;
            score = 0;
            onum = 1;
        }
        ctx.filter = "blur(5px)";
        ctx.drawImage(images.find(img => img.name === "bg").image,0,0);
        ctx.filter = "none";
        ctx.fillStyle = "DarkSlateGrey";
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0,0,400,600)
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.fillText("F", 42.5, 580);
        ctx.fillText("G", 142.5, 580);
        ctx.fillText("H", 242.5, 580);
        ctx.fillText("J", 342.5, 580);

        // Draw the players
        ctx.fillStyle = "DarkKhaki";
        ctx.fillRect(0,530,Player.width*4,Player.height);
        ctx.fillStyle = "Khaki";
        players.forEach(player => {
            ctx.fillRect(player.x, player.y, Player.width, Player.height);
        });

        ctx.fillStyle = "blue";
        objects.forEach(object => {
            object.speed = 5 + aspeed;
            if (object.objectCollected == false && object.ly >= 0) {
                ctx.drawImage(images.find(img => img.name === "note").image, object.x, object.y);
            }
            if (object.ly < 0) {
                object.ly += object.speed;
            } else {
                object.y += object.speed;
                object.ly = object.y;
            }

            players.forEach(player => {
                if (
                    object.x < player.x + Player.width &&
                    object.x + FallingObject.width > player.x &&
                    object.y < player.y + FallingObject.height + 11 &&
                    object.y > player.y - Player.height - 11 && 
                    tick <= 15
                ) {
                    if (object.objectCollected == false){
                        score++;
                    }
                    object.objectCollected = true;
                    
                }
            });

            if (object.y > canvas.height) {
                if (object.objectCollected == false) {
                    hp -= 1;
                    if (hp <= 0) {
                        isGameOver = true;
                        alert(`Game Over! Your score: ${score}, Your highscore: ${highscore}`);
                    }
                    if (mode == 1) {
                        object.x = canvas.width * Math.floor(Math.random() * 4) / 4;
                        object.y = object.iy;
                        object.ly = object.y;
                        object.objectCollected = false;
                    } else {
                        objects.splice(objects.indexOf(object), 1);
                    }
                }
                if (object.objectCollected == true) {
                    if (mode == 1) {
                        object.x = canvas.width * Math.floor(Math.random() * 4) / 4;
                        object.y = object.iy;
                        object.ly = object.y;
                        object.objectCollected = false;
                    } else {
                        objects.splice(objects.indexOf(object), 1);
                    }
                    }
                }
            }
        );
        
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}  Highscore: ${highscore} Hp: ${hp}`, 10, 20);
    };
    if (tickstart) tick += 1;
    if (aspeed <= score/20) {
        aspeed += 1;
    }
    requestAnimationFrame(gameLoop);
};

let loadedImagesCount = 0;
function checkImagesLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === images.length) {
        // All images are loaded, start the game
        gameLoop();
    }
}
images.forEach(img => {
    img.image.src = img.src;
    img.image.onload = checkImagesLoaded;
});

let o = 0;
mop = ["0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111","0000","0000","0000","0000","0001","0010","0001","0010","0001","0010","0001","0010","0001","0010","0001","0010","0001","0010","1000","0100","1000","0100","1000","0100","1000","0100","1000","0100"]
function spawnObjects() {
    // Only spawn objects if the game is not in the start or menu state
    if (!start && !menu) {
        const randomMap = mop[Math.floor(Math.random() * mop.length)];
        map(randomMap, -100 * o);
        o += 1;
    }
}

setInterval(spawnObjects, 200);

