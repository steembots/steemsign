function assert(condition, message) {
    if (!condition) {
	message = message || "Assertion failed";
	if (typeof Error !== "undefined") {
	    throw new Error(message);
	}
	throw message; // Fallback
    }
}

assert.equal = function(x1, x2, message) {
    if (x1 != x2) {
	message = message || "Assertion failed";
	if (typeof Error !== "undefined") {
	    throw new Error(message);
	}
	throw message; // Fallback
    }
}

assert.strictEqual = function(x1, x2, message) {
    if (x1 !== x2) {
	message = message || "Assertion failed";
	if (typeof Error !== "undefined") {
	    throw new Error(message);
	}
	throw message; // Fallback
    }
}
