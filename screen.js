class Camera{
    constructor(canvas, position = vec2.zero(), viewSize = 2) {
        this.position = position;
        this.viewSize = viewSize;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }
    // finds an image and loads it into the javascript
    static readImage(url){
        const image = new Image(); // creating space for the image
        image.src = url;
        return image;
    }

    static makeCam(canvasHTMLId="screen", position = vec2.zero(), viewSize = 2) {
        return new Camera(document.getElementById(canvasHTMLId), position, viewSize);
    }

    drawBackground(background) {
        this.context.fillStyle = background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    worldToScreenScale() {
        const minScreenDim = Math.min(this.canvas.clientHeight, this.canvas.clientWidth);
        return minScreenDim / this.viewSize;
    }
    screenToWorldScale() {
        const minScreenDim = Math.min(this.canvas.clientHeight, this.canvas.clientWidth);
        return this.viewSize/ minScreenDim;
    }
    getHalfViewSize() {
        return vec2.new(this.canvas.clientWidth/2, this.canvas.clientHeight/2);
    }
    screenPosToWorldPos(screenPosition) {
        const halfViewSize = this.getHalfViewSize();
        let relScreenPos = vec2.new( screenPosition.x - halfViewSize.x, halfViewSize.y - screenPosition.y);
        const cameraRelPos = vec2.scalarMul(relScreenPos, 1/this.worldToScreenScale());
        return vec2.add(cameraRelPos, this.position);
    }
    worldPosToScreenPos(position) {
        const scale = this.worldToScreenScale();
        //Translating coordinate system so that y is up and zero is at the bottom.
        const camRelPos = vec2.sub(position, this.position);
        const halfViewSize = this.getHalfViewSize();
        return vec2.new(halfViewSize.x + scale * camRelPos.x,
            halfViewSize.y - scale * camRelPos.y);
    }
    wrapText (text, font, maxWidth) {
        let words = text.split(" ");
        if (words.length <= 0) {
            return [text];
        }
        let lines = [];
        let currentLine = words[0];
        this.context.font = font;
        //Skip the first word.
        for (let i = 1; i < words.length; i++) {
            let lineWithExtraWord = currentLine + " " + words[i];
            const textSizeInfo = this.context.measureText(lineWithExtraWord);
            let worldWidth = this.screenToWorldScale() * textSizeInfo.width;
            if (worldWidth >= maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = lineWithExtraWord;
            }
        }
        lines.push(currentLine);
        return lines;
    }
    drawText(text, location=vec2.zero(), color="Grey", font="50px Arial", maxWidth = null, lineSpacing=1.15) {
        //Flips the y and makes the bottom left the origin.
        const canvasSpaceLocation = this.worldPosToScreenPos(location);

        this.context.fillStyle = color;
        this.context.font = font;

        var lines;
        if (maxWidth) {
            lines = this.wrapText(text, font, maxWidth);
        } else {
            lines = [text];
        }
        // Get the height
        const textSizeInfo = this.context.measureText(text);
        const lineHeight = textSizeInfo.fontBoundingBoxAscent;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineHeightOffset = lineHeight * lineSpacing * (i - (lines.length-1)/2);

            const textSizeInfo = this.context.measureText(line);

            const textOffset = vec2.new(-textSizeInfo.width*0.5, lineHeightOffset + lineHeight/2);
            const topLeft = vec2.add(canvasSpaceLocation, textOffset);

            this.context.fillText(line,topLeft.x,topLeft.y);
        }
    }
    screenSpaceDrawTextTopLeft(text, location=vec2.zero(), color="Grey", font="50px Arial") {
        //Flips the y and makes the bottom left the origin.
        let screenSize = vec2.new(this.canvas.clientWidth, this.canvas.clientHeight);
        let canvasSpaceLocation = vec2.mul(location, screenSize);

        this.context.fillStyle = color;
        this.context.font = font;
        const textSizeInfo = this.context.measureText(text);
        const textSize = vec2.new(0, textSizeInfo.fontBoundingBoxAscent);

        const topLeft = vec2.add(canvasSpaceLocation, textSize);

        this.context.fillText(text,topLeft.x,topLeft.y);
    }
    screenSpaceDrawTextTopCenter(text, location=vec2.zero(), color="Grey", font="50px Arial") {
        //Flips the y and makes the bottom left the origin.
        let screenSize = vec2.new(this.canvas.clientWidth, this.canvas.clientHeight);
        let canvasSpaceLocation = vec2.mul(location, screenSize);

        this.context.fillStyle = color;
        this.context.font = font;
        const textSizeInfo = this.context.measureText(text);
        const textBasedOffset = vec2.new(-textSizeInfo.width/2, textSizeInfo.fontBoundingBoxAscent);

        const topLeft = vec2.add(canvasSpaceLocation, textBasedOffset);

        this.context.fillText(text,topLeft.x,topLeft.y);
    }
    drawBlock(block, color="black") {
        const screenPos = this.worldPosToScreenPos(block.position);
        const screenSize = vec2.scalarMul(block.size, this.worldToScreenScale());
        this.context.fillStyle = color;
        this.context.fillRect(screenPos.x - screenSize.x/2, screenPos.y - screenSize.y/2, screenSize.x, screenSize.y);
    }

    drawImage(block, image) {
        const screenPos = this.worldPosToScreenPos(block.position);
        const screenSize = vec2.scalarMul(block.size, this.worldToScreenScale());
        this.context.drawImage(image, screenPos.x - screenSize.x/2, screenPos.y - screenSize.y/2, screenSize.x, screenSize.y);
    }
    drawBlockBorder(block, color, borderWidth=0.5) {
        const screenPos = this.worldPosToScreenPos(block.position);
        const screenSize = vec2.scalarMul(block.size, this.worldToScreenScale());
        const borderSize = borderWidth * this.worldToScreenScale();

        this.context.beginPath();
        this.context.lineWidth = borderSize;
        this.context.strokeStyle = color;
        this.context.rect(screenPos.x - screenSize.x/2, screenPos.y - screenSize.y/2, screenSize.x, screenSize.y);
        this.context.stroke();
    }
    drawRing(position, radius, fillColor = null, edgeColor = null, edgeWidth = 0) {
        const screenPos = this.worldPosToScreenPos(position);
        const scale = this.worldToScreenScale();
        const screenRadius = radius * scale;
        this.context.beginPath();
        this.context.arc(screenPos.x, screenPos.y, screenRadius, 0, 2 * Math.PI, false);

        if (fillColor) {
            this.context.fillStyle = fillColor;
            this.context.fill();
        }
        if (edgeColor) {
            this.context.lineWidth = edgeWidth * scale;
            this.context.strokeStyle = edgeColor;
            this.context.stroke();
        }
    }
}