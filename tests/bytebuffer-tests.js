var type = ByteBuffer.type(), // Buffer or ArrayBuffer
    accessor = ByteBuffer.accessor(),
    Long = ByteBuffer.Long;

assert(type === Buffer || type === ArrayBuffer);
assert(typeof ByteBuffer == "function");




// allocate test
var bb = new ByteBuffer();
assert(bb.buffer instanceof type);
assert(bb.offset === 0);
assert(bb.limit === ByteBuffer.DEFAULT_CAPACITY);
assert(bb.littleEndian === ByteBuffer.DEFAULT_ENDIAN);
assert(bb.noAssert === ByteBuffer.DEFAULT_NOASSERT);
if (type === Buffer)
    assert(bb.buffer.length === bb.capacity());
else
    assert(bb.buffer.byteLength === bb.capacity());
assert(bb.capacity() === ByteBuffer.DEFAULT_CAPACITY);
bb = ByteBuffer.allocate(undefined, !ByteBuffer.DEFAULT_ENDIAN, !ByteBuffer.DEFAULT_NOASSERT);
assert(bb.capacity() === ByteBuffer.DEFAULT_CAPACITY);
assert(bb.littleEndian === !ByteBuffer.DEFAULT_ENDIAN);
assert(bb.noAssert === !ByteBuffer.DEFAULT_NOASSERT);

// __isByteBuffer__
assert(bb.__isByteBuffer__ === true);
bb.__isByteBuffer__ = false;
assert(bb.__isByteBuffer__ === true);
assert(ByteBuffer.isByteBuffer(bb) === true);

// Fixed set of properties
for (var i in bb)
    if (bb.hasOwnProperty(i) && ["offset", "markedOffset", "limit", "littleEndian", "noAssert", "buffer", "view"].indexOf(i) < 0)
	console.log("FAIL: Illegal enumerable property: "+i);





// clone test
var bb = new ByteBuffer(1, true, false);
var bb2 = bb.clone();
assert(bb.buffer === bb2.buffer);
assert(bb.offset === bb2.offset);
assert(bb.limit === bb2.limit);
assert(bb.markedOffset === bb2.markedOffset);
assert(bb.littleEndian === bb2.littleEndian);
assert(bb.noAssert === bb2.noAssert);
assert(bb !== bb2);





// assert test
var bb = new ByteBuffer();
assert(bb.noAssert === false);
assert(bb.assert(false) === bb);
assert(bb.noAssert === true);
assert(bb.assert(true) === bb);
assert(bb.noAssert === false);





// wrap Buffer
if (type === Buffer) {
    var buf = new Buffer(1);
    buf[0] = 0x01;
    var bb = ByteBuffer.wrap(buf);
    assert(bb.capacity() === 1);
    assert(bb.buffer === buf);
    assert(bb.toDebug() === "<01>");
}




// wrap ArrayBuffer
var buf = new ArrayBuffer(1);
var bb = ByteBuffer.wrap(buf);
assert(bb.capacity() === 1);
if (type === ArrayBuffer)
    assert(bb.buffer === buf);
else
    assert(bb.buffer instanceof Buffer);
assert(bb.offset === 0);
assert(bb.limit === 1);




// wrap Uint8Array
var buf = new Uint8Array(1);
buf[0] = 0x01;
var bb = ByteBuffer.wrap(buf);
assert(bb.capacity() === 1);
if (type === ArrayBuffer)
    assert(bb.buffer === buf.buffer);
else
    assert(bb.buffer instanceof Buffer);
assert(bb.toDebug() === "<01>");

// Partial view (not on node, node copies)
if (type === ArrayBuffer) {
    buf = new Uint8Array(3);
    buf[0] = 0x01; buf[1] = 0x02; buf[2] = 0x03;
    buf = new Uint8Array(buf.buffer, 1, 1);
    bb = ByteBuffer.wrap(buf);
    assert(bb.capacity() === 3);
    assert(bb.toDebug() === "01<02>03");
}




