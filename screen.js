const camUtil = {
    worldToScreenScale: function(camera) {
        const minScreenDim = Math.min(camera.canvas.clientHeight, camera.canvas.clientWidth);
        return minScreenDim / camera.viewSize;
    },
    getHalfViewSize: function(camera) {
        return vec2.new(camera.canvas.clientWidth/2, camera.canvas.clientHeight/2);
    },
    screenPosToWorldPos: function(screenPosition, camera) {
        const halfViewSize = camUtil.getHalfViewSize(camera);
        let relScreenPos = vec2.new( screenPosition.x - halfViewSize.x, halfViewSize.y - screenPosition.y);
        const cameraRelPos = vec2.scalarMul(relScreenPos, 1/camUtil.worldToScreenScale(camera));
        return vec2.add(cameraRelPos, camera.position);
    },
    worldPosToScreenPos: function(position, camera) {
        const scale = camUtil.worldToScreenScale(camera);
        //Translating coordinate system so that y is up and zero is at the bottom.
        const camRelPos = vec2.sub(position, camera.position);
        const halfViewSize = camUtil.getHalfViewSize(camera);
        return vec2.new(halfViewSize.x + scale * camRelPos.x,
            halfViewSize.y - scale * camRelPos.y);
    },
    //Writes the text to the screen. Writes it with 0, 0 in the middle, and 1,1 the top right.
    drawText: function(camera, text, location=vec2.zero(), color="Grey", font="50px Arial") {
        //Flips the y and makes the bottom left the origin.
        const originFixed = vec2.new(1 + location.x, 1 - location.y);
        const halfViewSize = camUtil.getHalfViewSize(camera);
        const canvasSpaceLocation = vec2.mul( originFixed, halfViewSize );

        camera.context.fillStyle = color;
        camera.context.font = font;
        const textSizeInfo = camera.context.measureText(text);
        const textSize = vec2.new(textSizeInfo.width, -textSizeInfo.fontBoundingBoxAscent);

        const topLeft = vec2.sub(canvasSpaceLocation, vec2.scalarMul(textSize, 0.5));

        camera.context.fillText(text,topLeft.x,topLeft.y);
    }
}

function drawBlock(color, position, size, camera){
    const screenPos = camUtil.worldPosToScreenPos(position, camera);
    const screenSize = vec2.scalarMul(size, camUtil.worldToScreenScale(camera));
    camera.context.fillStyle = color;
    camera.context.fillRect(screenPos.x - screenSize.x/2, screenPos.y - screenSize.y/2, screenSize.x, screenSize.y);
}


function drawRing(position, radius, camera, fillColor = null, edgeColor = null, edgeWidth = 0){
    const screenPos = camUtil.worldPosToScreenPos(position, camera);
    const scale = camUtil.worldToScreenScale(camera);
    const screenRadius = radius * scale;
    camera.context.beginPath();
    camera.context.arc(screenPos.x, screenPos.y, screenRadius, 0, 2 * Math.PI, false);

    if (fillColor) {
        camera.context.fillStyle = fillColor;
        camera.context.fill();
    }
    if (edgeColor) {
        camera.context.lineWidth = edgeWidth * scale;
        camera.context.strokeStyle = edgeColor;
        camera.context.stroke();
    }
}

function getCamera(){
    const canvas = document.getElementById("screen");
    const context = canvas.getContext("2d");
    return {
        position: vec2.new(0, 2),
        viewSize: 30,
        canvas: canvas,
        context: context
    };
}

function drawBackground(camera, background){
    camera.context.fillStyle = background;
    camera.context.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
}