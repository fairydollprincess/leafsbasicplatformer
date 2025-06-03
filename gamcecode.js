const MENU_STATE_IN_GAME = "inGame";
const MENU_STATE_PAUSED = "paused";
const MENU_STATE_LEVEL_SELECT = "levelSelect";

var menuState = {
    state: MENU_STATE_LEVEL_SELECT,
    currentGameInPlay: startGame(getDefaultMapData(), getPlayer()),
    levelSelectMenu: getLevelSelectMenu()
}

function update(){
    if (menuState.state === MENU_STATE_IN_GAME) {
        if (GameInput.anyPressPause()) {
            menuState.state = MENU_STATE_PAUSED;
            pauseGame(menuState.currentGameInPlay);
        } else {
            gameFullUpdate(menuState.currentGameInPlay);
        }
    } else if (menuState.state === MENU_STATE_PAUSED) {
        if (GameInput.anyPressPause()) {
            menuState.state = MENU_STATE_IN_GAME;
            unPauseGame(menuState.currentGameInPlay);
        } else {
            gameRender(menuState.currentGameInPlay);
            camUtil.drawText(menuState.levelSelectMenu.camera, "PAUSED", vec2.new(0, 0.5));
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
