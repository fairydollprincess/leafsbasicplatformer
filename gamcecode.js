var worldData = {
    gravity: -100,
    player: getPlayer(),
    time: {
        currentTime: new Date(),
        deltaTime: 0,
    },
    map: getDefaultMapData(),
    camera: getCamera()
};


function updateTime(worldTime) {
    const newTime = new Date();
    worldTime.deltaTime = (newTime.getTime() - worldTime.currentTime.getTime()) /1000;
    worldTime.currentTime = newTime;
}

function update(){
    updateTime(worldData.time);
    updatePlayer(worldData.player, worldData)
    drawBackground(worldData.camera);
    MapFun.draw(worldData.map, worldData.camera);
    drawPlayer(worldData.player, worldData.camera)
    requestAnimationFrame(update);
}
updateTime(worldData.time);
update();
