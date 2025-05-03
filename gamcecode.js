//alert("hello world");

var keySet = new Set();
var keyDownSet = new Set();
document.addEventListener("keydown", (event) => {
    keySet.add(event.key.toLowerCase());
    keyDownSet.add(event.key.toLowerCase())
});
document.addEventListener("keyup", (event) => {
    keySet.delete(event.key.toLowerCase());
});

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

var player = {
    position: {
        x: 10,
        y: 10
    },
    size: {
        x: 10,
        y: 10
    },
    velocity: {
        x: 0,
        y: 0
    },
    stats: {
        jumpHeight: 10
    }
};

const gravity = -1;

function drawBlock(color, position, size){
    context.fillStyle = color;
    //Translating coordinate system so that y is up and zero is at the bottom.
    const screenX = position.x;
        const screenY = canvas.height - position.y;
    //position is middle of rectangle.
    context.fillRect(screenX - size.x/2, screenY - size.y/2, size.x, size.y);
}

function isOnGround(character){
    const bottom = character.position.y - character.size.y/2;
    return bottom <= 0;
}

function update(){
    if(keySet.has('a')){
        player.position.x--;
    }
    if(keySet.has('d')){
        player.position.x++;
    }
    if(keyDownSet.has('w')){
        player.velocity.y+=player.stats.jumpHeight;

        player.position.y ++;
    }
    if(isOnGround(player)){
        player.position.y = player.size.y/2;
        player.velocity.y = 0;
    }
    else {
        player.velocity.y+=gravity;
        player.position.y+=player.velocity.y;
    }

    context.fillStyle = "purple";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawBlock("pink", player.position, player.size);

    keyDownSet.clear();
    requestAnimationFrame(update);
}
update();
