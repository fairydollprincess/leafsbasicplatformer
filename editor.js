var worldData = startGame(getDefaultMapData(), getPlayer());

function changeMap(mapText) {
    worldData.map = MapFun.read(mapText);
    document.getElementById("viewSize").value = worldData.camera.viewSize = worldData.map.graphics.viewSize;
}

function updateEditorCamera() {
    worldData.camera.viewSize = worldData.map.graphics.viewSize;
    worldData.camera.position = worldData.map.graphics.viewCenter;
}

function readMapFromHTMLTextField() {
    changeMap(document.getElementById('readMapInput').value);
}

function writeToHTMLTextField() {
    document.getElementById('writeMapOutput').innerHTML  = MapFun.write(worldData.map);
}

function updateBackground() {
    worldData.map.graphics.color = document.getElementById("backgroundColor").value;
    worldData.camera.viewSize = worldData.map.graphics.viewSize = document.getElementById("viewSize").value;
}

const ADD_MODE = "adding";
const BUILDING_BLOCK_STATE = "building";
const EDIITING_BLOCK_STATE = "editing";
const DELETE_MODE = "deleting";
const MAKE_SPAWN_POINT = "spawnPoint";
const CAMERA_MOVE = "cameraMove";


var editorState = {
    mode: ADD_MODE,
    clicks: {},
    block: {},
    lastState: [],
    cameraMove: {
        clickPos: vec2.zero(),
        initialScreenPos: vec2.zero(),
    }
};

function changeMode() {
    editorState.mode = document.getElementById("editMode").value;
}

function updateBlock() {
    if (editorState.mode === ADD_MODE || editorState.mode === DELETE_MODE) {
        return;
    }
    const click1 = editorState.clicks.click1;
    const click2 = editorState.clicks.click2;
    const position = {x: (click1.x + click2.x) / 2, y: (click1.y + click2.y) / 2};
    const size = {x: Math.abs(click1.x - click2.x), y: Math.abs(click1.y - click2.y)};
    const color = document.getElementById("blockColor").value;
    editorState.block = BlockFun.finish({position: position, size: size, graphics: {color: color}});
}

function roundToGridPrecision(num) {
    const precision = document.getElementById("gridSize").value;
    return Math.round(num / precision) * precision;
}

function eventToFullPrecisionWorldPosition(event) {
    const htmlPosition = {x: event.offsetX, y: event.offsetY};
    return worldData.camera.screenPosToWorldPos(htmlPosition);
}

function eventToWorldPosition(event) {
    const fullWorldPosition = eventToFullPrecisionWorldPosition(event);
    return {x: roundToGridPrecision(fullWorldPosition.x), y: roundToGridPrecision(fullWorldPosition.y)};
}

function getIndexOfBlockAtPosition(event) {
    let index = -1;
    let cursor = {position: eventToFullPrecisionWorldPosition(event), size: {x: 0, y: 0}};
    for (let i = 0; i < worldData.map.blocks.length; i++) {
        block = worldData.map.blocks[i];
        if (BlockFun.intersects(block, cursor)) {
            index = i;
        }
    }
    return index;
}

function deleteBlockAtPosition(event) {
    let index = getIndexOfBlockAtPosition(event);
    if (index === -1) {
        return;
    }
    let deleted = worldData.map.blocks[index];
    worldData.map.blocks.splice(index, 1);
    return deleted;
}


document.getElementById("screen").addEventListener("mousedown", (event) => {
    let clickPosition = eventToWorldPosition(event);
    if (editorState.mode === CAMERA_MOVE && editorState.lastState.length > 0) {
        editorState.mode = editorState.lastState.pop();
    } else if (KeyBoardData.keySet.has("control") || event.button === 2) {
        editorState.lastState.push(editorState.mode);
        editorState.mode = CAMERA_MOVE;
        editorState.cameraMove = {
            clickPos: eventToFullPrecisionWorldPosition(event),
            initialScreenPos: worldData.map.graphics.viewCenter,
        };
    } else if (editorState.mode === ADD_MODE) {
        editorState.mode = BUILDING_BLOCK_STATE;
        editorState.clicks = {click1: clickPosition, click2: clickPosition};
        updateBlock();
    } else if (editorState.mode === BUILDING_BLOCK_STATE) {
        editorState.mode = ADD_MODE;
        editorState.clicks.click2 = clickPosition;
        updateBlock();
        if (editorState.block.size.x < 0.001 || editorState.block.size.y < 0.001) {
            return;
        }
        worldData.map.blocks.push(editorState.block);
    } else if (editorState.mode === DELETE_MODE) {
        deleteBlockAtPosition(event);
    } else if (editorState.mode === MAKE_SPAWN_POINT){
        worldData.map.spawnData.spawnPoint = clickPosition;
    }
});


document.getElementById("screen").addEventListener("mouseup", (event) => {
    if (editorState.mode === CAMERA_MOVE && editorState.lastState.length > 0) {
        editorState.mode = editorState.lastState.pop();
    }
});

document.getElementById("screen").addEventListener("mousemove", (event) => {
    let clickPosition = eventToWorldPosition(event);
    if (editorState.mode === BUILDING_BLOCK_STATE) {
        editorState.clicks.click2 = clickPosition;
        updateBlock();
    } else if (editorState.mode === CAMERA_MOVE) {
        const fullWorldPosition = eventToFullPrecisionWorldPosition(event);
        let camOffset = vec2.sub(editorState.cameraMove.clickPos, fullWorldPosition);
        worldData.map.graphics.viewCenter = vec2.add(worldData.map.graphics.viewCenter, camOffset);
        updateEditorCamera();
    }
});

function drawLevel(){
    gameFullUpdate(worldData);

    drawSpawnPoint(worldData.map.spawnData.spawnPoint, worldData.camera);
    if (editorState.mode === BUILDING_BLOCK_STATE) {
        BlockFun.draw(editorState.block, worldData.camera);
    }
    worldData.camera.drawBlockBorder(worldData.map.spawnData.bounds, "black", 1);
    worldData.camera.drawBlockBorder(worldData.map.spawnData.bounds, "white", 0.5);

    GameInput.endInputFrame();
    requestAnimationFrame(drawLevel);
}

// draws spawn point
function drawSpawnPoint(spawnPoint, camera){
    camera.drawRing(spawnPoint, 0.5, "black", "white", 0.2);
}
readMapFromHTMLTextField();
drawLevel();

function resetPlayer() {
    worldData.player.position = {x: worldData.map.worldData.spawnPoint.x, y: worldData.map.worldData.spawnPoint.y};
    worldData.player.velocity = {x: 0, y: 0};
}