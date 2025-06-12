const LEFT_KEYBOARD_ID = "leftKeyboard";
const RIGHT_KEYBOARD_ID = "rightKeyboard";
const LEFT_PLAYER_BUTTONS = new Set(["w","a","s","d"," "]);
const RIGHT_PLAYER_BUTTONS = new Set(["arrowleft","arrowright","arrowup","arrowdown"]);

const KeyBoardData = {
    keySet: new Set(),
    keyDownSet: new Set(),
    keyUpSet: new Set()
}
document.addEventListener("keydown", (event) => {
    KeyBoardData.keySet.add(event.key.toLowerCase());
    KeyBoardData.keyDownSet.add(event.key.toLowerCase())
});
document.addEventListener("keyup", (event) => {
    KeyBoardData.keySet.delete(event.key.toLowerCase());
    KeyBoardData.keyUpSet.add(event.key.toLowerCase());
});

function getKeyBoardLeftPlayer() {
    return {
        state: KeyBoardData,
        source: LEFT_KEYBOARD_ID,
        pressJump: function() {
            return KeyBoardData.keyDownSet.has("w") || KeyBoardData.keyDownSet.has(" ");
        },
        getHorizontal: function() {
            let val = 0;
            if (KeyBoardData.keySet.has("d")) {
                val++;
            }
            if (KeyBoardData.keySet.has("a")) {
                val--;
            }
            return val;
        },
        getVertical: function() {
            let val = 0;
            if (KeyBoardData.keySet.has("w")) {
                val++;
            }
            if (KeyBoardData.keySet.has("s")) {
                val--;
            }
            return val;
        },
        pressPause: function() {
            return KeyBoardData.keyDownSet.has("p");
        },
        endFrame: function() {
            KeyBoardData.keyUpSet.clear();
            KeyBoardData.keyDownSet.clear();
        },
        clicked: function() {
            return KeyBoardData.keyDownSet.has(" ");
        }
    }
}

function getKeyBoardRightPlayer(startingKey) {
    return {
        state: KeyBoardData,
        source: RIGHT_KEYBOARD_ID,
        pressJump: function() {
            return KeyBoardData.keyDownSet.has("arrowup");
        },
        getHorizontal: function() {
            let val = 0;
            if (KeyBoardData.keySet.has("arrowright")) {
                val++;
            }
            if (KeyBoardData.keySet.has("arrowleft")) {
                val--;
            }
            return val;
        },
        getVertical: function() {
            let val = 0;
            if (KeyBoardData.keySet.has("arrowup")) {
                val++;
            }
            if (KeyBoardData.keySet.has("arrowdown")) {
                val--;
            }
            return val;
        },
        pressPause: function() {
            return KeyBoardData.keyDownSet.has("p");
        },
        endFrame: function() {
            KeyBoardData.keyUpSet.clear();
            KeyBoardData.keyDownSet.clear();
        },
        clicked: function() {
            return KeyBoardData.keyDownSet.has("m");
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (LEFT_PLAYER_BUTTONS.has(event.key.toLowerCase()) && !GameInput.hasInputSource(LEFT_KEYBOARD_ID)) {
        GameInput.addNewInputScheme(getKeyBoardLeftPlayer());
    }
    if (RIGHT_PLAYER_BUTTONS.has(event.key.toLowerCase()) && !GameInput.hasInputSource(RIGHT_KEYBOARD_ID)) {
        GameInput.addNewInputScheme(getKeyBoardRightPlayer());
    }
});