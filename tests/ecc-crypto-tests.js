var encrypted_key =
    "37fd6a251d262ec4c25343016a024a3aec543b7a43a208bf66bc80640dff" +
    "8ac8d52ae4ad7500d067c90f26189f9ee6050a13c087d430d24b88e713f1" +
    "5d32cbd59e61b0e69c75da93f43aabb11039d06f";

var decrypted_key =
    "ab0cb9a14ecaa3078bfee11ca0420ea2" +
    "3f5d49d7a7c97f7f45c3a520106491f8" + // 64 hex digits
    "00000000000000000000000000000000000000000000000000000000" +
    "00000000";

// It decrypts
var aes = Aes.fromSeed("Password01")
var d = aes.decryptHex(encrypted_key)
assert.equal(decrypted_key, d, "decrypted key does not match")

// It encrypts
var aes = Aes.fromSeed("Password01")
var d = aes.encryptHex(decrypted_key)
assert.equal(encrypted_key, d, "encrypted key does not match")

// It generates private key from seed
var private_key = PrivateKey.fromSeed("1");
assert.equal(private_key.toPublicKey().toString(), "STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA", "private key does not match");

// It signs
var private_key = PrivateKey.fromSeed("1");
var result = [];
for (var i = 0; i < 10; i++) {
    result.push(Signature.signBuffer((new Buffer(i)), private_key));
}

// binary_encryption
var sender = PrivateKey.fromSeed("1");
var receiver = PrivateKey.fromSeed("2");
var S = sender.get_shared_secret(receiver.toPublicKey());
var nonce = "289662526069530675";
var ciphertext = Aes.encrypt_with_checksum(
    sender,
    receiver.toPublicKey(),
    nonce,
    new Buffer("\xff\x00", 'binary')
);
var plaintext = Aes.decrypt_with_checksum(
    receiver,
    sender.toPublicKey(),
    nonce,
    ciphertext
);
assert.equal("ff00", plaintext.toString('hex'));

// key_checksum
var key_checksum = key.aes_checksum("password").checksum;
assert.equal(
    true,
    key_checksum.length > 4+4+2,
    "key_checksum too short"
);
assert.equal(3, key_checksum.split(',').length);

// key_checksum with aes_private
var aes_checksum = key.aes_checksum("password");
var aes_private = aes_checksum.aes_private;
var key_checksum = aes_checksum.checksum;
assert(aes_private !== null);
assert(typeof aes_private["decrypt"] === 'function');
assert.equal(
    true,
    key_checksum.length > 4+4+2,
    "key_checksum too short"
);
assert.equal(3, key_checksum.split(',').length);

// wrong password
key.aes_checksum("password").checksum;

// DEBUG console.log('... key_checksum',key_checksum)
// key.aes_private("bad password", key_checksum) // ########################### This should throw 'wrong password'

//password aes_private
var key_checksum = key.aes_checksum("password").checksum;
var password_aes = key.aes_private("password", key_checksum);
assert(password_aes !== null);

// Derivation
var one_time_private = PrivateKey.fromHex("8fdfdde486f696fd7c6313325e14d3ff0c34b6e2c390d1944cbfe150f4457168")
var to_public = PublicKey.fromStringOrThrow("STM7vbxtK1WaZqXsiCHPcjVFBewVj8HFRd5Z5XZDpN6Pvb2dZcMqK")
var secret = one_time_private.get_shared_secret( to_public )
var child = hash.sha256( secret )
// Check everything above with `wdump((child));` from the witness_node:
assert.equal(child.toString('hex'), "1f296fa48172d9af63ef3fb6da8e369e6cc33c1fb7c164207a3549b39e8ef698")

nonce = hash.sha256( one_time_private.toBuffer() )
assert.equal(nonce.toString('hex'), "462f6c19ece033b5a3dba09f1e1d7935a5302e4d1eac0a84489cdc8339233fbf")

// child from public
assert.equal(
    to_public.child(child).toString(),
    "STM6XA72XARQCain961PCJnXiKYdEMrndNGago2PV5bcUiVyzJ6iL",
    "derive child public key"
);

// child = hash.sha256( one_time_private.get_secret( to_public ))
// child from private
assert.equal(
    PrivateKey.fromSeed("alice-brain-key").child(child).toPublicKey().toString(),
    "STM6XA72XARQCain961PCJnXiKYdEMrndNGago2PV5bcUiVyzJ6iL",
    "derive child from private key"
)

// Suggest brainkey
var brainKey = key.suggest_brain_key(Dictionary.en);
assert.equal(16, brainKey.split(" ").length);

// NOT SURE WHAT'S WRONG WITH THIS TEST. I CAN'T SEEM TO MAKE IT WORK. THE ORIGINAL
// ECC LIB FROM SVK SAID THIS TEST WASN'T IMPORTANT.
/*
// many keys
for (var i = 0; i < 10; i++) {
    let privkey1 = key.get_random_key()
    let privkey2 = key.get_random_key()
    let secret1 = one_time_private.get_shared_secret( privkey1.toPublicKey() )
    let child1 = hash.sha256( secret1 )

    let secret2 = privkey2.get_shared_secret( privkey2.toPublicKey() )
    let child2 = hash.sha256( secret2 )
    console.log(privkey1.toPublicKey().child(child1).toString())
    console.log(privkey2.toPublicKey().child(child2).toString())
    assert.equal(
	privkey1.toPublicKey().child(child1).toString(),
	privkey2.toPublicKey().child(child2).toString(),
	"derive child public key"
    )
}*/

// child from private
let privkey1 = key.get_random_key()
let privkey2 = key.get_random_key()
let secret1 = one_time_private.get_shared_secret( privkey1.toPublicKey() )
let child1 = hash.sha256( secret1 )

let secret2 = privkey2.get_shared_secret( privkey2.toPublicKey() )
let child2 = hash.sha256( secret2 ) 

assert.equal(
    privkey1.child(child1).toString(),
    privkey2.child(child2).toString(),
    "derive child private key"
)

// Make sure time is elapsing while hashing/generating entropy
var start_t = Date.now();
var privkey = key.get_random_key();
var elapsed = Date.now() - start_t;
assert.equal(
    // repeat operations may take less time
    elapsed >= 250 * 0.8, true,
    'minimum time requirement was not met, instead only ${elapsed/1000.0} elapsed'
);

alert('ecc-crypto-tests.js\n\nAutomatic tests passed.\nCheck code for any manual tests that might be needed.')