// wrap Array
var arr = [1,255,-1];
var bb = ByteBuffer.wrap(arr);
assert(bb.capacity() === 3);
assert(bb.toDebug() === "<01 FF FF>");





// wrap ByteBuffer
var bb2 = ByteBuffer.wrap("\x12\x34\x56\x78", "binary");
bb2.offset = 1;
var bb = ByteBuffer.wrap(bb2);
assert(bb2.offset === bb.offset);
assert(bb2.limit === bb.limit);
assert(bb2.capacity() === bb.capacity());
assert(bb2.toString("debug") === bb.toString("debug"));




// wrap string
var bb = ByteBuffer.wrap("\u0061\u0062");
assert(bb.toDebug() === "<61 62>");




// encoding UTF8
["aäöüß€b", ""].forEach(function(str) {
    var bb = ByteBuffer.wrap(str, "utf8"); // Calls ByteBuffer#fromUTF8
    assert(bb.toUTF8() === str);
    if (str.length > 2) {
	bb.offset = 1;
	bb.limit = bb.capacity()-1;
	assert(bb.toUTF8() === str.substring(1, str.length-1));
    }
});




// encoding debug
["60<61 62]63", "<60 61 62 63]", "|", "|61", "<61>", "!12"].forEach(function(str) {
    var bb = ByteBuffer.wrap(str, "debug"); // Calls ByteBuffer#fromDebug
    assert(bb.toDebug() === str);
});




// encodings binary
["\x61\x62\x63\x64", "", "  "].forEach(function(str) {
    var bb = ByteBuffer.wrap(str, "binary"); // Calls ByteBuffer#fromBinary
    assert(bb.toBinary() === str);
    if (str.length > 2) {
	bb.offset = 1;
	bb.limit = bb.capacity()-1;
	assert(bb.toBinary() === str.substring(1, str.length-1));
    }
});




// encodings hex
["61626364", "61", ""].forEach(function(str) {
    var bb = ByteBuffer.wrap(str, "hex"); // Calls ByteBuffer#fromHex
    assert(bb.toHex() === str);
    if (str.length > 2) {
	bb.offset = 1;
	bb.limit = bb.capacity()-1;
	assert(bb.toHex() === str.substring(2, str.length-2));
    }
});




// encodings base64
["", "YWI=", "YWJjZGVmZw==", "YWJjZGVmZ2g=", "YWJjZGVmZ2hp"].forEach(function(str) {
    var bb = ByteBuffer.wrap(str, "base64"); // Calls ByteBuffer#fromBase64
    assert(bb.toBase64() === str);
    if (str.length > 8) {
	bb.offset = 3;
	bb.limit = bb.offset + 3;
	assert(bb.toBase64() === str.substr(4, 4));
    }
});




// methods concat
var bbs = [
    new ArrayBuffer(1),
    ByteBuffer.fromDebug('00<01 02>'),
    ByteBuffer.fromDebug('00 01 02<03>00'),
    ByteBuffer.fromDebug('00|'),
    ByteBuffer.fromDebug('<04>'),
    type === Buffer ? new Buffer(0) : new ArrayBuffer(0),
    new Uint8Array(0),
    '05'
];
var bb = ByteBuffer.concat(bbs, 'hex', !ByteBuffer.DEFAULT_ENDIAN, !ByteBuffer.DEFAULT_NOASSERT);
assert(bb.littleEndian === !ByteBuffer.DEFAULT_ENDIAN);
assert(bb.noAssert === !ByteBuffer.DEFAULT_NOASSERT);
assert(bb.toDebug() === '<00 01 02 03 04 05>');
bb = ByteBuffer.concat([]);
assert(bb.buffer === new ByteBuffer(0).buffer); // EMPTY_BUFFER




// methods resize
var bb = new ByteBuffer(1);
bb.offset = 1;
bb.resize(2);
bb.fill(0, 0, 2);
assert(bb.capacity() === 2);
assert(bb.toDebug() === "00|00");




