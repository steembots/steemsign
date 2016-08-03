/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base 64 encoding and decoding in JavaScript                                                   */  
/*    - Based on https://github.com/beatgammit/base64-js.git                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

var base64 = {};

base64.lookup = [];
base64.revLookup = [];
base64.Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

base64.init = function() {
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (var i = 0, len = code.length; i < len; ++i) {
	base64.lookup[i] = code[i]
	base64.revLookup[code.charCodeAt(i)] = i
    }

    base64.revLookup['-'.charCodeAt(0)] = 62
    base64.revLookup['_'.charCodeAt(0)] = 63
}

base64.init()

base64.toByteArray = function(b64) {
    var i, j, l, tmp, placeHolders, arr
    var len = b64.length

    if (len % 4 > 0) {
	throw new Error('Invalid string. Length must be a multiple of 4')
    }

    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

    // base64 is 4/3 + up to two characters of the original data
    arr = new base64.Arr(len * 3 / 4 - placeHolders)

    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? len - 4 : len

    var L = 0

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
	tmp = (base64.revLookup[b64.charCodeAt(i)] << 18) | (base64.revLookup[b64.charCodeAt(i + 1)] << 12) | (base64.revLookup[b64.charCodeAt(i + 2)] << 6) | base64.revLookup[b64.charCodeAt(i + 3)]
	arr[L++] = (tmp >> 16) & 0xFF
	arr[L++] = (tmp >> 8) & 0xFF
	arr[L++] = tmp & 0xFF
    }

    if (placeHolders === 2) {
	tmp = (base64.revLookup[b64.charCodeAt(i)] << 2) | (base64.revLookup[b64.charCodeAt(i + 1)] >> 4)
	arr[L++] = tmp & 0xFF
    } else if (placeHolders === 1) {
	tmp = (base64.revLookup[b64.charCodeAt(i)] << 10) | (base64.revLookup[b64.charCodeAt(i + 1)] << 4) | (base64.revLookup[b64.charCodeAt(i + 2)] >> 2)
	arr[L++] = (tmp >> 8) & 0xFF
	arr[L++] = tmp & 0xFF
    }

    return arr
}

base64.tripletToBase64 = function(num) {
    return base64.lookup[num >> 18 & 0x3F] + base64.lookup[num >> 12 & 0x3F] + base64.lookup[num >> 6 & 0x3F] + base64.lookup[num & 0x3F]
}

base64.encodeChunk = function(uint8, start, end) {
    var tmp
    var output = []
    for (var i = start; i < end; i += 3) {
	tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	output.push(base64.tripletToBase64(tmp))
    }
    return output.join('')
}

base64.fromByteArray = function (uint8) {
    var tmp
    var len = uint8.length
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    var output = ''
    var parts = []
    var maxChunkLength = 16383 // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	parts.push(base64.encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
	tmp = uint8[len - 1]
	output += base64.lookup[tmp >> 2]
	output += base64.lookup[(tmp << 4) & 0x3F]
	output += '=='
    } else if (extraBytes === 2) {
	tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	output += base64.lookup[tmp >> 10]
	output += base64.lookup[(tmp >> 4) & 0x3F]
	output += base64.lookup[(tmp << 2) & 0x3F]
	output += '='
    }

    parts.push(output)

    return parts.join('')
}
