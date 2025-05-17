function drawBlock(color, position, size, camera){
    camera.context.fillStyle = color;

    //Gets the average Screen Size
    const screenSizeAvg = (camera.canvas.clientHeight + camera.canvas.clientWidth) / 2;
    const scale = screenSizeAvg / camera.viewSize;

    //Translating coordinate system so that y is up and zero is at the bottom.
    const cameraRelX = position.x - camera.position.x;
    const cameraRelY = position.y - camera.position.y;
    const screenX = (camera.canvas.width/2) + scale * cameraRelX;
    const screenY = (camera.canvas.height/2) - scale * cameraRelY;
    const screenWidth = scale * size.x;
    const screenHeight = scale * size.y;

    //position is middle of rectangle.
    camera.context.fillRect(screenX - screenWidth/2, screenY - screenHeight/2, screenWidth, screenHeight);
}

function getCamera(){
    const canvas = document.getElementById("screen");
    const context = canvas.getContext("2d");
    return {
        position: {x: 0, y: 2},
        viewSize: 10,
        canvas: canvas,
        context: context
    };
}

function drawBackground(camera){
    camera.context.fillStyle = "purple";
    camera.context.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
}