// methods ensureCapacity
var bb = new ByteBuffer(5);
assert(bb.capacity() === 5);
bb.ensureCapacity(6); // Doubles
assert(bb.capacity() === 10);
bb.ensureCapacity(21); // Uses 21
assert(bb.capacity() === 21);




// methods slice
var bb = new ByteBuffer.wrap("\x12\x34\x56"),
    bb2 = bb.slice(1,2);
assert(bb.buffer === bb2.buffer);
assert(bb.offset === 0);
assert(bb.limit === 3);
assert(bb2.offset === 1);
assert(bb2.limit === 2);




// methods flip
var bb = ByteBuffer.wrap('\x12\x34\x56\x78');
bb.offset = 4;
assert(bb.offset === 4);
assert(bb.limit === 4);
bb.flip();
assert(bb.offset === 0);
assert(bb.limit === 4);




// methods mark
var bb = ByteBuffer.wrap('\x12\x34\x56\x78');
assert(bb.offset === 0);
assert(bb.limit === 4);
assert(bb.markedOffset === -1);
bb.mark();
assert(bb.markedOffset === 0);




// methods reset
var bb = ByteBuffer.wrap('\x12\x34\x56\x78');
bb.reset();
assert(bb.offset === 0);
assert(bb.limit === 4);
bb.offset = 1;
bb.mark();
assert(bb.markedOffset === 1);
bb.reset();
assert(bb.offset === 1);
assert(bb.markedOffset === -1);




// methods copy
var bb = ByteBuffer.wrap("\x01", !ByteBuffer.DEFAULT_ENDIAN),
    bb2 = bb.copy();
assert(bb.offset === 0);
assert(bb !== bb2);
assert(bb.buffer !== bb2.buffer);
assert(bb2.offset === bb.offset);
assert(bb2.limit === bb.limit);
assert(bb2.markedOffset === bb.markedOffset);
assert(bb2.littleEndian === bb.littleEndian);
assert(bb2.noAssert === bb.noAssert);




// methods copyTo
var bb = ByteBuffer.wrap("\x01"),
    bb2 = new ByteBuffer(2).fill(0).flip();
assert(bb.toDebug() === "<01>");
// Modifies source and target offsets
bb.copyTo(bb2 /* all offsets omitted */);
assert(bb.toDebug() === "01|"); // Read 1 byte
assert(bb2.toDebug() === "01<00>"); // Written 1 byte
bb.reset();
assert(bb.toDebug() === "<01>");
// Again, but with bb2.offset=1
bb.copyTo(bb2 /* all offsets omitted */);
assert(bb.toDebug() === "01|"); // Read 1 byte
assert(bb2.toDebug() === "01 01|"); // Written 1 byte at 2
bb.reset();
bb2.clear().fill(0).flip();
// Modifies source offsets only
bb.copyTo(bb2, 0 /* source offsets omitted */);
assert(bb.toDebug() === "01|"); // Read 1 byte
assert(bb2.toDebug() === "<01 00>"); // Written 1 byte (no change)
// Modifies no offsets at all
bb.reset();
bb2.fill(0).flip();
bb.copyTo(bb2, 1, 0, bb.capacity() /* no offsets omitted */);
assert(bb.toDebug() === "<01>"); // Read 1 byte (no change)
assert(bb2.toDebug() === "<00 01>"); // Written 1 byte (no change)



// methods compact
var bb = ByteBuffer.wrap("\x01\x02");
bb.limit = 1;
bb.markedOffset = 2;
var prevBuffer = bb.buffer,
    prevView = bb.view;
