
var keySet = new Set();
var keyDownSet = new Set();
document.addEventListener("keydown", (event) => {
    keySet.add(event.key.toLowerCase());
    keyDownSet.add(event.key.toLowerCase())
});
document.addEventListener("keyup", (event) => {
    keySet.delete(event.key.toLowerCase());
});


function getPlayer() {
   return {
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
            jumpHeight: 20, //Leafs tall and seconds
            runSpeed: 5
        }
    };
}

function updatePlayer(player, worldData){
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
    keyDownSet.clear();
}
function isOnGround(character){
    const bottom = character.position.y - character.size.y/2;
    return bottom <= 0;
}

function drawPlayer(player, camera){
    drawBlock("pink", player.position, player.size, camera);
}