const vec2 = {
    new: function (x, y) {
        return {x, y};
    },
    copy: function (vec) {
        return vec2.new(vec.x, vec.y);
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
    scalarDiv: function (vec, scalar) {
        return {x: vec.x / scalar, y: vec.y / scalar};
    },
    scalarAdd: function (vec, scalar) {
        return {x: vec.x + scalar, y: vec.y + scalar};
    },
    scalarSub: function (vec, scalar) {
        return {x: vec.x - scalar, y: vec.y - scalar};
    },
    dot: function (a, b) {
        return a.x * b.x + a.y * b.y;
    },
    magSqr: function (vec) {
        return vec2.dot(vec, vec);
    },
    mag: function (vec) {
        return Math.sqrt(vec2.magSqr(vec));
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
    },
    clamp: function (vec, magnitude = 1) {
        let magSqr = magnitude * magnitude;
        let vecMagSqr = vec2.magSqr(vec);
        if (vecMagSqr <= magSqr) {
            return vec;
        }
        return vec2.scalarMul(vec, magnitude / Math.sqrt(vecMagSqr));
    },
    unit: function (vec) {
        if (vec2.x === 0 && vec2.y === 0) {
            return vec2.zero();
        }
        return vec2.scalarMul(vec, vec2.mag(vec));
    },
    clampUnit: function (vec) {
        let vecMagSqr = vec2.magSqr(vec);
        if (vecMagSqr <= 1) {
            return vec;
        }
        return vec2.scalarMul(vec, 1 / Math.sqrt(vecMagSqr));
    },
    clampLInf: function (vec, min = -1, max = 1) {
        if (vec.x >= -1 && vec2.x <= 1 && vec2.y >= -1 && vec2.y <= 1) {
            return vec;
        }
        return vec2.new(xMath.clamp(vec.x, min, max), xMath.clamp(vec.y, min, max));
    },
    magLEQ: function (vec, mag) {
        return vec2.magSqr(vec) <= mag*mag;
    },
    lInfNorm: function (vec) {
        return Math.max(Math.abs(vec.x), Math.abs(vec.y));
    },
    l2ToLInf: function (vec) {
        let lInfLength = vec2.lInfNorm(vec);
        if (lInfLength <= 0.0000001) {
            //If the norm is small enough we may have to worry about numerical precision, just return
            return vec;
        }
        let l2Length = vec2.mag(vec);
        let scale = l2Length/lInfLength;
        return vec2.scalarMul(vec, scale);
    },
    lInfTo2: function (vec) {
        let lInfLength = vec2.lInfNorm(vec);
        if (lInfLength <= 0.0000001) {
            //If the norm is small enough we may have to worry about numerical precision, just return
            return vec;
        }
        let l2Length = vec2.mag(vec);
        let scale = lInfLength / l2Length;
        return vec2.scalarMul(vec, scale);
    }
}

const xMath = {
    clamp: function(val, min = -1, max = 1) {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    }
}