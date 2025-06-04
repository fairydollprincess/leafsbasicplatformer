const GAME_PAD_DEAD_ZONE = 0.25;

window.addEventListener("gamepadconnected", (e) => {
    if (!GameInput.hasInputSource(gamepadToSourceID(e.gamepad))) {
        GameInput.addNewInputScheme(NewControllerFromGamepad(e.gamepad));
    }
});

window.addEventListener("gamepaddisconnected", (e) => {
    GameInput.removeInputSource(gamepadToSourceID(e.gamepad));
});

function gamepadToSourceID(gamepad) {
    return "gamepad " + gamepad.id;
}
function NewControllerFromGamepad(gamepad) {
    return new GamepadController(gamepad);
}

class GamepadController {
    constructor(gamepad) {
        this.gamepad = gamepad;
        this.jumpPressedLastFrame= false;
        this.pausePressedLastFrame = false;
        this.source = gamepadToSourceID(gamepad);
    }
    pressJump() {
        let toReturn = !this.jumpPressedLastFrame && this.gamepad.buttons[0].pressed;
        this.jumpPressedLastFrame = this.gamepad.buttons[0].pressed;
        return toReturn;
    }
    get rawX() {
        return this.gamepad.axes[0] + this.gamepad.buttons[15].value - this.gamepad.buttons[14].value;
    }
    get rawY() {
        return -this.gamepad.axes[1] + this.gamepad.buttons[12].value - this.gamepad.buttons[13].value;
    }
    get rawJoystick() {
        return vec2.clampUnit(vec2.new(this.rawX, this.rawY));
    }
    //Hack to project the unit circle of valid joystick inputs
    //to the box of valid independent axis.
    get rawJoystickAsSquare() {
        return vec2.l2ToLInf(this.rawJoystick);
    }
    getMoveDirection() {
        let rawX = this.rawX;
        let rawY = this.rawY;
        let rawDirection = vec2.new(rawX, rawY);
        let mag = vec2.mag(rawDirection);
        if (mag < GAME_PAD_DEAD_ZONE) {
            return vec2.zero();
        }
        let direction = vec2.scalarDiv(rawDirection, mag);
        if (mag >= 1) {
            return direction;
        }
        let magAdjustment = (mag - GAME_PAD_DEAD_ZONE) / (1 - GAME_PAD_DEAD_ZONE);
        return vec2.scalarMul(direction, magAdjustment);
    }
    applyDeadZoneToSingleAxis(axis) {
        if (Math.abs(axis) < GAME_PAD_DEAD_ZONE) {
            return 0;
        }
        return Math.sign(axis) * (Math.abs(axis) - GAME_PAD_DEAD_ZONE) / (1- GAME_PAD_DEAD_ZONE);
    }
    getHorizontal() {
        return this.applyDeadZoneToSingleAxis(this.rawJoystickAsSquare.x);
    }
    getVertical() {
        return this.applyDeadZoneToSingleAxis(this.rawJoystickAsSquare.y);
    }
    pressPause() {
        let toReturn = !this.pausePressedLastFrame && this.gamepad.buttons[9].pressed;
        this.pausePressedLastFrame = this.gamepad.buttons[9].pressed;
        return toReturn;
    }
    endFrame() {
        //Don't need to update anything every frame.
    }
}