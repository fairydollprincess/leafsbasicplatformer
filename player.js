class Player {
    constructor(controller = GameInput.players[0], stats = {
        jumpHeight: 20, //Leafs tall and seconds
        rise: {
            neutral: {force: 7, drag: vec2.new(0.01, 0.01)},
            down: {force: 20, drag: vec2.new(0.1, 30)}
        },
        fall: {
            neutral: {force: 7, drag: vec2.new(0.8, 20)},
            down: {force: 50, drag: vec2.new(4, 8)}
        },
        ground: {force: 70, drag: 10, stopSpeed: 0.1},
        maxDoubleJump: 3
    }) {
        this.body = {
            block: {
                position: vec2.zero(),
                size: vec2.new(0.5, 1),
            },
            velocity: vec2.zero(),
        };
        this.graphics = {
            left: Camera.readImage("./images/characters/orangefairy/left.png"),
            right: Camera.readImage("./images/characters/orangefairy/right.png")
        };
        this.status = {
            curJumps: 0,
            directionFaced: -1 // fairy starts facing left
        };
        this.stats = stats;
        this.input = controller;

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
    stateAfterKinematics(force = vec2.zero(), deltaTime = 0, drag = {x: 0.000001, y: 0.000001}) {
        if (typeof drag === "number") {
            drag = {x: drag, y: drag};
        }
        let initialState = this.body;

        let newState = {block: {position: vec2.zero(), size: initialState.block.size}, velocity: vec2.zero()};
        //New Equation
        let targetVelocity = vec2.div(force, drag);
        let residualMag = vec2.exp(vec2.scalarMul(drag, -deltaTime));
        let residualVelocity = vec2.mul(vec2.sub(initialState.velocity, targetVelocity), residualMag);
        newState.velocity = vec2.add(residualVelocity, targetVelocity);
        newState.block.position = vec2.sub(vec2.add(initialState.block.position, vec2.scalarMul(targetVelocity, deltaTime)),
            vec2.div(vec2.sub(vec2.add(residualVelocity, targetVelocity), initialState.velocity),
                drag));
        return newState;
    }

    updatePlayerPositionAndVelocity(newState) {
        this.body = newState;
    }


    groundUpdate(worldData) {
        let xMoveDirection = this.input.getHorizontal();
        let force = {x: xMoveDirection * this.stats.ground.force, y: 0};
        let newState = this.stateAfterKinematics(force, worldData.time.deltaTime, this.stats.ground.drag);
        newState.velocity.y = 0;
        if (force.x === 0 && Math.abs(newState.velocity.x) < this.stats.ground.stopSpeed) {
            newState.velocity.x = 0;
        }
        this.status.curJumps = 0;

        if (this.input.pressJump()) {
            newState.velocity.y = this.stats.jumpHeight;
            newState.block.position.y += 0.00001;
        }
        return newState;
    }

    stateFromState(worldData, state) {
        let xMoveDirection = this.input.getHorizontal();
        let force = {x: xMoveDirection * state.force, y: worldData.gravity};
        return this.stateAfterKinematics(force, worldData.time.deltaTime, state.drag);
    }

    airUpdate(worldData) {
        let newState = {};
        if (this.body.velocity.y < 0) {
            if (this.input.getVertical() < 0) {
                newState = this.stateFromState( worldData, this.stats.fall.down);
            } else {
                newState = this.stateFromState( worldData, this.stats.fall.neutral);
            }
        } else {
            if (this.input.getVertical() < 0) {
                newState = this.stateFromState(worldData, this.stats.rise.down);
            } else {
                newState = this.stateFromState( worldData, this.stats.rise.neutral);
            }
        }

        if (this.input.pressJump()) {
            if (this.status.curJumps < this.stats.maxDoubleJump) {
                newState.velocity.y = this.stats.jumpHeight;
                this.status.curJumps++;
            }
        }
        return newState;
    }

    update(worldData) {
        let newState;
        if (this.isOnGround(worldData.map.blocks)) {
            newState = this.groundUpdate(worldData);
        } else {
            newState = this.airUpdate( worldData);
        }
        Player.interactWithBlock(this.body, newState, worldData.map.blocks);
        this.updatePlayerPositionAndVelocity(newState);
        this.resetIfOutofBounds(worldData);
    }

// checks if player is on the ground or a block
    isOnGround(allBlocks) {
        for (var block of allBlocks) {
            if (BlockFun.onBlock(this.body.block, block)) {
                return true;
            }
        }
        return false;
    }

    respawn(worldData) {
        this.body.block.position = worldData.map.spawnData.spawnPoint;
        this.body.velocity = {x: 0, y: 0};
    }

// checks if player is out of bounds and resets player
    resetIfOutofBounds(worldData) {
        if (!BlockFun.intersects(this.body.block, worldData.map.spawnData.bounds)) {
            this.respawn(worldData);
        }
    }

    draw(camera) {
        if(this.input.getHorizontal() < 0){
            this.status.directionFaced = -1;
        }
        else if(this.input.getHorizontal() > 0){
            this.status.directionFaced = 1;
        }

        if(this.status.directionFaced < 0){
            camera.drawImage(this.body.block, this.graphics.left);
        }
        else {
            camera.drawImage(this.body.block, this.graphics.right);
        }
    }

    static interactWithBlock(prevPos, endPos, allBlocks) {
        // go through all blocks and check if player is intersecting them
        for (var block of allBlocks) {
            // move player on top of the block if they're interesting it
            if (!BlockFun.intersects(endPos.block, block)) {
                continue;
            }
            // figure out what side player hit the block from
            //top side
            if (BlockFun.strictlyAbove(prevPos.block, block)) {
                endPos.block.position.y = block.position.y + prevPos.block.size.y / 2 + block.size.y / 2;
                endPos.velocity.y = 0;
            }
            //right side
            else if (BlockFun.strictlyToTheRight(prevPos.block, block)) {
                endPos.block.position.x = block.position.x + prevPos.block.size.x / 2 + block.size.x / 2;
                endPos.velocity.x = 0;
            }
            //left side
            else if (BlockFun.strictlyToTheLeft(prevPos.block, block)) {
                endPos.block.position.x = block.position.x - prevPos.block.size.x / 2 - block.size.x / 2;
                endPos.velocity.x = 0;
            }
            //bottom
            else if (BlockFun.strictlyBelow(prevPos.block, block)) {
                endPos.block.position.y = block.position.y - prevPos.block.size.y / 2 - block.size.y / 2;
                endPos.velocity.y = 0;
            } else {
                //If somehow we were in the block to time steps in a row, put the player on top.
                endPos.block.position.y = block.position.y + prevPos.block.size.y / 2 + block.size.y / 2;
                endPos.velocity.y = 0;
            }
        }
    }
}