bb.compact();
assert(bb.buffer !== prevBuffer);
if (type === ArrayBuffer) {
    assert(bb.buffer !== prevView);
}
assert(bb.capacity() === 1);
assert(bb.offset === 0);
assert(bb.limit === 1);
assert(bb.markedOffset === 2); // Actually out of bounds
// Empty region
bb.offset = 1;
prevBuffer = bb.buffer;
bb.compact();
assert(bb.buffer !== prevBuffer);
assert(bb.buffer === new ByteBuffer(0).buffer); // EMPTY_BUFFER
if (type === ArrayBuffer) {
    assert(bb.view === null);
}
assert(bb.capacity() === 0);
assert(bb.offset === 0);
assert(bb.limit === 0);




// methods reverse
var bb = ByteBuffer.wrap("\x12\x34\x56\x78");
bb.reverse(1, 3);
assert(bb.toString("debug") === "<12 56 34 78>");
bb.reverse();
assert(bb.toString("debug") === "<78 34 56 12>");
bb.offset = 1;
bb.limit = 3;
bb.reverse();
assert(bb.toString("debug") === "78<56 34>12");
bb.reverse(0, 4).clear();
assert(bb.toString("debug") === "<12 34 56 78>");




// methods append
var bb = ByteBuffer.wrap("\x12\x34");
var bb2 = ByteBuffer.wrap("\x56\x78");
bb.offset = 2;
bb.append(bb2); // Modifies offsets of both
assert(bb.toString("debug") === "12 34>56 78<");
assert(bb2.toString("debug") === "56 78|");
bb2.reset();
bb.append(bb2, 1); // Modifies offsets of bb2 only
assert(bb.toString("debug") === "12 56>78 78<");
assert(bb2.toString("debug") === "56 78|");




// methods prepend
var bb = ByteBuffer.wrap("\x12\x34"),
    bb2 = ByteBuffer.wrap("\x56\x78");
assert(bb.prepend(bb2) === bb); // Relative prepend at 0, 2 bytes (2 overflow)
assert(bb.toDebug() === "<56 78 12 34>");
assert(bb2.toDebug() === "56 78|");
bb.offset = 4;
bb2.offset = 1;
bb.prepend(bb2, 3); // Absolute prepend at 3, 1 byte
assert(bb.toDebug() === "56 78 78 34|");
assert(bb2.toDebug() === "56 78|");
bb2.offset = 0;
bb.prepend(bb2); // Relative prepend at 4, 2 bytes
assert(bb.toDebug() === "56 78<56 78>");
assert(bb2.toDebug() === "56 78|");
bb.offset = 3;
bb2.offset = 0;
//bb.prepend(bb2, 6); // Absolute out of bounds ########################################### This should throw
bb.prepend("abcde", "utf8"); // Relative prepend at 3, 5 bytes (1 overflow)
assert(bb.toDebug() === "<61 62 63 64 65 78>");




// methods prependTo
var bb = ByteBuffer.wrap("\x12\x34"),
    bb2 = ByteBuffer.wrap("\x56\x78");
assert(bb2.prependTo(bb) === bb2);
assert(bb.toDebug() === "<56 78 12 34>");
assert(bb2.toDebug() === "56 78|");




// methods remaining
var bb = ByteBuffer.wrap("\x12\x34");
assert(bb.remaining() === 2);
bb.offset = 2;
assert(bb.remaining() === 0);
bb.offset = 3;
assert(bb.remaining() === -1);




// methods skip
var bb = ByteBuffer.wrap("\x12\x34\x56");
assert(bb.offset === 0);
bb.skip(3);
assert(bb.offset === 3);
assert(bb.noAssert === false);
//bb.skip(1); // ############################################################################# This should throw
assert(bb.offset === 3);
bb.noAssert = true;
bb.skip(1); // ######################################################################### This should NOT throw
assert(bb.offset === 4);




