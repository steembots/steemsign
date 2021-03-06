var curves = {
    "secp128r1": {
	"p": "fffffffdffffffffffffffffffffffff",
	"a": "fffffffdfffffffffffffffffffffffc",
	"b": "e87579c11079f43dd824993c2cee5ed3",
	"n": "fffffffe0000000075a30d1b9038a115",
	"h": "01",
	"Gx": "161ff7528b899b2d0c28607ca52c5b86",
	"Gy": "cf5ac8395bafeb13c02da292dded7a83"
    },
    "secp160k1": {
	"p": "fffffffffffffffffffffffffffffffeffffac73",
	"a": "00",
	"b": "07",
	"n": "0100000000000000000001b8fa16dfab9aca16b6b3",
	"h": "01",
	"Gx": "3b4c382ce37aa192a4019e763036f4f5dd4d7ebb",
	"Gy": "938cf935318fdced6bc28286531733c3f03c4fee"
    },
    "secp160r1": {
	"p": "ffffffffffffffffffffffffffffffff7fffffff",
	"a": "ffffffffffffffffffffffffffffffff7ffffffc",
	"b": "1c97befc54bd7a8b65acf89f81d4d4adc565fa45",
	"n": "0100000000000000000001f4c8f927aed3ca752257",
	"h": "01",
	"Gx": "4a96b5688ef573284664698968c38bb913cbfc82",
	"Gy": "23a628553168947d59dcc912042351377ac5fb32"
    },
    "secp192k1": {
	"p": "fffffffffffffffffffffffffffffffffffffffeffffee37",
	"a": "00",
	"b": "03",
	"n": "fffffffffffffffffffffffe26f2fc170f69466a74defd8d",
	"h": "01",
	"Gx": "db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d",
	"Gy": "9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"
    },
    "secp192r1": {
	"p": "fffffffffffffffffffffffffffffffeffffffffffffffff",
	"a": "fffffffffffffffffffffffffffffffefffffffffffffffc",
	"b": "64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",
	"n": "ffffffffffffffffffffffff99def836146bc9b1b4d22831",
	"h": "01",
	"Gx": "188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",
	"Gy": "07192b95ffc8da78631011ed6b24cdd573f977a11e794811"
    },
    "secp256k1": {
	"p": "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
	"a": "00",
	"b": "07",
	"n": "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
	"h": "01",
	"Gx": "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
	"Gy": "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
    },
    "secp256r1": {
	"p": "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
	"a": "ffffffff00000001000000000000000000000000fffffffffffffffffffffffc",
	"b": "5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
	"n": "ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
	"h": "01",
	"Gx": "6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
	"Gy": "4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"
    }
}

function getCurveByName (name) {
    var curve = curves[name]
    if (!curve) return null

    var p = new BigInteger(curve.p, 16)
    var a = new BigInteger(curve.a, 16)
    var b = new BigInteger(curve.b, 16)
    var n = new BigInteger(curve.n, 16)
    var h = new BigInteger(curve.h, 16)
    var Gx = new BigInteger(curve.Gx, 16)
    var Gy = new BigInteger(curve.Gy, 16)

    return new Curve(p, a, b, Gx, Gy, n, h)
}
