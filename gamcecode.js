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
        x: 0,
        y: 0
    },
    size: {
        x: 0.5,
        y: 1
    },
    velocity: {
        x: 0,
        y: 0
    },
    stats: {
        jumpHeight: 20,
        runSpeed: 5
    }
};

var worldData = {
    gravity: -100,
    time: {
        currentTime: new Date(),
        deltaTime: 0,
    },
    camera: {
        position: {x: 0, y: 0},
        viewSize: 5,
        canvas: canvas,
        context: context
    }
};


function drawBlock(color, position, size, camera){
    camera.context.fillStyle = color;

    //Gets the average Screen Size
    const screenSizeAvg = (camera.canvas.clientHeight + camera.canvas.clientWidth) / 2;
    const scale = screenSizeAvg / camera.viewSize;

    //Translating coordinate system so that y is up and zero is at the bottom.
    const cameraRelX = position.x - camera.position.x;
    const cameraRelY = position.y - camera.position.y;
    const screenX = scale * cameraRelX;
    const screenY = canvas.height - scale * cameraRelY;
    const screenWidth = scale * size.x;
    const screenHeight = scale * size.y;

    //position is middle of rectangle.
    context.fillRect(screenX - screenWidth/2, screenY - screenHeight/2, screenWidth, screenHeight);
}

function isOnGround(character){
    const bottom = character.position.y - character.size.y/2;
    return bottom <= 0;
}

function updateTime(worldTime) {
    const newTime = new Date();
    worldTime.deltaTime = (newTime.getTime() - worldTime.currentTime.getTime()) /1000;
    worldTime.currentTime = newTime;
}

function update(){
    updateTime(worldData.time);
    if(keySet.has('a')){
        player.position.x-= player.stats.runSpeed * worldData.time.deltaTime;
    }
    if(keySet.has('d')){
        player.position.x+= player.stats.runSpeed * worldData.time.deltaTime;
    }
    if(keyDownSet.has('w')){
        player.velocity.y = player.stats.jumpHeight;

        player.position.y += 0.00001;
    }
    if(isOnGround(player)){
        player.position.y = player.size.y/2;
        player.velocity.y = 0;
    }
    else {
        player.velocity.y+= worldData.gravity * worldData.time.deltaTime;;
        player.position.y+= player.velocity.y * worldData.time.deltaTime;
    }

    context.fillStyle = "purple";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawBlock("pink", player.position, player.size, worldData.camera);

    keyDownSet.clear();
    requestAnimationFrame(update);
}
updateTime(worldData.time);
update();