// methods order
assert(ByteBuffer.LITTLE_ENDIAN === true);
assert(ByteBuffer.BIG_ENDIAN === false);
var bb = new ByteBuffer(2);
assert(bb.littleEndian === false);
bb.writeInt32(0x12345678);
bb.flip();
assert(bb.toHex() === "12345678");
bb.clear();
assert(bb.LE() === bb);
assert(bb.littleEndian === true);
bb.writeInt32(0x12345678);
bb.flip();
assert(bb.toHex() === "78563412");
assert(bb.BE() === bb);
assert(bb.littleEndian === false);
assert(bb.order(ByteBuffer.LITTLE_ENDIAN) === bb);
assert(bb.littleEndian === true);
assert(bb.order(ByteBuffer.BIG_ENDIAN) === bb);
assert(bb.littleEndian === false);





var types=[["Int8","Byte",1,0xFE,-2,"fe"],["Uint8",null,1,-2,0xFE,"fe"],["Int16","Short",2,0xFFFE,-2,"fffe"],["Uint16",null,2,-2,0xFFFE,"fffe"],["Int32","Int",4,0xFFFFFFFE,-2,"fffffffe"],["Uint32",null,4,-2,0xFFFFFFFE,"fffffffe"],["Float32","Float",4,0.5,0.5,"3f000000"],["Float64","Double",8,0.1,0.1,"3fb999999999999a"],["Int64","Long",8,new Long(0xFFFFFFFE,0xFFFFFFFF,true),new Long(0xFFFFFFFE,0xFFFFFFFF,false),"fffffffffffffffe"],["Uint64",null,8,new Long(0xFFFFFFFE,0xFFFFFFFF,false),new Long(0xFFFFFFFE,0xFFFFFFFF,true),"fffffffffffffffe"], ["Varint32",null,5,0xFFFFFFFE,-2,"feffffff0f"],["Varint32ZigZag",null,1,-1,-1,"01"],["Varint64",null,10,new Long(0xFFFFFFFE,0xFFFFFFFF,true),new Long(0xFFFFFFFE,0xFFFFFFFF,false),"feffffffffffffffff01"],["Varint64ZigZag",null,1,Long.fromNumber(-1),Long.fromNumber(-1),"01"]];


types.forEach(function(type) {
    var name = type[0],
	varint = name.indexOf("Varint") >= 0,
	alias = type[1],
	size = type[2],
	input = type[3],
	output = type[4],
	be = type[5],
	le = "";
    for (var i=be.length; i>0; i-=2) {
	le += be.substr(i-2, 2);
    }
    // name.toLowerCase()
    var bb = new ByteBuffer(size);
    // Relative BE (always LE for varints)
    assert(bb["write"+name](input) === bb);
    bb.flip();
    var val = bb["read"+name]();
    if (output instanceof Long) {
	assert(deepEqual(val, output));
    } else {
	assert(val === output);
    }
    bb.flip();
    assert(bb.toHex() === be);
    if (!varint) {
	// Relative LE
	bb.LE();
	bb["write"+name](input);
	bb.flip();
	val = bb["read"+name]();
	if (output instanceof Long) {
	    assert(deepEqual(val, output));
	} else {
	    assert(val === output);
	}
	bb.flip();
	assert(bb.toHex() === le);
    }
    bb.offset = bb.capacity() - size + 1;
    //bb["read"+name](input);                // ######################## This line should throw
    bb["write"+name](input);                 // This line should NOT throw

    assert(bb.capacity() === size * 2);
    // Absolute
    bb.clear();
    if (!varint)
	assert(bb["write"+name](input, 1) === bb);
    else
	assert(bb["write"+name](input, 1) === size);
    val = bb["read"+name](1);
    if (output instanceof Long) {
	if (!varint) {
	    assert(deepEqual(val, output))
	}
	else {
	    assert(deepEqual(val, {value: output, length: size}))
	}
    } else {
	if (!varint)
	    assert(val === output);
	else {
	    assert(deepEqual(val, {value: output, length: size}))
	}
    }
    // Alias
    if (alias) {
	assert(bb["write"+name] === bb["write"+alias]);
	assert(bb["read"+name] === bb["read"+alias]);
    }
});




// types bitset
var bb = new ByteBuffer(2),
    arr;

function run(data) {
    bb.reset();
    bb.writeBitSet(data);
    bb.reset();
    assert(deepEqual(bb.readBitSet(), data))
};

