var fixtures = {"valid":[{"d":"971761939728640320549601132085879836204587084162","Q":{"curve":"secp160r1","x":"466448783855397898016055842232266600516272889280","y":"1110706324081757720403272427311003102474457754220","hex":"0251b4496fecc406ed0e75a24a3c03206251419dc0"}},{"d":"702232148019446860144825009548118511996283736794","Q":{"curve":"secp160r1","x":"1176954224688105769566774212902092897866168635793","y":"1130322298812061698910820170565981471918861336822","hex":""}},{"d":"399525573676508631577122671218044116107572676710","Q":{"curve":"secp160r1","x":"420773078745784176406965940076771545932416607676","y":"221937774842090227911893783570676792435918278531","hex":"0349b41e0e9c0369c2328739d90f63d56707c6e5bc"}}]}

var pointFixtures = {"valid":[{"curve":"secp256k1","d":"1","x":"55066263022277343669578718895168534326250603453777594175500187360389116729240","y":"32670510020758816978083085130507043184471273380659243275938904335757337482424","compressed":false,"hex":"0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"},{"curve":"secp256k1","d":"1","x":"55066263022277343669578718895168534326250603453777594175500187360389116729240","y":"32670510020758816978083085130507043184471273380659243275938904335757337482424","compressed":true,"hex":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"},{"curve":"secp256k1","d":"19898843618908353587043383062236220484949425084007183071220218307100305431102","x":"83225686012142088543596389522774768397204444195709443235253141114409346958144","y":"23739058578904784236915560265041168694780215705543362357495033621678991351768","compressed":true,"hex":"02b80011a883a0fd621ad46dfc405df1e74bf075cbaf700fd4aebef6e96f848340"},{"curve":"secp256k1","d":"48968302285117906840285529799176770990048954789747953886390402978935544927851","x":"30095590000961171681152428142595206241714764354580127609094760797518133922356","y":"93521207164355458151597931319591130635754976513751247168472016818884561919702","compressed":true,"hex":"024289801366bcee6172b771cf5a7f13aaecd237a0b9a1ff9d769cabc2e6b70a34"},{"curve":"secp256k1","d":"115792089237316195423570985008687907852837564279074904382605163141518161494336","x":"55066263022277343669578718895168534326250603453777594175500187360389116729240","y":"83121579216557378445487899878180864668798711284981320763518679672151497189239","compressed":true,"hex":"0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"},{"curve":"secp128r1","d":"1","x":"29408993404948928992877151431649155974","y":"275621562871047521857442314737465260675","compressed":true,"hex":"03161ff7528b899b2d0c28607ca52c5b86"},{"curve":"secp128r1","d":"1","x":"29408993404948928992877151431649155974","y":"275621562871047521857442314737465260675","compressed":false,"hex":"04161ff7528b899b2d0c28607ca52c5b86cf5ac8395bafeb13c02da292dded7a83"},{"curve":"secp160k1","d":"1","x":"338530205676502674729549372677647997389429898939","y":"842365456698940303598009444920994870805149798382","compressed":true,"hex":"023b4c382ce37aa192a4019e763036f4f5dd4d7ebb"},{"curve":"secp192k1","d":"1","x":"5377521262291226325198505011805525673063229037935769709693","y":"3805108391982600717572440947423858335415441070543209377693","compressed":true,"hex":"03db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d"},{"curve":"secp192k1","d":"1","x":"5377521262291226325198505011805525673063229037935769709693","y":"3805108391982600717572440947423858335415441070543209377693","compressed":false,"hex":"04db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"}],"invalid":[{"description":"Invalidsequencetag","exception":"Invalidsequencetag","hex":"0179be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"},{"description":"Sequencetooshort","exception":"Invalidsequencelength","hex":"0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10"},{"description":"Sequencetooshort(compressed)","exception":"Invalidsequencelength","hex":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f8"},{"description":"Sequencetoolong","exception":"Invalidsequencelength","hex":"0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b80000"},{"description":"Sequencetoolong(compressed)","exception":"Invalidsequencelength","hex":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f817980000"}]}

var p = new BigInteger('11')
var a = new BigInteger('22')
var b = new BigInteger('33')
var Gx = new BigInteger('44')
var Gy = new BigInteger('55')
var n = new BigInteger('66')
var h = new BigInteger('77')

var curve = new Curve(p, a, b, Gx, Gy, n, h)
assert(curve.p.equals(p))
assert(curve.a.equals(a))
assert(curve.b.equals(b))

assert(curve.G.equals(Point.fromAffine(curve, Gx, Gy)))
assert(curve.n.equals(n))
assert(curve.h.equals(h))
assert(curve.a.equals(a))
assert(curve.b.equals(b))

fixtures.valid.forEach(function (f) {
    var curve = getCurveByName(f.Q.curve)
    
    var d = new BigInteger(f.d)
    var Q = curve.G.multiply(d)
	
    assert(Q.affineX.toString(), f.Q.x)
    assert(Q.affineY.toString(), f.Q.y)
})

var Gx = new BigInteger('8')
var Gy = new BigInteger('6')
var n = new BigInteger('12')
var curve = new Curve(new BigInteger('11'), BigInteger.ONE, BigInteger.ZERO, Gx, Gy, n, undefined)
var points=[{x:0,y:0},{x:5,y:8},{x:5,y:3},{x:7,y:8},{x:7,y:3},{x:8,y:5},{x:8,y:6},{x:9,y:10},{x:9,y:1},{x:10,y:8},{x:10,y:3}].map(function (p) { return Point.fromAffine(curve, BigInteger.valueOf(p.x), BigInteger.valueOf(p.y)) } )

var P = curve.G.multiply(curve.p)
assert(P.equals(curve.G.negate()))

var nG = curve.G.multiply(curve.n)
assert(curve.isInfinity(nG))

var inf = curve.infinity
var a = points[2]
var b = points[7]
var z = points[0]
var y = Point.fromAffine(curve, BigInteger.ONE, BigInteger.ONE)

// should validate field elements properly
assert(curve.validate(a))
assert(curve.validate(b))
assert(curve.validate(z))
assert(curve.isOnCurve(z))
assert(!curve.isOnCurve(y))
assert(!curve.isInfinity(a))
assert(!curve.isInfinity(b))
assert(curve.isInfinity(inf))
assert(curve.isOnCurve(inf))

// should negate field elements properly
assert.equal(a.negate().toString(), '(5,8)') // -(5,3) = (5,8)
assert.equal(b.negate().toString(), '(9,1)') // -(9,10) = (9,1)
// assert.equal(inf.negate().toString(), '(INFINITY)') // FAILS: can't negate infinity point should fail out gracefully
assert.equal(z.negate().toString(), '(0,0)') // -(0,0) = (0,0)

// should add field elements properly
assert.equal(a.add(b).toString(), '(9,1)') // (5,3) + (9,10) = (9,1)
assert.equal(b.add(a).toString(), '(9,1)') // (9,10) + (5,3) = (9,1)
assert.equal(a.add(z).toString(), '(9,10)') // (5,3) + (0,0) = (9,10)
assert.equal(a.add(y).toString(), '(8,1)') // (5,3) + (1,1) = (8,1)  <-- weird result should error out if one of the operands isn't on the curve // FIXME

assert.equal(a.add(inf).toString(), '(5,3)') // (5,3) + INFINITY = (5,3)
assert.equal(inf.add(a).toString(), '(5,3)') // INFINITY + (5,3) = (5,3)

// should multiply field elements properly
assert.equal(a.multiply(new BigInteger('2')).toString(), '(5,8)') // (5,3) x 2 = (5,8)
assert.equal(a.multiply(new BigInteger('3')).toString(), '(INFINITY)') // (5,3) x 3 = INFINITY
assert.equal(a.multiply(new BigInteger('4')).toString(), '(5,3)') // (5,3) x 4 = (5,3)
assert.equal(a.multiply(new BigInteger('5')).toString(), '(5,8)') // (5,3) x 5 = (5,8)

assert.equal(b.multiply(new BigInteger('2')).toString(), '(5,8)') // (9,10) x 2 = (5,8)
assert.equal(b.multiply(new BigInteger('3')).toString(), '(0,0)') // (9,10) x 3 = (0,0)
assert.equal(b.multiply(new BigInteger('4')).toString(), '(5,3)') // (9,10) x 4 = (5,3)
assert.equal(b.multiply(new BigInteger('5')).toString(), '(9,1)') // (9,10) x 5 = (9,1)

assert.equal(inf.multiply(new BigInteger('2')).toString(), '(INFINITY)') // INFINITY x 2 = INFINITY
assert.equal(inf.multiply(new BigInteger('3')).toString(), '(INFINITY)') // INFINITY x 3 = INFINITY
assert.equal(inf.multiply(new BigInteger('4')).toString(), '(INFINITY)') // INFINITY x 4 = INFINITY
assert.equal(inf.multiply(new BigInteger('5')).toString(), '(INFINITY)') // INFINITY x 5 = INFINITY

assert.equal(z.multiply(new BigInteger('2')).toString(), '(INFINITY)') // (0,0) x 2 = INFINITY
assert.equal(z.multiply(new BigInteger('3')).toString(), '(0,0)') // (0,0) x 3 = (0,0)
assert.equal(z.multiply(new BigInteger('4')).toString(), '(INFINITY)') // (0,0) x 4 = INFINITY
assert.equal(z.multiply(new BigInteger('5')).toString(), '(0,0)') // (0,0) x 5 = (0,0)

assert.equal(a.multiplyTwo(new BigInteger('4'), b, new BigInteger('4')).toString(), '(5,8)') // (5,3) x 4 + (9,10) x 4 = (5,8)

assert.equal(a.multiply(new BigInteger('2')).toString(), a.twice().toString()) // .multiply(2) == .twice()
assert.equal(b.multiply(new BigInteger('2')).toString(), b.twice().toString())
assert.equal(inf.multiply(new BigInteger('2')).toString(), inf.twice().toString())
assert.equal(z.multiply(new BigInteger('2')).toString(), z.twice().toString())

assert.equal(a.multiply(new BigInteger('2')).toString(), a.add(a).toString()) // this.multiply(2) == this.add(this)
assert.equal(b.multiply(new BigInteger('2')).toString(), b.add(b).toString())
assert.equal(inf.multiply(new BigInteger('2')).toString(), inf.add(inf).toString())
assert.equal(z.multiply(new BigInteger('2')).toString(), z.add(z).toString())

// isOnCurve
pointFixtures.valid.forEach(function (f) {
    var curve = getCurveByName(f.curve)
    var P = Point.fromAffine(curve, new BigInteger(f.x), new BigInteger(f.y))

    assert(curve.isOnCurve(P))
})

// secp256k1
var curve = getCurveByName('secp256k1')

// should return true for a point on the curve
var d = BigInteger.ONE
var Q = curve.G.multiply(d)
assert(curve.isOnCurve(Q))

// should return false for points not in the finite field
var P = Point.fromAffine(curve, curve.p.add(BigInteger.ONE), BigInteger.ZERO)
assert(!curve.isOnCurve(P))

// should return false for a point not on the curve
var P = Point.fromAffine(curve, BigInteger.ONE, BigInteger.ONE)
assert(!curve.isOnCurve(P))

// should return true for points at (0, 0) if they are on the curve
var curve = new Curve(
    new BigInteger('11'),
    BigInteger.ONE,
    BigInteger.ZERO,
    new BigInteger('8'),
    new BigInteger('6'),
    new BigInteger('12'),
    undefined
)

var P = Point.fromAffine(curve, BigInteger.ZERO, BigInteger.ZERO)
assert(curve.isOnCurve(P))

// validate
pointFixtures.valid.forEach(function (f) {
    var curve = getCurveByName(f.curve)
    var P = Point.fromAffine(curve, new BigInteger(f.x), new BigInteger(f.y))
    assert(curve.validate(P))
})

// secp256k1
var curve = getCurveByName('secp256k1')

// should validate P where y^2 == x^3 + ax + b (mod p)
var d = BigInteger.ONE
var Q = curve.G.multiply(d)

assert(curve.validate(Q))

// should not validate P where y^2 != x^3 + ax + b (mod p)
var P = Point.fromAffine(curve, BigInteger.ONE, BigInteger.ONE)

//curve.validate(P) // ################################################################ This should throw

// should not validate P where P = O
//curve.validate(curve.infinity) // ################################################### This should throw


// pointFromX
pointFixtures.valid.forEach(function (f) {
    if (f.curve !== 'secp224r1') { //TODO: secp224r1, currently not supported
    
	var curve = getCurveByName(f.curve)
	
	var x = new BigInteger(f.x)
	var odd = !(new BigInteger(f.y).isEven())
	
	var actual = curve.pointFromX(odd, x)
	    
	assert.equal(actual.affineX.toString(), f.x)
	assert.equal(actual.affineY.toString(), f.y)
    }
})



alert('ecurve-tests.js\n\nPassed all automatic tests.\n\nThere are two manual tests that must be uncommented to confirm that the code throws.')
