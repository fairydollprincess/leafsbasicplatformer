const MAX_GAME_FRAME_TIME = 0.1;

function startGame(map, player) {
    return {
        gravity: -100,
        player: player,
        time: {
            startTime: Date.now() / 1000,
            currentTime: Date.now() / 1000,
            gameTime: 0,
            deltaTime: 0,
        },
        map: map,
        camera: getCamera()
    };
}

//Just sets the deltaTime we will use when the game resumes.
function pauseGame(worldData) {
    updateTime(worldData.time);
}
// resets the currentTime so we use the delta time from when the game was paused.
function unPauseGame(worldData) {
    worldData.time.currentTime = Date.now() - worldData.time.deltaTime;
}

function updateTime(worldTime) {
    const newTime = Date.now();
    worldTime.deltaTime = (newTime - worldTime.currentTime) /1000;
    //If the framerate becomes too low, we will keep the in game framerate above
    if (worldTime.deltaTime > MAX_GAME_FRAME_TIME) {
        worldTime.deltaTime = MAX_GAME_FRAME_TIME;
    }
    worldTime.currentTime = newTime;
    worldTime.gameTime += worldTime.deltaTime;
}

function gameLogicUpdate(worldData) {
    updateTime(worldData.time);
    updatePlayer(worldData.player, worldData)
}

function gameRender(worldData) {
    drawBackground(worldData.camera, worldData.map.graphics.color);
    MapFun.draw(worldData.map, worldData.camera);
    drawPlayer(worldData.player, worldData.camera);
}

function gameFullUpdate(worldData) {
    gameLogicUpdate(worldData);
    gameRender(worldData);
}