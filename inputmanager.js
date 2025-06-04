const MAX_INPUT_FRAME_TIME = 0.04;

const GameInput = {
    players: [],
    inputTime: {
        time: Date.now(),
        deltaTime: 0
    },
    addNewInputScheme: function (inputMethod) {
        for (let player of GameInput.players) {
            if (player.inputMethod === null) {
                player.resetInput(inputMethod);
                return;
            }
        }
        GameInput.players.push(new PlayerInput(inputMethod));
    },
    endInputFrame: function () {
        //Update time
        let newTime = Date.now();
        GameInput.deltaTime = (GameInput.time - newTime) / 1000;
        if (GameInput.deltaTime > MAX_INPUT_FRAME_TIME) {
            GameInput.deltaTime = MAX_INPUT_FRAME_TIME;
        }
        GameInput.time = newTime;
        //Update all the playerControllers
        for (let player of GameInput.players) {
            if (player.inputMethod) {
                player.inputMethod.endFrame();
                player.updateVirtualMouse(GameInput.deltaTime);
            }
        }
    },
    anyPressPause: function () {
        for (let player of GameInput.players) {
            if (player.pressPause()) {
                return true;
            }
        }
        return false;
    },
    hasInputSource: function (source) {
        for (let player of GameInput.players) {
            if (player.source === source) {
                return true;
            }
        }
    },
    removeInputSource: function (source) {
        for (let player of GameInput.players) {
            if (player.source === source) {
                player.resetInput(null);
            }
        }
    }
};

class PlayerInput {
    constructor(inputMethod) {
        this.name = "Player " + GameInput.players.length;
        this.resetInput(inputMethod);
        this.virtualMouse = {
            position: vec2.zero(),

        };
    }

    updateVirtualMouse(deltaTime) {
        let movement = vec2.scalarMul(this.getMoveDirection(), deltaTime);
        let newMousePos = vec2.add(this.virtualMouse.position, movement);
        this.virtualMouse.position = vec2.clampLInf(newMousePos);
    }

    get mousePosition() {
        return this.virtualMouse.position;
    }

    get source() {
        return this.inputMethod ? this.inputMethod.source : null;
    }

    resetInput(inputMethod) {
        this.inputMethod = inputMethod;
    }

    pressJump() {
        return this.inputMethod && this.inputMethod.pressJump();
    }

    getMoveDirection() {
        if (this.inputMethod === null) {
            return vec2.zero();
        }
        if (this.inputMethod.getMoveDirection) {
            return this.inputMethod.getMoveDirection();
        }
        let direction = vec2.new(this.getHorizontal(), this.getHorizontal());
        return vec2.clampUnit(direction);
    }

    getHorizontal() {
        if (this.inputMethod === null) {
            return 0;
        }
        if (this.inputMethod.getHorizontal) {
            return this.inputMethod.getHorizontal();
        }
        let direction = this.inputMethod.getMoveDirection();
        let toUnitSquare = vec2.l2ToLInf(direction);
        return toUnitSquare.x;
    }
    getVertical () {
        if (this.inputMethod === null) {
            return 0;
        }
        if (this.inputMethod.getVertical) {
            return this.inputMethod.getVertical();
        }
        let direction = this.inputMethod.getMoveDirection();
        let toUnitSquare = vec2.l2ToLInf(direction);
        return toUnitSquare.y;
    }
    pressPause () {
        return this.inputMethod && this.inputMethod.pressPause();
    }
}

GameInput.players.push(new PlayerInput(null));