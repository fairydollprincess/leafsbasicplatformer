function getDefaultInput() {
    const keySet = new Set();
    const keyDownSet = new Set();
    const keyUpSet = new Set();
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
        }
    }
}
