const vec2 = {
    new: function (x, y) {
        return {x, y};
    },
    add: function (a, b) {
        return {x: a.x + b.x, y: a.y + b.y};
    },
    mul: function (a, b) {
        return {x: a.x * b.x, y: a.y * b.y};
    },
    sub: function (a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    },
    div: function (a, b) {
        return {x: a.x / b.x, y: a.y / b.y};
    },
    scalarMul: function (vec, scalar) {
        return {x: vec.x * scalar, y: vec.y * scalar};
    },
    scalarAdd: function (vec, scalar) {
        return {x: vec.x + scalar, y: vec.y + scalar};
    },
    dot: function (a, b) {
        return a.x * b.x + a.y * b.y;
    },
    mag: function (vec) {
        return Math.sqrt(vec2.dot(vec, vec));
    },
    project: function (vec, direction) {
        if (direction.x === 0 && direction.y === 0) {
            return direction;
        }
        return vec2.scalarMul(direction, vec2.dot(vec, direction) / vec2.dot(direction, direction));
    },
    abs: function (vec) {
        return {x: Math.abs(vec.x), y: Math.abs(vec.y)};
    },
    dist: function (a, b) {
        return vec2.mag(vec2.sub(a, b));
    },
    xyLess: function (a, b) {
        return a.x < b.x && a.y < b.y;
    },
    zero: function () {return {x: 0, y: 0};},
    exp: function (vec) {
        return vec2.new(Math.exp(vec.x), Math.exp(vec.y));
    }
}