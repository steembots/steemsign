// secureRandom(countBytes, options)
// When type is not set it should return Array of bytes
var data = secureRandom(10)
assert(data instanceof Array)
assert(data.length === 10)

// When type is set to Array it should return an Array of random bytes
var data = secureRandom(10, {type: 'Array'})
assert(data instanceof Array)
assert(data.length === 10)

// When type is set to Buffer it should return a Buffer of random bytes
var data = secureRandom(10, {type: 'Buffer'})
assert(Buffer.isBuffer(data))
assert(data.length === 10)

// When type is set to Uint8Array it should return a Uint8Array of random bytes
var data = secureRandom(10, {type: 'Uint8Array'})
assert(data instanceof Uint8Array)
assert(data.length === 10)

// When type is not supported it should throw an error
//var data = secureRandom(10, {type: 'superArray'}) // ######################### This should throw

// randomArray(byteCount) should return an Array
var data = secureRandom.randomArray(10)
assert(data instanceof Array)
assert(data.length === 10)

// randomUint8Array(byteCount) should return an Uint8Array
var data = secureRandom.randomUint8Array(10)
assert(data instanceof Uint8Array)
assert(data.length === 10)

// randomBuffer(byteCount) should return a Buffer
var data = secureRandom.randomBuffer(10)
assert(Buffer.isBuffer(data))
assert(data.length === 10)


alert('secure-random-tests.js\n\nAll automatic tests passed.\n\nCheck code for one manual test to confirm the code properly throws when type is not supported.')
