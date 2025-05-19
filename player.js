
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
        status: {
            curJumps: 0,
        },
        stats: {
            jumpHeight: 20, //Leafs tall and seconds
            runSpeed: 5,
            fallDrag: 10,
            maxDoubleJump: 3
        }
    };
}

/**
 * Applies kinematic equations to get the new positions and velocities after deltaTime passes. It does not change
 * the variables passed in, but returns a new state.
 *
 * We evolve the system according to the equation: acceleration = force - drag * initialState.velocity.
 * This equation has a closed form solution of:
 * velocity = (initialState.velocity - force/drag)*e^(-drag * deltaTime) + force/drag
 * position = initialState.position - initialState.velocity/drag + force/drag^2 + force * deltaTime /drag - (initialState.velocity - force/drag)*e^(-drag * deltaTime)  / drag
 *
 * @param initialState an object containing a position and a velocity
 * @param force an object describing how the object is accelerating
 * @param deltaTime how much time to move the object subject to these parameters
 * @param drag how much drag to apply to the object.
 */
function stateAfterKinematics(initialState, force = {x:0,y:0}, deltaTime = 0, drag ={x:0.000001,y:0.000001}) {
    if (typeof drag === "number") {
        drag = {x: drag, y: drag};
    }

    let newState = {position: {x:0,y:0}, velocity:{x:0,y:0}};
    //New Equation
    let targetVelocity = {
        x: force.x / drag.x,
        y: force.y / drag.y
    }
    let residualVelocity = {
        x: (initialState.velocity.x - targetVelocity.x) * Math.exp(-drag.x * deltaTime),
        y: (initialState.velocity.y - targetVelocity.y) * Math.exp(-drag.y * deltaTime)
    };
    newState.velocity = {
        x: residualVelocity.x + targetVelocity.x,
        y: residualVelocity.y + targetVelocity.y
    };
    newState.position = {
        x: initialState.position.x + targetVelocity.x * deltaTime -
            (residualVelocity.x - initialState.velocity.x + targetVelocity.x) / drag.x,
        y: initialState.position.y + targetVelocity.y * deltaTime -
            (residualVelocity.y - initialState.velocity.y + targetVelocity.y) / drag.y
    };
    return newState;
}

function updatePlayerPositionAndVelocity(player, newState) {
    player.position = newState.position;
    player.velocity = newState.velocity;
}

function updatePlayer(player, worldData){
    if(keySet.has('a')){
        player.position.x-= player.stats.runSpeed * worldData.time.deltaTime;
    }
    if(keySet.has('d')){
        player.position.x+= player.stats.runSpeed * worldData.time.deltaTime;
    }
    if(keyDownSet.has('w')){
        if (player.status.curJumps < player.stats.maxDoubleJump) {
            player.velocity.y = player.stats.jumpHeight;
            player.position.y += 0.00001;
            player.status.curJumps++;
        }
    }
    if(isOnGround(player)){
        player.position.y = player.size.y/2;
        player.velocity.y = 0;
        player.status.curJumps = 0;
    }
    else {
        let newState;
        if (player.velocity.y < 0) {
            newState = stateAfterKinematics(player, {x:0,y:worldData.gravity}, worldData.time.deltaTime, player.stats.fallDrag);
        } else {
            newState = stateAfterKinematics(player, {x:0,y:worldData.gravity}, worldData.time.deltaTime);
        }
        updatePlayerPositionAndVelocity(player, newState);
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