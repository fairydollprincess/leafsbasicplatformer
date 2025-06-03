
function getPlayer() {
   return {
        position: vec2.zero(),
        size: vec2.new(0.5, 1),
        velocity: vec2.zero(),
        status: {
            curJumps: 0,
        },
        stats: {
            jumpHeight: 20, //Leafs tall and seconds
            rise: {
                neutral: {force: 7, drag: vec2.new(0.01, 0.01)},
                down: {force: 20, drag: vec2.new(0.1, 30)}
            },
            fall: {neutral: {force: 7, drag: vec2.new(0.8, 20)},
                    down: {force: 50, drag: vec2.new(4, 8)}},
            ground: {force: 70, drag: 10, stopSpeed: 0.1},
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
 * position = initialState.position - initialState.velocity/drag + force/drag^2 + force * deltaTime /drag -
 *              (initialState.velocity - force/drag)*e^(-drag * deltaTime)  / drag
 *
 * @param initialState an object containing a position and a velocity
 * @param force an object describing how the object is accelerating
 * @param deltaTime how much time to move the object subject to these parameters
 * @param drag how much drag to apply to the object.
 */
function stateAfterKinematics(initialState, force = vec2.zero(), deltaTime = 0, drag ={x:0.000001,y:0.000001}) {
    if (typeof drag === "number") {
        drag = {x: drag, y: drag};
    }

    let newState = {position: vec2.zero(), velocity: vec2.zero(), size: initialState.size};
    //New Equation
    let targetVelocity = vec2.div(force, drag);
    let residualMag = vec2.exp(vec2.scalarMul(drag, - deltaTime));
    let residualVelocity = vec2.mul(vec2.sub(initialState.velocity, targetVelocity), residualMag);
    newState.velocity = vec2.add(residualVelocity, targetVelocity);
    newState.position = vec2.sub(vec2.add(initialState.position, vec2.scalarMul(targetVelocity, deltaTime)),
                                vec2.div(vec2.sub(vec2.add(residualVelocity, targetVelocity), initialState.velocity),
                                        drag));
    return newState;
}

function updatePlayerPositionAndVelocity(player, newState) {
    player.position = newState.position;
    player.velocity = newState.velocity;
}


function groundUpdate(player, worldData) {
    let xMoveDirection = player.input.getHorizontal();
    let force = {x: xMoveDirection*player.stats.ground.force, y: 0};
    let newState = stateAfterKinematics(player, force, worldData.time.deltaTime, player.stats.ground.drag);
    newState.velocity.y = 0;
    if (force.x === 0 && Math.abs(newState.velocity.x) < player.stats.ground.stopSpeed) {
        newState.velocity.x = 0;
    }
    player.status.curJumps = 0;

    if(player.input.pressJump()){
        newState.velocity.y = player.stats.jumpHeight;
        newState.position.y += 0.00001;
    }
    return newState;
}

function stateFromState(player, worldData, state) {
    let xMoveDirection = player.input.getHorizontal();
    let force = {x: xMoveDirection*state.force, y: worldData.gravity};
    return stateAfterKinematics(player, force, worldData.time.deltaTime, state.drag);
}

function airUpdate(player, worldData) {
    let newState = {};
    if (player.velocity.y < 0) {
        if (player.input.getVertical() < 0) {
            newState= stateFromState(player, worldData, player.stats.fall.down);
        } else {
            newState= stateFromState(player, worldData, player.stats.fall.neutral);
        }
    } else {
        if (player.input.getVertical() < 0) {
            newState= stateFromState(player, worldData, player.stats.rise.down);
        } else {
            newState= stateFromState(player, worldData, player.stats.rise.neutral);
        }
    }

    if(player.input.pressJump()){
        if (player.status.curJumps < player.stats.maxDoubleJump) {
            newState.velocity.y = player.stats.jumpHeight;
            player.status.curJumps++;
        }
    }
    return newState;
}

function updatePlayer(player, worldData){
    let newState;
    if(isOnGround(player, worldData.map.blocks)){
        newState = groundUpdate(player, worldData);
    }
    else {
        newState = airUpdate(player, worldData);
    }
    interactWithBlock(player, newState, worldData.map.blocks);
    updatePlayerPositionAndVelocity(player, newState);
    resetIfOutofBounds(player, worldData);

    player.input.endFrame();
}
// checks if player is on the ground or a block
function isOnGround(player, allBlocks){
    for(var block of allBlocks){
        if(BlockFun.onBlock(player, block)){
            return true;
        }
    }
    return false;
}

// checks if player is out of bounds and resets player
function resetIfOutofBounds(player, worldData){
    if (!BlockFun.intersects(player, worldData.map.spawnData.bounds)){
        player.position = worldData.map.spawnData.spawnPoint;
        player.velocity = {x: 0, y: 0};
    }
}

function drawPlayer(player, camera){
    drawBlock("pink", player.position, player.size, camera);
}

// make player not fall through the blocks by checking if they're intersecting a block
// if player intersects top of block, have them land on top
function interactWithBlock(prevPos, endPos, allBlocks){
    // go through all blocks and check if player is intersecting them
    for(var block of allBlocks){
        // move player on top of the block if they're interesting it
        if(!BlockFun.intersects(endPos, block)) {
            continue;
        }
        // figure out what side player hit the block from
            //top side
        if(BlockFun.strictlyAbove(prevPos, block)) {
            endPos.position.y = block.position.y + prevPos.size.y / 2 + block.size.y / 2;
            endPos.velocity.y = 0;
        }
            //right side
        else if(BlockFun.strictlyToTheRight(prevPos, block)){
            endPos.position.x = block.position.x + prevPos.size.x / 2 + block.size.x / 2;
            endPos.velocity.x = 0;
        }
            //left side
        else if(BlockFun.strictlyToTheLeft(prevPos, block)){
            endPos.position.x = block.position.x - prevPos.size.x / 2 - block.size.x / 2;
            endPos.velocity.x = 0;
        }
            //bottom
        else if(BlockFun.strictlyBelow(prevPos, block)){
            endPos.position.y = block.position.y - prevPos.size.y / 2 - block.size.y / 2;
            endPos.velocity.y = 0;
        } else {
            //If somehow we were in the block to time steps in a row, put the player on top.
            endPos.position.y = block.position.y + prevPos.size.y / 2 + block.size.y / 2;
            endPos.velocity.y = 0;
        }
    }
}