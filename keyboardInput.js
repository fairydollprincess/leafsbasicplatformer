const LEFT_KEYBOARD_ID = "leftKeyboard";
const RIGHT_KEYBOARD_ID = "rightKeyboard";
const LEFT_PLAYER_BUTTONS = new Set(["w","a","s","d"," "]);
const RIGHT_PLAYER_BUTTONS = new Set(["arrowleft","arrowright","arrowup","arrowdown"]);

function getKeyBoardLeftPlayer(startingKey) {
    const keySet = new Set();
    const keyDownSet = new Set();
    const keyUpSet = new Set();
    if (startingKey) {
        keySet.add(startingKey);
        keyDownSet.add(startingKey);
    }
    document.addEventListener("keydown", (event) => {
        keySet.add(event.key.toLowerCase());
        keyDownSet.add(event.key.toLowerCase())
    });
    document.addEventListener("keyup", (event) => {
        keySet.delete(event.key.toLowerCase());
        keyUpSet.add(event.key.toLowerCase());
    });
    return {
        state: {
            keySet: keySet,
            keyDownSet: keyDownSet,
            keyUpSet: keyUpSet,
        },
        source: LEFT_KEYBOARD_ID,
        pressJump: function() {
            return keyDownSet.has("w") || keyDownSet.has(" ");
        },
        getHorizontal: function() {
            let val = 0;
            if (keySet.has("d")) {
                val++;
            }
            if (keySet.has("a")) {
                val--;
            }
            return val;
        },
        getVertical: function() {
            let val = 0;
            if (keySet.has("w")) {
                val++;
            }
            if (keySet.has("s")) {
                val--;
            }
            return val;
        },
        pressPause: function() {
            return keyDownSet.has("p");
        },
        endFrame: function() {
            keyUpSet.clear();
            keyDownSet.clear();
        },
        clicked: function() {
            return keyDownSet.has(" ");
        }
    }
}

function getKeyBoardRightPlayer(startingKey) {
    const keySet = new Set();
    const keyDownSet = new Set();
    const keyUpSet = new Set();
    if (startingKey) {
        keySet.add(startingKey);
        keyDownSet.add(startingKey);
    }
    document.addEventListener("keydown", (event) => {
        keySet.add(event.key.toLowerCase());
        keyDownSet.add(event.key.toLowerCase())
    });
    document.addEventListener("keyup", (event) => {
        keySet.delete(event.key.toLowerCase());
        keyUpSet.add(event.key.toLowerCase());
    });
    return {
        state: {
            keySet: keySet,
            keyDownSet: keyDownSet,
            keyUpSet: keyUpSet,
        },
        source: RIGHT_KEYBOARD_ID,
        pressJump: function() {
            return keyDownSet.has("arrowup");
        },
        getHorizontal: function() {
            let val = 0;
            if (keySet.has("arrowright")) {
                val++;
            }
            if (keySet.has("arrowleft")) {
                val--;
            }
            return val;
        },
        getVertical: function() {
            let val = 0;
            if (keySet.has("arrowup")) {
                val++;
            }
            if (keySet.has("arrowdown")) {
                val--;
            }
            return val;
        },
        pressPause: function() {
            return keyDownSet.has("p");
        },
        endFrame: function() {
            keyUpSet.clear();
            keyDownSet.clear();
        },
        clicked: function() {
            return keyDownSet.has("m");
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (LEFT_PLAYER_BUTTONS.has(event.key.toLowerCase()) && !GameInput.hasInputSource(LEFT_KEYBOARD_ID)) {
        GameInput.addNewInputScheme(getKeyBoardLeftPlayer(event.key.toLowerCase()));
    }
    if (RIGHT_PLAYER_BUTTONS.has(event.key.toLowerCase()) && !GameInput.hasInputSource(RIGHT_KEYBOARD_ID)) {
        GameInput.addNewInputScheme(getKeyBoardRightPlayer(event.key.toLowerCase()));
    }
});