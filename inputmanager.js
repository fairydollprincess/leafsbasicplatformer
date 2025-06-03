const GameInput = {
    players: [],
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
        for (let player of GameInput.players) {
            if (player.inputMethod) {
                player.inputMethod.endFrame();
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

    getHorizontal() {
        return this.inputMethod === null ? 0 : this.inputMethod.getHorizontal();
    }
    getVertical () {
        return this.inputMethod === null ? 0 :this.inputMethod.getVertical();
    }
    pressPause () {
        return this.inputMethod && this.inputMethod.pressPause();
    }
}

GameInput.players.push(new PlayerInput(null));