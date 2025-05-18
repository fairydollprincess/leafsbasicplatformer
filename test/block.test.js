QUnit.module('BlockFun', function() {
    QUnit.test('build', function(assert) {
        assert.deepEqual(BlockFun.build(), {position: {x: 0, y: 0}, size: {x: 1, y: 1}, graphics: {color: "green"}});
        assert.deepEqual(BlockFun.build(-1,2,4,8), {position: {x: -1, y: 2}, size: {x: 4, y: 8}, graphics: {color: "green"}});
    });
    QUnit.module('intersect', function() {
        QUnit.test('identical', function (assert) {
            assert.true(BlockFun.intersects(BlockFun.build(), BlockFun.build()));
            assert.true(BlockFun.intersects(BlockFun.build(1), BlockFun.build(1)));
            assert.true(BlockFun.intersects(BlockFun.build(1, 3, 0.1, 2), BlockFun.build(1, 3, 0.1, 2)));
            assert.true(BlockFun.intersects(BlockFun.build(-1, -10, 0.01, 0.1), BlockFun.build(-1, -10, 0.01, 0.1)));
        });
        QUnit.test('touching', function (assert) {
            //All touching near the origin, same size
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(-1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(0,1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(0,-1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(1,1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(1,-1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(-1,1)));
            assert.false(BlockFun.intersects(BlockFun.build(), BlockFun.build(-1,-1)));

            //Try away from the origin
            assert.false(BlockFun.intersects(BlockFun.build(1,1), BlockFun.build(1)));
            assert.false(BlockFun.intersects(BlockFun.build(-2), BlockFun.build(-1)));
            assert.false(BlockFun.intersects(BlockFun.build(1,1), BlockFun.build(0,1)));
            assert.false(BlockFun.intersects(BlockFun.build(0,-2), BlockFun.build(0,-1)));
            assert.false(BlockFun.intersects(BlockFun.build(2,2), BlockFun.build(1,1)));
            assert.false(BlockFun.intersects(BlockFun.build(1,0), BlockFun.build(1,-1)));
            assert.false(BlockFun.intersects(BlockFun.build(0,1), BlockFun.build(-1,1)));
            assert.false(BlockFun.intersects(BlockFun.build(-2,-1), BlockFun.build(-1,-1)));

            //Try differentSizes
            assert.false(BlockFun.intersects(BlockFun.build(0,0, 2, 2), BlockFun.build(1.5, 2, 1, 3)));
            assert.false(BlockFun.intersects(BlockFun.build(10,100, 0.25, 0.125), BlockFun.build(9.5, 0, 0.75, 200)));
        });

        QUnit.test('subsets', function (assert) {
            assert.true(BlockFun.intersects(BlockFun.build(), BlockFun.build(0,0, 0.1, 0.1)));
            assert.true(BlockFun.intersects(BlockFun.build(0,0, 0.1, 0.1), BlockFun.build()));

            assert.true(BlockFun.intersects(BlockFun.build(5, 5, 4, 4), BlockFun.build(4,6, 1.25, 1.5)));
            assert.true(BlockFun.intersects(BlockFun.build(-10, 8, 2, 3), BlockFun.build(-9,9, 6, 7)));

            assert.true(BlockFun.intersects(BlockFun.build(0.1,-0.1,0.2,0.3), BlockFun.build(0.11,-0.09,0.15,0.1)));
            assert.true(BlockFun.intersects(BlockFun.build(-0.1,-0.1,0.02,0.03), BlockFun.build(-0.10001,-0.09999,0.03,0.04)));
        });

        QUnit.test('cornersContained', function (assert) {
            assert.true(BlockFun.intersects(BlockFun.build(), BlockFun.build(0.5)));
            assert.true(BlockFun.intersects(BlockFun.build(), BlockFun.build(0.5,0.5)));
            assert.true(BlockFun.intersects(BlockFun.build(0, 1), BlockFun.build(0.5,0.5)));
            assert.true(BlockFun.intersects(BlockFun.build(1, 1), BlockFun.build(0.5,0.5)));
            assert.true(BlockFun.intersects(BlockFun.build(1, 0), BlockFun.build(0.5,0.5)));
            assert.true(BlockFun.intersects(BlockFun.build(), BlockFun.build(0,-0.5)));

            assert.true(BlockFun.intersects(BlockFun.build(100, 2, 0.1, 2), BlockFun.build(100,1, 0.2, 0.1)));
        });

        QUnit.test('edgesIntersect', function (assert) {
            assert.true(BlockFun.intersects(BlockFun.build(0,0,0.1,100), BlockFun.build(0,0,100, 0.1)));
            assert.true(BlockFun.intersects(BlockFun.build(-3,0,10,1), BlockFun.build(0,3,1, 8)));
        });
    });
    QUnit.test('strictlyAbove', function(assert) {
        assert.false(BlockFun.strictlyAbove(BlockFun.build(), BlockFun.build()));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(), BlockFun.build(0, 2)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(), BlockFun.build(0, 1)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(), BlockFun.build(0, -0.5)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(), BlockFun.build(0, -1)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(), BlockFun.build(0, -2)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(0, 2), BlockFun.build(0, 0)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(0, 2), BlockFun.build(0, 1)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(0, 2), BlockFun.build(0, -2)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(0, 2), BlockFun.build(0, 1.5)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(0, -2), BlockFun.build(0, 100)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(0, -4), BlockFun.build(0, -3)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(0, -4), BlockFun.build(0, -5)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(2), BlockFun.build()));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(3), BlockFun.build(1, 2)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(-3), BlockFun.build(11, 1)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(6), BlockFun.build(5, -0.5)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(-9), BlockFun.build(-9, -1)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(10), BlockFun.build(20, -2)));


        assert.false(BlockFun.strictlyAbove(BlockFun.build(0,0, 1, 100), BlockFun.build(0, -30)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(0,0, 1, 100), BlockFun.build(0, -50)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(0,0, 1, 100), BlockFun.build(0, -50.5)));

        assert.true(BlockFun.strictlyAbove(BlockFun.build(10,50, 1, 100), BlockFun.build(-40, -1)));
        assert.true(BlockFun.strictlyAbove(BlockFun.build(10,50, 1, 100), BlockFun.build(-40, -0.25, 1, 0.5)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(10,50, 1, 100), BlockFun.build(0, -0.4)));

        assert.true(BlockFun.strictlyAbove(BlockFun.build(10,0.02, 1, 0.01), BlockFun.build(10, 0.011, 1,0.005)));
        assert.false(BlockFun.strictlyAbove(BlockFun.build(-1,0.02, 1, 0.01), BlockFun.build(-2, 0.015, 1, 0.001)));
    });
    QUnit.test('strictlyBelow', function(assert) {
        assert.false(BlockFun.strictlyBelow(BlockFun.build(), BlockFun.build()));
        assert.false(BlockFun.strictlyBelow(BlockFun.build(), BlockFun.build(0,-1)));
        assert.true(BlockFun.strictlyBelow(BlockFun.build(), BlockFun.build(0,1)));
        assert.false(BlockFun.strictlyBelow(BlockFun.build(0,0, 1.0, 2), BlockFun.build(0,1)));
        assert.true(BlockFun.strictlyBelow(BlockFun.build(0,0, 1.0, 2), BlockFun.build(0,4)));
    });
    QUnit.test('strictlyToTheRight', function(assert) {
        assert.false(BlockFun.strictlyToTheRight(BlockFun.build(), BlockFun.build()));
        assert.true(BlockFun.strictlyToTheRight(BlockFun.build(), BlockFun.build(-1)));
        assert.false(BlockFun.strictlyToTheRight(BlockFun.build(), BlockFun.build(-0.5)));
        assert.false(BlockFun.strictlyToTheRight(BlockFun.build(-10,0,5), BlockFun.build(-11)));
        assert.true(BlockFun.strictlyToTheRight(BlockFun.build(-10,0,5), BlockFun.build(-15, 0, 5)));
        assert.true(BlockFun.strictlyToTheRight(BlockFun.build(10,0,0.1), BlockFun.build(-5, 0, 20)));
    });
    QUnit.test('strictlyToTheLeft', function(assert) {
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(), BlockFun.build()));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(), BlockFun.build(-1)));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(), BlockFun.build(-0.5)));
        assert.true(BlockFun.strictlyToTheLeft(BlockFun.build(), BlockFun.build(1)));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(), BlockFun.build(0.9)));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(-10,0,5), BlockFun.build(-11)));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(-10,0,5), BlockFun.build(-15, 0, 5)));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(10,0,0.1), BlockFun.build(-5, 0, 20)));


        assert.true(BlockFun.strictlyToTheLeft(BlockFun.build(3, 100, 4), BlockFun.build(7)));
        assert.true(BlockFun.strictlyToTheLeft(BlockFun.build(3, 100, 0.1), BlockFun.build(4)));
        assert.false(BlockFun.strictlyToTheLeft(BlockFun.build(3, 100, 0.1), BlockFun.build(3.1, 0, 0.2)));
        assert.true(BlockFun.strictlyToTheLeft(BlockFun.build(3, 100, 0.1), BlockFun.build(3.1, 0, 0.1)));
    });
});

QUnit.module('MapFun', function() {
    QUnit.test('read', function(assert) {
        const mapData = `[
            {
                "position": {"x": 0, "y": -1},
                "size": {"x": 8, "y": 2}
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
            }
            ]`;
        const expectedOutput = [
            {
                position: {x: 0, y: -1},
                size: {x: 8, y: 2},
                graphics: {color: "green"}
            },
            {
                position: {x: 3, y: 2},
                size: {x: 1, y: 1},
                graphics: {color: "green"}
            },
            {
                position: {x: 0, y: 3},
                size: {x: 1, y: 2},
                graphics: {color: "green"}
            },
            {
                position: {x: -3, y: 0.5},
                size: {x: 1, y: 1},
                graphics: {color: "brown"}
            }]
        assert.deepEqual(MapFun.read(mapData), expectedOutput);
    });
});
