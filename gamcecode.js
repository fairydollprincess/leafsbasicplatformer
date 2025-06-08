const MENU_STATE_IN_GAME = "inGame";
const MENU_STATE_PAUSED = "paused";
const MENU_STATE_LEVEL_SELECT = "levelSelect";

function changeStateToLevelSelectState() {
    menuState.state = MENU_STATE_LEVEL_SELECT;
}

function changeStateToPauseState() {
    menuState.state = MENU_STATE_PAUSED;
    pauseGame(menuState.currentGameInPlay);
    MenuManager.pushMenu(menuState.pauseMenu);
}

function returnStateFromPauseState() {
    menuState.state = MENU_STATE_IN_GAME;
    unPauseGame(menuState.currentGameInPlay);
    MenuManager.popMenu();
}

const menuState = {
    state: MENU_STATE_LEVEL_SELECT,
    currentGameInPlay: startGame(getDefaultMapData(), getPlayer()),
    levelSelectMenu: getLevelSelectMenu(),
    pauseMenu: BuildPauseMenu(MenuManager, changeStateToLevelSelectState, returnStateFromPauseState)
}


function update(){
    if (menuState.state === MENU_STATE_IN_GAME) {
        if (GameInput.anyPressPause()) {
            changeStateToPauseState();
        } else {
            gameFullUpdate(menuState.currentGameInPlay);
        }
    } else if (menuState.state === MENU_STATE_PAUSED) {
        if (GameInput.anyPressPause()) {
            returnStateFromPauseState();
        } else {
            gameRender(menuState.currentGameInPlay);
            MenuManager.updateMenu(GameInput.players, GameInput.mice);
            MenuManager.drawMenu(GameInput.players, GameInput.mice);
        }
    } else if (menuState.state === MENU_STATE_LEVEL_SELECT) {
        let selectedLevel = getSelectedLevel(menuState.levelSelectMenu);
        if (selectedLevel) {
            menuState.currentGameInPlay = startGame(selectedLevel, getPlayer());
            menuState.state = MENU_STATE_IN_GAME;
        } else {
            drawLevelSelect(menuState.levelSelectMenu);
        }
    }
    GameInput.endInputFrame();
    requestAnimationFrame(update);
}
update();
