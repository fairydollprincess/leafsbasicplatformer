const BlockFun = {
    build: function (x=0, y=0, w=1, h=1) {
        return BlockFun.finish({position: {x: x, y: y}, size: {x: w, y: h}});
    },
    finish: function (block) {
        if (!Object.hasOwn(block, "graphics")) {
            block.graphics = {color: "green"};
        }
        if (!Object.hasOwn(block, "size")) {
            block.size = {x: 1, y: 1};
        }
        return block;
    },
    draw: function (block, camera) {
        drawBlock(block.graphics.color, block.position, block.size, camera);
    },
    /**
     * Returns whether blockA intersects blockB, i.e. whether there is a point in both blocks.
     * This excludes edges, so two blocks that share an edge DO NOT intersect.
     * @param blockA
     * @param blockB
     * @returns {boolean}
     */
    intersects: function(blockA, blockB) {
        let posDif = {x: (blockA.position.x - blockB.position.x), y: (blockA.position.y - blockB.position.y)};
        let avgSize = {x: (blockA.size.x + blockB.size.x)/2, y: (blockA.size.y + blockB.size.y)/2};
        return Math.abs(posDif.x) < avgSize.x && Math.abs(posDif.y) < avgSize.y;
    },
    strictlyAbove: function (thisBlock, thatBlock) {
        return thisBlock.position.y >= thatBlock.position.y + (thisBlock.size.y + thatBlock.size.y)/2;
    },
    strictlyBelow: function (thisBlock, thatBlock) {
        return thisBlock.position.y <= thatBlock.position.y - (thisBlock.size.y + thatBlock.size.y)/2;
    },
    strictlyToTheRight: function (thisBlock, thatBlock) {
        return thisBlock.position.x >= thatBlock.position.x + (thisBlock.size.x + thatBlock.size.x)/2;
    },
    strictlyToTheLeft: function (thisBlock, thatBlock) {
        return thisBlock.position.x <= thatBlock.position.x - (thisBlock.size.x + thatBlock.size.x)/2;
    },
    // check bottom of player touches block
    onBlock: function (thisBlock, thatBlock){
        let posDif = {x: (thisBlock.position.x - thatBlock.position.x), y: (thisBlock.position.y - thatBlock.position.y)};
        let avgSize = {x: (thisBlock.size.x + thatBlock.size.x)/2, y: (thisBlock.size.y + thatBlock.size.y)/2};
        return Math.abs(posDif.x) < avgSize.x && Math.abs(posDif.y - avgSize.y) < 0.000000001;
    }
};

const MapFun = {
    read: function (json) {
        const map = JSON.parse(json);
        for (let block of map.blocks) {
            BlockFun.finish(block);
        }
        return map;
    },
    write: function (map) {
        return JSON.stringify(map);
    },
    draw: function (map, camera) {
        for (let block of map.blocks) {
            BlockFun.draw(block, camera);
        }
    }
};

const mapData = `{
"worldData": {
    "spawnPoint": {"x": 0, "y": 0},
    "bounds": {"position": {"x": 0, "y": 0}, "size": {"x": 200, "y": 200}}
},
"graphics": {
    "name": "Test",
    "viewSize": 30,
    "viewCenter": {"x": 0, "y": 0},
    "color": "purple"
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
    }`;


function getDefaultMapData() {
    return MapFun.read(mapData);
}