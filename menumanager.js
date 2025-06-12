const MenuManager = {
    camera: Camera.makeCam(),
    menuStack: [],
    newMenu: function(initialOptions = null) {
        return new Menu(initialOptions);
    },
    pushMenu: function(newMenu) {
        MenuManager.menuStack.push(newMenu);
        return newMenu;
    },
    pushNewMenu: function(initialOptions = null) {
        return MenuManager.pushMenu(MenuManager.newMenu(initialOptions));
    },
    popMenu: function() {
        return MenuManager.menuStack.pop();
    },
    flushMenus: function() {
        MenuManager.menuStack = [];
    },
    inMenu: function() {
        return MenuManager.menuStack.length > 0;
    },
    getCurrentMenu: function() {
        if (!MenuManager.inMenu()) {
            return null;
        }
        return MenuManager.menuStack[MenuManager.menuStack.length - 1];
    },
    drawMenu: function(players, mice) {
        if (!MenuManager.inMenu()) {
            return;
        }
        MenuManager.getCurrentMenu().display(MenuManager.camera);
        for (let player of players) {
            MenuManager.camera.drawRing(player.mousePosition, 0.01, "white", "black", 0.003);
        }
        /*
         * In general, mice don't need to be drawn as that is built in, but for testing purposes I will draw them.
         */
        for (let mouse of mice) {
            MenuManager.camera.drawRing(mouse.position, 0.01, "white", "black", 0.003);
        }
    },
    updateMenu: function(players, mice) {
        if (!MenuManager.inMenu()) {
            return;
        }
        return MenuManager.getCurrentMenu().update(players, mice);
    }

}