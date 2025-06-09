const camUtil = {
    worldToScreenScale: function(camera) {
        const minScreenDim = Math.min(camera.canvas.clientHeight, camera.canvas.clientWidth);
        return minScreenDim / camera.viewSize;
    },
    screenToWorldScale: function(camera) {
        const minScreenDim = Math.min(camera.canvas.clientHeight, camera.canvas.clientWidth);
        return camera.viewSize/ minScreenDim;
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
    wrapText: function (camera, text, font, maxWidth) {
        let words = text.split(" ");
        if (words.length <= 0) {
            return [text];
        }
        let lines = [];
        let currentLine = words[0];
        camera.context.font = font;
        //Skip the first word.
        for (let i = 1; i < words.length; i++) {
            let lineWithExtraWord = currentLine + " " + words[i];
            const textSizeInfo = camera.context.measureText(lineWithExtraWord);
            let worldWidth = camUtil.screenToWorldScale(camera) * textSizeInfo.width;
            if (worldWidth >= maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = lineWithExtraWord;
            }
        }
        lines.push(currentLine);
        return lines;
    },
    drawText: function(camera, text, location=vec2.zero(), color="Grey", font="50px Arial", maxWidth = null, lineSpacing=1.15) {
        //Flips the y and makes the bottom left the origin.
        const canvasSpaceLocation = camUtil.worldPosToScreenPos(location, camera);

        camera.context.fillStyle = color;
        camera.context.font = font;

        var lines;
        if (maxWidth) {
            lines = camUtil.wrapText(camera, text, font, maxWidth);
        } else {
            lines = [text];
        }
        // Get the height
        const textSizeInfo = camera.context.measureText(text);
        const lineHeight = textSizeInfo.fontBoundingBoxAscent;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineHeightOffset = lineHeight * lineSpacing * (i - (lines.length-1)/2);

            const textSizeInfo = camera.context.measureText(line);

            const textOffset = vec2.new(-textSizeInfo.width*0.5, lineHeightOffset + lineHeight/2);
            const topLeft = vec2.add(canvasSpaceLocation, textOffset);

            camera.context.fillText(line,topLeft.x,topLeft.y);
        }
    },
    screenSpaceDrawTextTopLeft: function(camera, text, location=vec2.zero(), color="Grey", font="50px Arial") {
        //Flips the y and makes the bottom left the origin.
        let screenSize = vec2.new(camera.canvas.clientWidth, camera.canvas.clientHeight);
        let canvasSpaceLocation = vec2.mul(location, screenSize);

        camera.context.fillStyle = color;
        camera.context.font = font;
        const textSizeInfo = camera.context.measureText(text);
        const textSize = vec2.new(0, textSizeInfo.fontBoundingBoxAscent);

        const topLeft = vec2.add(canvasSpaceLocation, textSize);

        camera.context.fillText(text,topLeft.x,topLeft.y);
    },
    screenSpaceDrawTextTopCenter: function(camera, text, location=vec2.zero(), color="Grey", font="50px Arial") {
        //Flips the y and makes the bottom left the origin.
        let screenSize = vec2.new(camera.canvas.clientWidth, camera.canvas.clientHeight);
        let canvasSpaceLocation = vec2.mul(location, screenSize);

        camera.context.fillStyle = color;
        camera.context.font = font;
        const textSizeInfo = camera.context.measureText(text);
        const textBasedOffset = vec2.new(-textSizeInfo.width/2, textSizeInfo.fontBoundingBoxAscent);

        const topLeft = vec2.add(canvasSpaceLocation, textBasedOffset);

        camera.context.fillText(text,topLeft.x,topLeft.y);
    },
    getCamera: function(position = vec2.zero(), viewSize = 1) {
        const canvas = document.getElementById("screen");
        const context = canvas.getContext("2d");
        return {
            position: position,
            viewSize: viewSize,
            canvas: canvas,
            context: context
        };
    },
    drawBlock: function(camera, block, color=null) {
        if (!color) {
            if (block.graphics && block.graphics.color) {
                color = block.graphics.color;
            } else {
                color = "black";
            }
        }
        const screenPos = camUtil.worldPosToScreenPos(block.position, camera);
        const screenSize = vec2.scalarMul(block.size, camUtil.worldToScreenScale(camera));
        camera.context.fillStyle = color;
        camera.context.fillRect(screenPos.x - screenSize.x/2, screenPos.y - screenSize.y/2, screenSize.x, screenSize.y);
    },
    drawRing: function(camera, position, radius, fillColor = null, edgeColor = null, edgeWidth = 0) {
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