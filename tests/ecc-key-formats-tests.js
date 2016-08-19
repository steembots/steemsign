var key = {
    // delegate0
    // sourced from: ./bitshares/programs/utils/STM_create_key
    public_key: "STM7jDPoMwyjVH5obFmqzFNp4Ffp7G2nvC7FKFkrMBpo7Sy4uq5Mj",
    private_key: "20991828d456b389d0768ed7fb69bf26b9bb87208dd699ef49f10481c20d3e18",
    private_key_WIF_format: "5J4eFhjREJA7hKG6KcvHofHMXyGQZCDpQE463PAaKo9xXY6UDPq",
    STM_address: "STM8DvGQqzbgCR5FHiNsFf8kotEXr8VKD3mR",
    pts_address: "Po3mqkgMzBL4F1VXJArwQxeWf3fWEpxUf3",
    encrypted_private_key: "5e1ae410919c450dce1c476ae3ed3e5fe779ad248081d85b3dcf2888e698744d0a4b60efb7e854453bec3f6883bcbd1d",
    blockchain_address: "4f3a560442a05e4fbb257e8dc5859b736306bace",
    // https://github.com/BitShares/bitshares/blob/2602504998dcd63788e106260895769697f62b07/libraries/wallet/wallet_db.cpp#L103-L108
    Uncompressed_BTC:"STMLAFmEtM8as1mbmjVcj5dphLdPguXquimn",
    Compressed_BTC:"STMANNTSEaUviJgWLzJBersPmyFZBY4jJETY",
    Uncompressed_PTS:"STMEgj7RM6FBwSoccGaESJLC3Mi18785bM3T",
    Compressed_PTS:"STMD5rYtofD6D4UHJH6mo953P5wpBfMhdMEi",
    null_public_key: "STM1111111111111111111111111111111114T1Anm"
}

// Calculates public key from private key
var private_key = PrivateKey.fromHex(key.private_key);
var public_key = private_key.toPublicKey();
assert.equal(key.public_key, public_key.toPublicKeyString());

// Create STM short address
var public_key = PublicKey.fromPublicKeyString(key.public_key);
assert.equal(key.STM_address, public_key.toAddressString());

// Blockchain Address
var public_key = PublicKey.fromPublicKeyString(key.public_key);
assert.equal(key.blockchain_address, public_key.toBlockchainAddress().toString('hex'));

// STM public key import / export
var public_key = PublicKey.fromPublicKeyString(key.public_key);
assert.equal(key.public_key, public_key.toPublicKeyString());

// PTS
var private_key = PrivateKey.fromHex(key.private_key);
var public_key = private_key.toPublicKey();
assert.equal(key.pts_address, public_key.toPtsAddy());

// To WIF
var private_key = PrivateKey.fromHex(key.private_key);
assert.equal(key.private_key_WIF_format, private_key.toWif());

// From WIF
var private_key = PrivateKey.fromWif(key.private_key_WIF_format);
assert.equal(private_key.toHex(), key.private_key);

// Calc public key
var private_key = PrivateKey.fromHex(key.private_key);
var public_key = private_key.toPublicKey();
assert.equal(key.STM_address, public_key.toAddressString());

// Decrypt private key
var aes = Aes.fromSeed("Password00");
var d = aes.decryptHex(key.encrypted_private_key);
assert.equal(key.private_key, d);

// STM/BTC uncompressed
var public_key = PublicKey.fromPublicKeyString(key.public_key);
var address = Address.fromPublic(public_key, false, 0);
assert.equal(key.Uncompressed_BTC, address.toString());

// STM/BTC compressed
var public_key = PublicKey.fromPublicKeyString(key.public_key);
var address = Address.fromPublic(public_key, true, 0);
assert.equal(key.Compressed_BTC, address.toString());

// STM/PTS uncompressed
var public_key = PublicKey.fromPublicKeyString(key.public_key);
var address = Address.fromPublic(public_key, false, 56);
assert.equal(key.Uncompressed_PTS, address.toString());

// STM/PTS compressed
var public_key = PublicKey.fromPublicKeyString(key.public_key);
var address = Address.fromPublic(public_key, true, 56);
assert.equal(key.Compressed_PTS, address.toString());

// Null public key to/from buffer
var public_key = PublicKey.fromStringOrThrow(key.null_public_key);
var buffer = public_key.toBuffer();
var new_public_key = PublicKey.fromBuffer(buffer);
assert.equal(new_public_key.toPublicKeyString(), key.null_public_key);

alert('ecc-key-formats-tests.js:\n\nAutomatic tests passed.')
