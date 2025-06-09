const MENU_STATE_IN_GAME = "inGame";
const MENU_STATE_PAUSED = "paused";
const MENU_STATE_LEVEL_SELECT = "levelSelect";

function changeStateToLevelSelectState() {
    MenuManager.flushMenus();
    menuState.state = MENU_STATE_LEVEL_SELECT;
    GameInput.resetMice();
    MenuManager.pushMenu(menuState.levelSelectMenu);
}

function changeStateToPauseState() {
    menuState.state = MENU_STATE_PAUSED;
    pauseGame(menuState.currentGameInPlay);
    GameInput.resetMice();
    MenuManager.pushMenu(menuState.pauseMenu);
}

function returnStateFromPauseState() {
    menuState.state = MENU_STATE_IN_GAME;
    unPauseGame(menuState.currentGameInPlay);
    MenuManager.flushMenus();
}

function changeFromLevelSelectToInGameState(map, player) {
    if (player != null) {
        menuState.currentGameInPlay = startGame(map, getPlayer(player));
    } else {
        menuState.currentGameInPlay = startGame(map, getPlayer());
    }
    menuState.state = MENU_STATE_IN_GAME;
}

const menuState = {
    state: MENU_STATE_LEVEL_SELECT,
    currentGameInPlay: startGame(getDefaultMapData(), getPlayer()),
    levelSelectMenu: getLevelSelectMenu(MenuManager, changeFromLevelSelectToInGameState),
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
        MenuManager.updateMenu(GameInput.players, GameInput.mice);
        MenuManager.drawMenu(GameInput.players, GameInput.mice);
    }
    GameInput.endInputFrame();
    requestAnimationFrame(update);
}
changeStateToLevelSelectState();
update();
