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

function adjustGamePadInput(rawAxis) {
    if (Math.abs(rawAxis) <= GAME_PAD_DEAD_ZONE) {
        return 0;
    }
    let clampedAxis = Math.min(Math.abs(rawAxis), 1);
    let normedAxis = (clampedAxis-GAME_PAD_DEAD_ZONE) / (1 - GAME_PAD_DEAD_ZONE);
    return normedAxis * Math.sign(rawAxis);
}

function NewControllerFromGamepad(gamepad) {
    let state = {
        jumpPressedLastFrame: false,
        pausePressedLastFrame: false
    };
    return {
        state: state,
        source: gamepadToSourceID(gamepad),
        pressJump: function() {
            let toReturn = !state.jumpPressedLastFrame && gamepad.buttons[0].pressed;
            state.jumpPressedLastFrame = gamepad.buttons[0].pressed;
            return toReturn;
        },
        getHorizontal: function() {
            let rawX = gamepad.axes[0] + gamepad.buttons[15].value - gamepad.buttons[14].value;
            return adjustGamePadInput(rawX);
        },
        getVertical: function() {
            let rawY = -gamepad.axes[1] + gamepad.buttons[12].value - gamepad.buttons[13].value;
            return adjustGamePadInput(rawY);
        },
        pressPause: function() {
            let toReturn = !state.pausePressedLastFrame && gamepad.buttons[9].pressed;
            state.pausePressedLastFrame = gamepad.buttons[9].pressed;
            return toReturn;
        },
        endFrame: function() {
            //Don't need to update anything every frame.
        }
    }
}