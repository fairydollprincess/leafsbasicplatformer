function assertKinematicsClose(assert, stateA, stateB, precision=0.000000001) {
    assert.closeTo(stateA.position.x, stateB.position.x, precision, "Assert states x positions are close");
    assert.closeTo(stateA.position.y, stateB.position.y, precision, "Assert states y positions are close");
    assert.closeTo(stateA.velocity.x, stateB.velocity.x, precision, "Assert states x velocities are close");
    assert.closeTo(stateA.velocity.y, stateB.velocity.y, precision, "Assert states x velocities are close");
}

QUnit.module('stateAfterKinematics', function() {
    QUnit.test('integratesCorrectly', function(assert) {
        let initialState = {position:{x:0,y:0}, velocity:{x:1,y:10}};
        let force = {x:-0.01, y: -10};
        let drag = {x:0.01, y: 1};
        let expectedAfter1Second = stateAfterKinematics(initialState, force, 1, drag);
        let curState = initialState;
        for (let i = 0; i < 10; i++) {
            curState = stateAfterKinematics(curState, force, 0.1, drag);
        }
        assertKinematicsClose(assert, expectedAfter1Second, curState);
    });
});