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
    `{"spawnData":{"spawnPoint":{"x":5,"y":1},"bounds":{"position":{"x":0,"y":0},"size":{"x":100,"y":50}}},
    "graphics":{"name":"Autumn Level","viewSize":"24","viewCenter":{"x":-11.25,"y":-13.5},"color":"#004d65"},"collectMode":{"hearts":[{"position":{"x":-19,"y":4},"size":{"x":0.5,"y":0.5}},{"position":{"x":6,"y":-5},"size":{"x":0.5,"y":0.5}},{"position":{"x":-39,"y":-5},"size":{"x":0.5,"y":0.5}},{"position":{"x":-7,"y":-6},"size":{"x":0.5,"y":0.5}},{"position":{"x":0,"y":-8},"size":{"x":0.5,"y":0.5}},{"position":{"x":27,"y":10},"size":{"x":0.5,"y":0.5}},{"position":{"x":-25,"y":-10},"size":{"x":0.5,"y":0.5}},{"position":{"x":43.5,"y":-16.5},"size":{"x":0.5,"y":0.5}},{"position":{"x":38,"y":-4.25},"size":{"x":0.5,"y":0.5}},{"position":{"x":44,"y":11},"size":{"x":0.5,"y":0.5}},{"position":{"x":-23.5,"y":-19.5},"size":{"x":0.5,"y":0.5}},{"position":{"x":4,"y":-23},"size":{"x":0.5,"y":0.5}}]},
    "blocks":[{"position":{"x":0,"y":-1},"size":{"x":25,"y":2},"graphics":{"color":"green"}},{"position":{"x":-20,"y":-15.5},"size":{"x":38,"y":1},"graphics":{"color":"#785700"}},{"position":{"x":-20,"y":-14.5},"size":{"x":38,"y":1},"graphics":{"color":"#4f7a28"}},{"position":{"x":-35,"y":-7},"size":{"x":2,"y":14},"graphics":{"color":"#553d00"}},{"position":{"x":-32,"y":-6.5},"size":{"x":4,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-38.5,"y":-3.5},"size":{"x":5,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-40.5,"y":-5.5},"size":{"x":1,"y":3},"graphics":{"color":"#553d00"}},{"position":{"x":-39,"y":-6.5},"size":{"x":2,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-37,"y":-10.5},"size":{"x":2,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-42,"y":-4.5},"size":{"x":2,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-33.5,"y":-12.5},"size":{"x":1,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-35.5,"y":1.5},"size":{"x":7,"y":5},"graphics":{"color":"#ff6a00"}},{"position":{"x":-29,"y":-6},"size":{"x":2,"y":2},"graphics":{"color":"#ff6a00"}},{"position":{"x":-8.5,"y":-12.5},"size":{"x":5,"y":3},"graphics":{"color":"#ffa57d"}},{"position":{"x":-8.5,"y":-10.5},"size":{"x":1,"y":1},"graphics":{"color":"#7c2a00"}},{"position":{"x":18.5,"y":-8},"size":{"x":5,"y":4},"graphics":{"color":"#d95000"}},{"position":{"x":18.5,"y":-5},"size":{"x":1,"y":2},"graphics":{"color":"#7c2a00"}},{"position":{"x":11,"y":-9.5},"size":{"x":4,"y":3},"graphics":{"color":"#ff6a00"}},{"position":{"x":4.5,"y":-13},"size":{"x":3,"y":4},"graphics":{"color":"#ff8647"}},{"position":{"x":4.5,"y":-10.5},"size":{"x":1,"y":1},"graphics":{"color":"#7c2a00"}},{"position":{"x":11.5,"y":-6.5},"size":{"x":1,"y":3},"graphics":{"color":"#7c2a00"}},{"position":{"x":10,"y":-5.5},"size":{"x":2,"y":1},"graphics":{"color":"#7c2a00"}},{"position":{"x":9.5,"y":-6.5},"size":{"x":1,"y":1},"graphics":{"color":"#7c2a00"}},{"position":{"x":19,"y":13.5},"size":{"x":2,"y":1},"graphics":{"color":"#fecb3e"}},{"position":{"x":21,"y":10},"size":{"x":2,"y":6},"graphics":{"color":"#fecb3e"}},{"position":{"x":19,"y":6.5},"size":{"x":2,"y":1},"graphics":{"color":"#fecb3e"}},{"position":{"x":-7.5,"y":12.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":30.5,"y":10.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":25.5,"y":3.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":13.5,"y":10.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":-41.5,"y":9.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":-24.5,"y":5.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":-30.5,"y":11.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":-19,"y":-10.5},"size":{"x":4,"y":7},"graphics":{"color":"#11053b"}},{"position":{"x":-16.5,"y":-5.5},"size":{"x":3,"y":3},"graphics":{"color":"#11053b"}},{"position":{"x":-17.5,"y":-3.5},"size":{"x":1,"y":1},"graphics":{"color":"#11053b"}},{"position":{"x":-15.5,"y":-3.5},"size":{"x":1,"y":1},"graphics":{"color":"#11053b"}},{"position":{"x":-22.5,"y":-12.5},"size":{"x":3,"y":1},"graphics":{"color":"#11053b"}},{"position":{"x":-23.5,"y":-10},"size":{"x":1,"y":4},"graphics":{"color":"#11053b"}},{"position":{"x":-25,"y":-8.5},"size":{"x":2,"y":1},"graphics":{"color":"#11053b"}},{"position":{"x":-25.5,"y":-7.5},"size":{"x":1,"y":1},"graphics":{"color":"#11053b"}},{"position":{"x":-16.5,"y":-13.5},"size":{"x":1,"y":1},"graphics":{"color":"#11053b"}},{"position":{"x":-17.5,"y":-5.5},"size":{"x":1,"y":1},"graphics":{"color":"#ffaa00"}},{"position":{"x":-15.5,"y":-5.5},"size":{"x":1,"y":1},"graphics":{"color":"#ffaa00"}},{"position":{"x":-7,"y":3.5},"size":{"x":8,"y":1},"graphics":{"color":"#5a1c00"}},{"position":{"x":-7,"y":1.5},"size":{"x":6,"y":3},"graphics":{"color":"#5a1c00"}},{"position":{"x":-9,"y":5},"size":{"x":2,"y":2},"graphics":{"color":"#b51a00"}},{"position":{"x":-7,"y":5.5},"size":{"x":2,"y":3},"graphics":{"color":"#96d35f"}},{"position":{"x":-5,"y":5},"size":{"x":2,"y":2},"graphics":{"color":"#ff8c82"}},{"position":{"x":-15.5,"y":14.5},"size":{"x":1,"y":1},"graphics":{"color":"#fff995"}},{"position":{"x":3.5,"y":17.5},"size":{"x":1,"y":1},"graphics":{"color":"#fff995"}},{"position":{"x":6.5,"y":5.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}},{"position":{"x":-10.5,"y":18.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffc41"}},{"position":{"x":0.5,"y":9.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffc41"}},{"position":{"x":-54.5,"y":-19},"size":{"x":9,"y":8},"graphics":{"color":"#7a4a00"}},{"position":{"x":-54.5,"y":-34},"size":{"x":9,"y":22},"graphics":{"color":"#583400"}},{"position":{"x":54,"y":-16},"size":{"x":8,"y":2},"graphics":{"color":"#785700"}},{"position":{"x":69,"y":-16.5},"size":{"x":22,"y":1},"graphics":{"color":"#785700"}},{"position":{"x":54.5,"y":-14.5},"size":{"x":7,"y":1},"graphics":{"color":"#4f7a28"}},{"position":{"x":68.5,"y":-15.5},"size":{"x":21,"y":1},"graphics":{"color":"#4f7a28"}},{"position":{"x":52.5,"y":6},"size":{"x":5,"y":40},"graphics":{"color":"#553d00"}},{"position":{"x":51.5,"y":25},"size":{"x":23,"y":14},"graphics":{"color":"#d95000"}},{"position":{"x":37.5,"y":28},"size":{"x":5,"y":6},"graphics":{"color":"#d95000"}},{"position":{"x":-46,"y":-36},"size":{"x":8,"y":18},"graphics":{"color":"#444444"}},{"position":{"x":-54.5,"y":-14.5},"size":{"x":9,"y":1},"graphics":{"color":"#38571a"}},{"position":{"x":-52,"y":5.5},"size":{"x":4,"y":39},"graphics":{"color":"#553d00"}},{"position":{"x":-51.5,"y":24.5},"size":{"x":21,"y":15},"graphics":{"color":"#ff4013"}},{"position":{"x":-37.5,"y":24.5},"size":{"x":11,"y":7},"graphics":{"color":"#d95000"}},{"position":{"x":50.5,"y":-15.5},"size":{"x":1,"y":3},"graphics":{"color":"#38571a"}},{"position":{"x":46.5,"y":-33.5},"size":{"x":9,"y":15},"graphics":{"color":"#232323"}},{"position":{"x":63,"y":-25.5},"size":{"x":24,"y":17},"graphics":{"color":"#232323"}},{"position":{"x":24.5,"y":-15.5},"size":{"x":43,"y":1},"graphics":{"color":"#785700"}},{"position":{"x":26.5,"y":-14.5},"size":{"x":39,"y":1},"graphics":{"color":"#38571a"}},{"position":{"x":11,"y":-17.5},"size":{"x":16,"y":3},"graphics":{"color":"#785700"}},{"position":{"x":27,"y":-20},"size":{"x":8,"y":4},"graphics":{"color":"#553d00"}},{"position":{"x":2.5,"y":-17},"size":{"x":1,"y":2},"graphics":{"color":"#553d00"}},{"position":{"x":-43.5,"y":-18.5},"size":{"x":5,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-41.5,"y":-20.5},"size":{"x":1,"y":3},"graphics":{"color":"#553d00"}},{"position":{"x":-47.5,"y":-8.5},"size":{"x":5,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-40.5,"y":-14.5},"size":{"x":3,"y":1},"graphics":{"color":"#4f7a28"}},{"position":{"x":-43,"y":-14},"size":{"x":2,"y":2},"graphics":{"color":"#fffb00"}},{"position":{"x":-37,"y":-20.5},"size":{"x":4,"y":3},"graphics":{"color":"#583400"}},{"position":{"x":-29.5,"y":-18.5},"size":{"x":5,"y":5},"graphics":{"color":"#785700"}},{"position":{"x":0.5,"y":-34.5},"size":{"x":85,"y":21},"graphics":{"color":"#553d00"}},{"position":{"x":-41.5,"y":-23},"size":{"x":1,"y":2},"graphics":{"color":"#553d00"}},{"position":{"x":-40.5,"y":-23.5},"size":{"x":1,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-29.5,"y":-24},"size":{"x":5,"y":2},"graphics":{"color":"#553d00"}},{"position":{"x":null,"y":null},"size":{"x":null,"y":null},"graphics":{"color":"#553d00"}},{"position":{"x":null,"y":null},"size":{"x":null,"y":null},"graphics":{"color":"#553d00"}},{"position":{"x":13.25,"y":-22.5},"size":{"x":16.5,"y":3},"graphics":{"color":"#553d00"}},{"position":{"x":51.25,"y":-21},"size":{"x":2.5,"y":7},"graphics":{"color":"#785700"}},{"position":{"x":47.5,"y":7.5},"size":{"x":5,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":44.5,"y":8},"size":{"x":3,"y":2},"graphics":{"color":"#ad3e00"}},{"position":{"x":-73,"y":-34},"size":{"x":30,"y":22},"graphics":{"color":"#583400"}},{"position":{"x":-70.5,"y":-18},"size":{"x":29,"y":6},"graphics":{"color":"#7a4a00"}},{"position":{"x":-72,"y":-19},"size":{"x":30,"y":8},"graphics":{"color":"#7a4a00"}},{"position":{"x":-73,"y":-14.5},"size":{"x":28,"y":1},"graphics":{"color":"#263e0f"}},{"position":{"x":38,"y":-19},"size":{"x":14,"y":2},"graphics":{"color":"#553d00"}},{"position":{"x":38.5,"y":-23.5},"size":{"x":13,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-5,"y":-21.5},"size":{"x":20,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-17.5,"y":-21},"size":{"x":1,"y":6},"graphics":{"color":"#553d00"}},{"position":{"x":-8.5,"y":-18.5},"size":{"x":17,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-21.5,"y":-18.5},"size":{"x":7,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-24.5,"y":-21},"size":{"x":1,"y":4},"graphics":{"color":"#553d00"}},{"position":{"x":-21.5,"y":-22.5},"size":{"x":5,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-19.5,"y":-21.5},"size":{"x":1,"y":1},"graphics":{"color":"#553d00"}},{"position":{"x":-22,"y":-20},"size":{"x":2,"y":2},"graphics":{"color":"#553d00"}},{"position":{"x":-33,"y":-18.5},"size":{"x":2,"y":3},"graphics":{"color":"#785700"}},{"position":{"x":-35,"y":-16.5},"size":{"x":6,"y":1},"graphics":{"color":"#785700"}},{"position":{"x":1.5,"y":4.5},"size":{"x":1,"y":1},"graphics":{"color":"#fffbb9"}}]}
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