run([]);
run([true]);
run([false]);
run([false,true]);
run([false,false,false,false,false,false,false,false]);
run([true,false,true,false,true,false,true,false]);
run([true,true,true,true,true,true,true,true]);
run([true,false,true,false,true,false,true,false]);
run([true,false,true,false,true,false,true,false,true]);

bb.reset();
bb.writeBitSet([,null,"",0,42,"hello world",new Date(0),{},[]]);
bb.reset();
assert(deepEqual(bb.readBitSet(), [false,false,false,false,true,true,true,true,true]))




// types calculateVarint
assert(ByteBuffer.MAX_VARINT32_BYTES === 5);
assert(ByteBuffer.MAX_VARINT64_BYTES === 10);
var values=[[0,1],[-1,5,10],[1<<7,2],[1<<14,3],[1<<21,4],[1<<28,5],[0x7FFFFFFF|0,5],[0xFFFFFFFF,5],[0xFFFFFFFF|0,5,10]];
for (var i=0; i<values.length; i++) {
    assert(ByteBuffer.calculateVarint32(values[i][0]) === values[i][1]);
    assert(ByteBuffer.calculateVarint64(values[i][0]) === values[i].length > 2 ? values[i][2] : values[i][1]);
}
var Long = ByteBuffer.Long;
values=[[Long.fromNumber(1).shiftLeft(35),6],[Long.fromNumber(1).shiftLeft(42),7],[Long.fromNumber(1).shiftLeft(49),8],[Long.fromNumber(1).shiftLeft(56),9],[Long.fromNumber(1).shiftLeft(63),10],[Long.fromNumber(1,true).shiftLeft(63),10]];
for (i=0; i<values.length; i++) {
    assert(ByteBuffer.calculateVarint64(values[i][0]) === values[i][1]);
}




// types zigZagVarint
var Long = ByteBuffer.Long;
var values = [[0,0],[-1,1],[1,2],[-2,3],[2,4],[-3,5],[3,6],[2147483647,4294967294],[-2147483648,4294967295]];

for (var i=0; i<values.length; i++) {
    assert(ByteBuffer.zigZagEncode32(values[i][0]) === values[i][1]);
    assert(ByteBuffer.zigZagDecode32(values[i][1]) === values[i][0]);
    assert(ByteBuffer.zigZagEncode64(values[i][0]).toNumber() === values[i][1]);
    assert(ByteBuffer.zigZagDecode64(values[i][1]).toNumber() === values[i][0]);
}
values = [[Long.MAX_VALUE,Long.MAX_UNSIGNED_VALUE.subtract(Long.ONE)],[Long.MIN_VALUE,Long.MAX_UNSIGNED_VALUE]];
// NOTE: Even 64bit doubles from toNumber() fail for these values so we are using toString() here
for (i=0; i<values.length; i++) {
    assert(ByteBuffer.zigZagEncode64(values[i][0]).toString() === values[i][1].toString());
    assert(ByteBuffer.zigZagDecode64(values[i][1]).toString() === values[i][0].toString());
}

// 32 bit ZZ
values = [0,1,300,-300,2147483647,-2147483648];
bb = new ByteBuffer(10);
for (i=0; i<values.length; i++) {
    var encLen = bb.writeVarint32ZigZag(values[i], 0);
    bb.limit = encLen;
    var dec = bb.readVarint32ZigZag(0);
    assert(dec['value'] === values[i]);
    assert(encLen === dec['length']);
    bb.clear();
}

