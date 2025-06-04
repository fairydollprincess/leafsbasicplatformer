const MAX_GAME_FRAME_TIME = 0.1;

function startGame(map, player) {
    let worldData = {
        gravity: -100,
        player: player,
        time: {
            startTime: Date.now() / 1000,
            currentTime: Date.now() / 1000,
            gameTime: 0,
            deltaTime: 0,
        },
        gameMode: {
            heartCounter: 0,
            hearts: map.collectMode.hearts
        },
        map: map,
        camera: camUtil.getCamera(map.graphics.viewCenter, map.graphics.viewSize)
    };
    reSpawnPlayer(player, worldData);
    return worldData;
}

function countHearts(worldData){
    // check if touching a heart
    let kept = [];
    for(let heart of worldData.gameMode.hearts){
        if(BlockFun.intersects(heart, worldData.player)){
            //Delete the heart and increment heart counter.
            worldData.gameMode.heartCounter++;
        } else {
            kept.push(heart);
        }
    }
    worldData.gameMode.hearts = kept;
}

function drawHearts(worldData) {
    for (let heart of worldData.gameMode.hearts) {
        camUtil.drawBlock(worldData.camera, heart, "#ffc0d0");
    }
    camUtil.screenSpaceDrawTextTopLeft(worldData.camera, "hearts: " + worldData.gameMode.heartCounter,
        vec2.new(0.01, .01), "#ffc0d0", "30px Garamond");
    // check if all hearts are collected
    if(worldData.gameMode.hearts.length === 0) {
        camUtil.screenSpaceDrawTextTopCenter(worldData.camera, "you got all the hearts" ,
            vec2.new(0.5, 0), "#e85f83", "40px Garamond");
    }
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
    updatePlayer(worldData.player, worldData);
    countHearts(worldData);

}

function gameRender(worldData) {
    drawBackground(worldData.camera, worldData.map.graphics.color);
    MapFun.draw(worldData.map, worldData.camera);
    drawPlayer(worldData.player, worldData.camera);
    drawHearts(worldData);
}

function gameFullUpdate(worldData) {
    gameLogicUpdate(worldData);
    gameRender(worldData);
}