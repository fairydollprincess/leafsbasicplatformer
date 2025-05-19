



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
            airForce: 7,
            fallDrag: {x:0.8,y: 20},
            groundForce: 70,
            groundStopSpeed: 0.1,
            groundDrag: 10,
            maxDoubleJump: 3
        },
       input: getDefaultInput()
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
    if(player.input.pressJump()){
        if (player.status.curJumps < player.stats.maxDoubleJump) {
            player.velocity.y = player.stats.jumpHeight;
            player.position.y += 0.00001;
            player.status.curJumps++;
        }
    }
    let xMoveDirection = player.input.getHorizontal();
    if(isOnGround(player)){
        let force = {x: xMoveDirection*player.stats.groundForce, y: 0};
        let newPosition = stateAfterKinematics(player, force, worldData.time.deltaTime, player.stats.groundDrag);
        newPosition.velocity.y = 0;
        newPosition.position.y = player.size.y/2;
        if (force.x === 0 && Math.abs(newPosition.velocity.x) < player.stats.groundStopSpeed) {
            newPosition.velocity.x = 0;
        }
        updatePlayerPositionAndVelocity(player, newPosition);
        player.status.curJumps = 0;
    }
    else {
        let newState;
        let force = {x: xMoveDirection*player.stats.airForce, y: worldData.gravity};
        if (player.velocity.y < 0) {
            newState = stateAfterKinematics(player, force, worldData.time.deltaTime, player.stats.fallDrag);
        } else {
            newState = stateAfterKinematics(player, force, worldData.time.deltaTime);
        }
        updatePlayerPositionAndVelocity(player, newState);
    }
    player.input.endFrame();
}
function isOnGround(character){
    const bottom = character.position.y - character.size.y/2;
    return bottom <= 0;
}

function drawPlayer(player, camera){
    drawBlock("pink", player.position, player.size, camera);
}