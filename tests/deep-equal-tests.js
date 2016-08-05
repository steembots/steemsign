// test equal
assert(deepEqual({ a : [ 2, 3 ], b : [ 4 ] },{ a : [ 2, 3 ], b : [ 4 ] }));

// test not equal
assert(!deepEqual({ x : 5, y : [6] },{ x : 5, y : 6 }));

// test nested nulls
assert(deepEqual([ null, null, null ], [ null, null, null ]));

// test strict equal
assert(!(deepEqual([ { a: 3 }, { b: 4 } ],[ { a: '3' }, { b: '4' } ],{ strict: true })));

// test non-object
assert(deepEqual(3, 3));
assert(deepEqual('beep', 'beep'));
assert(deepEqual('3', 3));
assert(!deepEqual('3', 3, { strict: true }));
assert(!deepEqual('3', [3]));

// test arguments class
assert(deepEqual(
    (function(){return arguments})(1,2,3),
    (function(){return arguments})(1,2,3),
    "compares arguments"
));
assert(!deepEqual(
    (function(){return arguments})(1,2,3),
    [1,2,3],
    "differenciates array and arguments"
));

// test the arguments shim
assert(isArguments((function(){return arguments})()));
assert(!isArguments([1,2,3]));

assert(isArguments((function(){return arguments})()));
assert(!isArguments([1,2,3]));

// test the keys shim
assert(deepEqual(objectKeys({ a: 1, b : 12 }), [ 'a', 'b' ]));

// test dates
var d0 = new Date(1387585278000);
var d1 = new Date('Fri Dec 20 2013 16:21:18 GMT-0800 (PST)');
assert(deepEqual(d0, d1));

// test buzzers
assert(deepEqual(Buffer('xyz'), Buffer('xyz')));

// test booleans and arrays
assert(!deepEqual(true, []));

// test null == undefined
assert(deepEqual(null, undefined))
assert(!deepEqual(null, undefined, { strict: true }))


alert('deep-equal-tests.js:\n\nAutomatic tests completed.')
