class ClickManager {
    constructor(camera) {
        this.position = vec2.zero();
        this.clicked = false;
        this.camera = camera;

        document.getElementById("screen").addEventListener("click", (event) => {
            this.updatePosition(event);
            this.clicked = true;
        });
        document.getElementById("screen").addEventListener("mousemove", (event) => {
            this.updatePosition(event);
        });
    }

    updatePosition(mouseEvent) {
        const htmlPosition = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
        this.position = camUtil.screenPosToWorldPos(htmlPosition, this.camera);
    }

    endFrame() {
        this.clicked = false;
    }
}
GameInput.addMouse(new ClickManager(MenuManager.camera));