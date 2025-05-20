function worldToScreenScale(camera) {
    const minScreenDim = Math.min(camera.canvas.clientHeight, camera.canvas.clientWidth);
    return minScreenDim / camera.viewSize;
}

function drawBlock(color, position, size, camera){
    camera.context.fillStyle = color;

    //Gets the average Screen Size
    const scale = worldToScreenScale(camera);

    //Translating coordinate system so that y is up and zero is at the bottom.
    const cameraRelX = position.x - camera.position.x;
    const cameraRelY = position.y - camera.position.y;
    const screenX = (camera.canvas.clientWidth/2) + scale * cameraRelX;
    const screenY = (camera.canvas.clientHeight/2) - scale * cameraRelY;
    const screenWidth = scale * size.x;
    const screenHeight = scale * size.y;

    //position is middle of rectangle.
    camera.context.fillRect(screenX - screenWidth/2, screenY - screenHeight/2, screenWidth, screenHeight);
}

function screenPosToWorldPos(screenPosition, camera) {
    let relScreenPos = {
        x: screenPosition.x - (camera.canvas.clientWidth/2),
        y: (camera.canvas.clientHeight/2) - screenPosition.y
    };
    const screenToWorldScale = 1/worldToScreenScale(camera);
    const cameraRelPos = {x: relScreenPos.x * screenToWorldScale, y: relScreenPos.y * screenToWorldScale};
    return {x: cameraRelPos.x + camera.position.x, y: cameraRelPos.y + camera.position.y};
}

function getCamera(){
    const canvas = document.getElementById("screen");
    const context = canvas.getContext("2d");
    return {
        position: {x: 0, y: 2},
        viewSize: 30,
        canvas: canvas,
        context: context
    };
}

function drawBackground(camera, background){
    camera.context.fillStyle = background;
    camera.context.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
}