// 64 bit ZZ
values = [
    Long.ONE, 1,
    Long.fromNumber(-3),
    Long.fromNumber(300),
    Long.fromNumber(-300),
    Long.fromNumber(0x7FFFFFFF),
    Long.fromNumber(0x8FFFFFFF),
    Long.fromNumber(0xFFFFFFFF),
    Long.fromBits(0xFFFFFFFF, 0x7FFFFFFF),
    Long.fromBits(0xFFFFFFFF, 0xFFFFFFFF)
];
var bb = new ByteBuffer(10);
for (i=0; i<values.length; i++) {
    encLen = bb.writeVarint64ZigZag(values[i], 0);
    dec = bb.readVarint64ZigZag(0);
    assert(values[i].toString() === dec['value'].toString());
    assert(encLen === dec['length']);
}




// types utf8string
var bb = new ByteBuffer(2);
// Aliases
assert(bb.writeUTF8String === bb.writeString);
assert(bb.readUTF8String === bb.readString);
var str = "ä☺𠜎️☁️", str2;
// Writing
assert(bb.writeUTF8String(str) === bb);
bb.flip();
// bb.printDebug();
// Reading
str2 = bb.readUTF8String(ByteBuffer.calculateUTF8Chars(str), ByteBuffer.METRICS_CHARS);
// bb.printDebug();
assert(str2.length === str.length);
assert(str2 === str);
bb.reset();
str2 = bb.readUTF8String(bb.limit, ByteBuffer.METRICS_BYTES);
assert(str2 === str);




// types istring
var bb = new ByteBuffer(2);
assert(bb.writeIString("ab") === bb); // resizes to 4+2=6
assert(bb.capacity() === 6);
assert(bb.offset === 6);
assert(bb.limit === 2);
bb.flip();
assert(bb.toString("debug") === "<00 00 00 02 61 62>");
assert(deepEqual(bb.readIString(0), {"string": "ab", "length": 6}))
assert(bb.readIString() === "ab");
bb.reset();
assert(bb.toString("debug") === "<00 00 00 02 61 62>");
assert(bb.readIString() === "ab");
assert(bb.toString("debug") === "00 00 00 02 61 62|");





// types vstring
var bb = new ByteBuffer(2);
bb.writeVString("ab"); // resizes to 2*2=4
assert(bb.capacity() === 4);
assert(bb.offset === 3);
assert(bb.limit === 2);
bb.flip();
assert(bb.toString("debug").substr(0, 10) === "<02 61 62>");
assert(deepEqual(bb.readVString(0), {"string": "ab", "length": 3}))
assert(bb.toString("debug").substr(0, 10) === "<02 61 62>");
assert(bb.readVString() === "ab");
assert(bb.toString("debug").substr(0, 9) === "02 61 62|");





// types cstring
var bb = new ByteBuffer(2);
bb.writeCString("a");
assert(bb.capacity() === 2);
assert(bb.offset === 2);
assert(bb.limit === 2);
bb.offset = 1;
bb.writeCString("b"); // resizes to 4
assert(bb.capacity() === 4);
assert(bb.offset === 3);
assert(bb.limit === 2);
bb.flip();
assert(bb.toString("debug").substr(0, 10) === "<61 62 00>");
assert(deepEqual(bb.readCString(0), {"string": "ab", "length": 3}))
assert(bb.toString("debug").substr(0, 10) === "<61 62 00>");
assert(bb.readCString() === "ab");
assert(bb.toString("debug").substr(0, 9) === "61 62 00|");





// convert toHex
var bb = new ByteBuffer(4);
bb.writeUint16(0x1234);
bb.writeUint8(0x56);
bb.flip();
assert(bb.toHex() === "123456");
assert(bb.offset === 0);
assert(bb.toHex(1) === "3456");
assert(bb.toHex(1,2) === "34");
assert(bb.toHex(1,1) === "");
//bb.toHex(1,0); // ################################################### This should throw






// convert toBase64
var bb = new ByteBuffer(8);
bb.writeUTF8String("abcdefg"); // 7 chars
bb.flip();
assert(bb.toBase64() === "YWJjZGVmZw==");
assert(bb.offset === 0);
assert(bb.toBase64(3) === "ZGVmZw==");
assert(bb.toBase64(3,6) === "ZGVm");
assert(bb.toBase64(3,3) === "");
//bb.toBase64(1,0); // ################################################# This should throw





