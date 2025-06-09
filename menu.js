
class Menu {
    /**
     * Initial options can be null. Otherwise it should be a list
     * of json objects, with the fields:
     * 'display': this should contain three more fields:
     *              'position': This should be a block of position and size.
     *              'content': This should be an object with a field 'label' containing text.
     *
     *              display will be printed in the middle square of the screen. 0,0 is the center of the screen,
     *              1,1 the top right of the center square, and -1,-1 is the bottom left of the center square.
     *
     * 'callback': This function will be called whenever this button is clicked. It will be passed
     *             value stored in value as well as the index of the player that clicked on the button
     *             (or negative one if the player that clicked on the button is not associated with
     *             a particular player).
     *
     * 'value': a generic field containing any other value needed by the user of this menu. Optional.
     * 'menuData': contains 'clickable' which contains whether this item is clickable. Optional.
     *
     * @param initialOptions initial menu options in case they should be provided on construction
     */
    constructor(initialOptions = null) {
        if (initialOptions) {
            this.options = initialOptions;
        } else {
            this.options = {};
        }

        for (let option of this.options) {
            if (!option.menuData) {
                option.menuData = {
                    highlighted: false,
                    beingClicked: false,
                    clickable: true
                }
            } else {
                option.menuData = {
                    highlighted: false,
                    beingClicked: false,
                    clickable: option.menuData.clickable
                }
            }
        }
    }

    addOption(display, value = null, callback = null, clickable = true) {
        this.options.push({display: display,
            value: value,
            menuData: {highlighted: false, beingClicked: false, clickable: clickable},
            callback: callback});
    }

    display(camera) {
        for (let option of this.options) {
            if (option.menuData.highlighted) {
                let optionBlock = option.display.position;
                let highlightArea = BlockFun.build(optionBlock.position.x, optionBlock.position.y, optionBlock.size.x + 0.1, optionBlock.size.y + 0.1 );
                camUtil.drawBlock(camera, highlightArea, "gold");
            }
            camUtil.drawBlock(camera, option.display.position);
            if (option.display.content) {
                camUtil.drawText(camera,
                    option.display.content.label,
                    option.display.position.position,
                    "black",
                    "15px Arial",
                    option.display.position.size.x);
            }
        }
    }

    overButton(position) {
        for (let option of this.options) {
            if (BlockFun.contains(option.display.position, position) && option.menuData.clickable) {
                return option;
            }
        }
        return null;
    }

    /**
     * This will update the meny, including updating highlighting. This function returns all the buttons pressed this
     * frame, along with the player who pressed them (or null player if it was pressed by a mouse).
     * Generally returns a list of either 0 or 1 entry, but could be more in multiplayer.
     *
     * @param players an array of controllers, each one associated with a player. If a player pressed a button,
     *                  that button player pair will be in the output.
     * @param mice an array of mice, none of which are associated with a player. If a mouse pressed a button,
     *                  that button (with a null player) will be in the output.
     * @return [] an array of objects of the form {button: pressedButton, player: player}
     */
    update(players, mice) {
        //First, clear all highlighted buttons.
        for (let option of this.options) {
            option.menuData.highlighted = false;
        }

        let pressed = [];
        //Check if a mouse was clicked
        for (let mouse of mice) {
            let buttonUnderMouse = this.overButton(mouse.position);
            if (buttonUnderMouse && buttonUnderMouse.menuData.clickable) {
                buttonUnderMouse.menuData.highlighted = true;
                if (mouse.clicked) {
                    pressed.push({button: buttonUnderMouse, player: null})
                }
            }
        }
        //Check if a player clicked
        for (let player of players) {
            let buttonUnderPlayer = this.overButton(player.mousePosition);
            if (buttonUnderPlayer && buttonUnderPlayer.menuData.clickable) {
                buttonUnderPlayer.menuData.highlighted = true;
                if (player.clicked()) {
                    pressed.push({button: buttonUnderPlayer, player: player})
                }
            }
        }
        //Call all the callbacks of clicked objects.
        for (let buttonPress of pressed) {
            if (buttonPress.button.callback) {
                buttonPress.button.callback(buttonPress.button.value, buttonPress.player);
            }
        }
        return pressed;
    }
}