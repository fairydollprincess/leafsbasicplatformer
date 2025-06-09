const LEVEL_OPTION_GRID_COLUMNS = 2;
const LEVEL_OPTION_GRID_ROWS = 3;

const GAP_RATIO = 0.2;

function getLevelSelectMenu(MenuManager, selectLevelCallback) {
    let formatedLevels = [{
        display: {
            position: {
                position: vec2.zero(),
                size: vec2.new(4, 4),
                graphics: {
                    color: "#ffa0e0"
                }
            }
        },
        menuData: {
            clickable: false
        }
    }];
    let totalWidth = LEVEL_OPTION_GRID_COLUMNS + GAP_RATIO;
    let totalHeight = LEVEL_OPTION_GRID_ROWS + GAP_RATIO;
    for (let i = 0; i < LEVELS_AS_JSON.length; i++) {
        let thisLevel = LEVELS_AS_JSON[i];
        let gridX = i % LEVEL_OPTION_GRID_COLUMNS;
        let gridY = Math.floor(i / LEVEL_OPTION_GRID_COLUMNS);

        let xPosInZeroTo1 = (gridX+0.5 + GAP_RATIO/2) / totalWidth;
        let yPosInZeroTo1 = (gridY+0.5 + GAP_RATIO/2) / totalHeight;

        let normalizedXPos = 2*xPosInZeroTo1 - 1;
        let normalizedYPos = 1-2*yPosInZeroTo1;

        let position = BlockFun.build(normalizedXPos, normalizedYPos, 2*(1-GAP_RATIO)/LEVEL_OPTION_GRID_COLUMNS, 2*(1-GAP_RATIO)/LEVEL_OPTION_GRID_ROWS);

        let levelInMenu = MapDataAsLevelOption(thisLevel, position, selectLevelCallback);
        formatedLevels.push(levelInMenu);
    }
    return MenuManager.newMenu(formatedLevels);
}

function MapDataAsLevelOption(mapJSON, optionLocation,callback) {
    let map = MapFun.read(mapJSON);
    optionLocation.graphics = {color: map.graphics.color};
    return {
        display: {
            position: optionLocation,
            content: {
                label: map.graphics.name
            },
        },
        value: map,
        callback: callback
    }
}

const LEVELS_AS_JSON = [
    `{"spawnData":{"spawnPoint":{"x":-13,"y":13},"bounds":{"position":{"x":0,"y":0},"size":{"x":100,"y":50}}},
        "graphics":{"name":"Overhang","viewSize":"30","viewCenter":{"x":0,"y":0},"color":"#5e14b8"},
        "blocks":[{"position":{"x":-13,"y":10.5},"size":{"x":6,"y":1},"graphics":{"color":"#d040ff"}},{"position":{"x":-9.5,"y":7},"size":{"x":1,"y":6},"graphics":{"color":"#d040ff"}},{"position":{"x":-14.5,"y":6},"size":{"x":3,"y":2},"graphics":{"color":"#d040ff"}},{"position":{"x":-8,"y":4.5},"size":{"x":2,"y":1},"graphics":{"color":"#d040ff"}},{"position":{"x":-13,"y":3.5},"size":{"x":2,"y":1},"graphics":{"color":"#d040ff"}},{"position":{"x":-16.5,"y":1},"size":{"x":1,"y":18},"graphics":{"color":"#d040ff"}},{"position":{"x":-9.5,"y":-10.5},"size":{"x":33,"y":1},"graphics":{"color":"#d040ff"}},{"position":{"x":-23,"y":-5.5},"size":{"x":4,"y":1},"graphics":{"color":"#d040ff"}},{"position":{"x":-18.5,"y":0},"size":{"x":3,"y":2},"graphics":{"color":"#d040ff"}},{"position":{"x":-23,"y":4.5},"size":{"x":4,"y":1},"graphics":{"color":"#d040ff"}},{"position":{"x":16,"y":-8.5},"size":{"x":16,"y":5},"graphics":{"color":"#d040ff"}},{"position":{"x":-15.5,"y":8.5},"size":{"x":1,"y":1},"graphics":{"color":"#ff94e8"}}]}
        `
    ,
    `{
"spawnData": {
    "spawnPoint": {"x": 0, "y": 0},
    "bounds": {"position": {"x": 0, "y": 0}, "size": {"x": 60, "y": 30}}
},
"graphics": {
    "name": "Demo Level",
    "viewSize": 30,
    "viewCenter": {"x": 0, "y": 0},
    "color": "purple"
},
"collectMode": {
    "hearts": [
    {
        "position": {"x": -15, "y": 6} 
    }]
},
"blocks": 
[
    {
        "position": {"x": 0, "y": -1},
        "size": {"x": 25, "y": 2}
    },
    {
        "position": {"x": 0, "y": -5},
        "size": {"x": 5, "y": 1},
        "graphics": {"color": "cyan"}
    },
    {
        "position": {"x": 15, "y": -5},
        "size": {"x": 5, "y": 1},
        "graphics": {"color": "cyan"}
    },
    {
        "position": {"x": 25, "y": -5},
        "size": {"x": 5, "y": 1},
        "graphics": {"color": "cyan"}
    },
    {
        "position": {"x": -15, "y": -5},
        "size": {"x": 5, "y": 1},
        "graphics": {"color": "cyan"}
    },
    {
        "position": {"x": -25, "y": -5},
        "size": {"x": 5, "y": 1},
        "graphics": {"color": "cyan"}
    },
    {
        "position": {"x": 3, "y": 2},
        "size": {"x": 1, "y": 1}
    },
    {
        "position": {"x": 0, "y": 3},
        "size": {"x": 1, "y": 2}
    },
    {
        "position": {"x": -3, "y": 0.5},
        "graphics": {"color": "brown"}
    },
    {
        "position": {"x": -15, "y": 5},
        "graphics": {"color": "white"}
    },
    {
        "position": {"x": 15, "y": 5},
        "graphics": {"color": "white"}
    }
    ]
    }`
];