// convert toBinary
var bb = new ByteBuffer(5);
bb.writeUint32(0x001234FF);
bb.flip();
assert(bb.toBinary() === "\x00\x12\x34\xFF");
assert(bb.offset === 0);





// convert toString
var bb = new ByteBuffer(3);
bb.writeUint16(0x6162).flip();
assert(bb.toString("hex") === "6162");
assert(bb.toString("base64") === "YWI=");
assert(bb.toString("utf8") === "ab");
assert(bb.toString("debug").substr(0,7) === "<61 62>");
assert(bb.toString() === (type === ArrayBuffer ? (accessor === DataView ? "ByteBufferAB_DataView" : "ByteBufferAB") : "ByteBufferNB")+"(offset=0,markedOffset=-1,limit=2,capacity=3)");
assert(bb.offset === 0);





// convert toBuffer
var bb = new ByteBuffer(2);
bb.writeUint16(0x1234).flip();
var buf = bb.toBuffer();
assert(buf === bb.buffer);
if (type === ArrayBuffer) {
    assert(buf instanceof ArrayBuffer);
    assert(buf.byteLength === 2);
} else {
    assert(buf instanceof Buffer);
    assert(buf.length === 2);
}
bb.limit = 1;
buf = bb.toBuffer();
assert(buf !== bb.buffer);
if (type === ArrayBuffer) {
    assert(buf instanceof ArrayBuffer);
    assert(buf.byteLength === 1);
} else {
    assert(buf instanceof Buffer);
    assert(buf.length === 1);
}




// convert toArrayBuffer
var bb = new ByteBuffer(3);
if (type === ArrayBuffer) {
    assert(bb.toArrayBuffer === bb.toBuffer);
} else {
    assert(bb.buffer instanceof Buffer);
    bb.writeUint16(0x1234);
    bb.flip();
    bb.offset = 1;
    var ab = bb.toArrayBuffer();
    assert(ab instanceof ArrayBuffer);
    assert(ab.byteLength === 1);
}




// misc pbjsi19
var bb = new ByteBuffer(9); // Trigger resize to 18 in writeVarint64
bb.writeVarint32(16);
bb.writeVarint32(2);
bb.writeVarint32(24);
bb.writeVarint32(0);
bb.writeVarint32(32);
bb.writeVarint64(ByteBuffer.Long.fromString("1368057600000"));
bb.writeVarint32(40);
bb.writeVarint64(ByteBuffer.Long.fromString("1235455123"));
bb.flip();
assert(bb.toString("debug").substr(0,52) === "<10 02 18 00 20 80 B0 D9 B4 E8 27 28 93 99 8E CD 04>");




// misc NaN
var bb = new ByteBuffer(4);
assert(isNaN(bb.writeFloat(NaN).flip().readFloat(0)));
assert(bb.writeFloat(+Infinity).flip().readFloat(0) === +Infinity);
assert(bb.writeFloat(-Infinity).flip().readFloat(0) === -Infinity);
bb.resize(8);
assert(isNaN(bb.writeDouble(NaN).flip().readDouble(0)));
assert(bb.writeDouble(+Infinity).flip().readDouble(0) === +Infinity);
assert(bb.writeDouble(-Infinity).flip().readDouble(0) === -Infinity);

// Varints, however, always need a cast, which results in the following:
assert(NaN >>> 0 === 0);
assert(NaN | 0 === 0);
assert(Infinity >>> 0 === 0);
assert(Infinity | 0 === 0);
assert(-Infinity >>> 0 === 0);
assert(-Infinity | 0 === 0);





// debug.printDebug
var bb = new ByteBuffer(3);
function callMe() { callMe.called = true; }
bb.printDebug(callMe);
assert(callMe.called);





alert('bytebuffer-tests.js\n\nAutomatic tests completed.\n\nThere are several manual tests in the code that should be uncommented to confirm errors are thrown when they should be.')
