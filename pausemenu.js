function BuildPauseMenu(MenuManager, EndLevelCallBack, UnpauseCallback) {
    let verifyLeaveLevel = MenuManager.newMenu([
        //Display Warning
        {
            display: {
                position: {
                    position: vec2.new(0, 0.5),
                    size: vec2.new(1, 0.5),
                    graphics: {
                        color: "#802010"
                    }
                },
                content: {
                    label: "Are you sure you want to EXIT the level?"
                }
            },
            menuData: {
                clickable: false
            }
        },
        //Return to Menu
        {
            display: {
                position: {
                    position: vec2.new(-0.4, -0.5),
                    size: vec2.new(0.5, 0.2),
                    graphics: {
                        color: "#fc8db0"
                    }
                },
                content: {
                    label: "No, Return to Pause Menu"
                }
            },
            callback: function() {
                //Just leave the warning.
                MenuManager.popMenu();
            }
        },
        // Exit Level Option
        {
            display: {
                position: {
                    position: vec2.new(0.4, -0.5),
                    size: vec2.new(0.5, 0.2),
                    graphics: {
                        color: "#911904"
                    }
                },
                content: {
                    label: "Yes, Exit Level"
                },
            },
            callback: function() {
                //Pop off the verify menu
                MenuManager.popMenu();
                EndLevelCallBack();
            }
        }
    ])
    return MenuManager.newMenu([
        //Display That the game is paused
        {
            display: {
                position: {
                    position: vec2.new(0, 0.5),
                    size: vec2.new(0.5, 0.2),
                    graphics: {
                        color: "#959595"
                    }
                },
                content: {
                    label: "Paused"
                }
            },
            menuData: {
                clickable: false
            }
        },
        // Resume Game Option
        {
            display: {
                position: {
                    position: vec2.new(-0.4, -0.5),
                    size: vec2.new(0.5, 0.2),
                    graphics: {
                        color: "#4080f0"
                    }
                },
                content: {
                    label: "Resume Game"
                },
            },
            callback: function() {
                UnpauseCallback();
            }
        },
        // Exit Level Option
        {
            display: {
                position: {
                    position: vec2.new(0.4, -0.5),
                    size: vec2.new(0.5, 0.2),
                    graphics: {
                        color: "#f08040"
                    }
                },
                content: {
                    label: "Exit Level"
                },
            },
            callback: function() {
                //Don't exit the level yet. Verify they WANT to leave first.
                MenuManager.pushMenu(verifyLeaveLevel);
            }
        }
    ]);
}