const BlockFun = {
    build: function (x=0, y=0, w=1, h=1) {
        return BlockFun.finish({position: vec2.new(x,y), size: vec2.new(w,h)});
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
        camera.drawBlock(block, block.graphics.color);
    },
    /**
     * Returns whether blockA intersects blockB, i.e. whether there is a point in both blocks.
     * This excludes edges, so two blocks that share an edge DO NOT intersect.
     * @param blockA
     * @param blockB
     * @returns {boolean}
     */
    intersects: function(blockA, blockB) {
        let posDif = vec2.sub(blockA.position, blockB.position);
        let avgSize = vec2.scalarMul(vec2.add(blockA.size, blockB.size), 0.5);
        return vec2.xyLess(vec2.abs(posDif), avgSize);
    },
    contains: function(block, position) {
        let posDif = vec2.sub(block.position, position);
        return vec2.xyLess(vec2.abs(posDif), vec2.scalarMul(block.size, 0.5));
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
        let posDif = vec2.sub(thisBlock.position, thatBlock.position);
        let avgSize = vec2.scalarMul(vec2.add(thisBlock.size, thatBlock.size), 0.5);
        return Math.abs(posDif.x) < avgSize.x && Math.abs(posDif.y - avgSize.y) < 0.000000001;
    }
};

const MapFun = {
    read: function (json) {
        const map = JSON.parse(json);
        for (let block of map.blocks) {
            BlockFun.finish(block);
        }
        if (map.collectMode) {
            for (let heart of map.collectMode.hearts) {
                heart.size = {x: 0.5, y: 0.5};
            }
        } else {
            map.collectMode = {
                hearts: []
            }
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
"spawnData": {
    "spawnPoint": {"x": 0, "y": 0},
    "bounds": {"position": {"x": 0, "y": 0}, "size": {"x": 60, "y": 30}}
},
"graphics": {
    "name": "Test",
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
    }`;


function getDefaultMapData() {
    return MapFun.read(mapData);
}