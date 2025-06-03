var currentGameInPlay = startGame(getDefaultMapData(), getPlayer());

const MENU_STATE_IN_GAME = "inGame";
const MENU_STATE_PAUSED = "paused";

var menuState = {
    controller: getDefaultInput(),
    state: MENU_STATE_IN_GAME
}


function update(){
    if (menuState.state === MENU_STATE_IN_GAME) {
        if (menuState.controller.pressPause()) {
            menuState.state = MENU_STATE_PAUSED;
            pauseGame(currentGameInPlay);
        } else {
            gameFullUpdate(currentGameInPlay);
        }
    } else if (menuState.state === MENU_STATE_PAUSED) {
        if (menuState.controller.pressPause()) {
            menuState.state = MENU_STATE_IN_GAME;
            unPauseGame(currentGameInPlay);
        } else {
            gameRender(currentGameInPlay);
            camUtil.drawText(currentGameInPlay.camera, "PAUSED", vec2.new(0, 0.5));
        }
    }
    menuState.controller.endFrame();
    requestAnimationFrame(update);
}
update();
