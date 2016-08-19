function getHeadBlockDate() {
    return timeStringToDate( head_block_time_string )
}

function generateKey(accountName, password, role) {
    seed = accountName + role + password;
    return PrivateKey.fromSeed(seed);
}

function base_expiration_sec(time_string) {
    var head_block_sec = Math.ceil(timeStringToDate(time_string).getTime() / 1000);
    var now_sec = Math.ceil(Date.now() / 1000);
    // The head block time should be updated every 3 seconds.  If it isn't
    // then help the transaction to expire (use head_block_sec)
    if (now_sec - head_block_sec > 30) { return head_block_sec; }
    // If the user's clock is very far behind, use the head block time.
    return Math.max(now_sec, head_block_sec);
}

function timeStringToDate(time_string) {
    if( ! time_string) return new Date("1970-01-01T00:00:00.000Z")
    if( ! /Z$/.test(time_string)) //does not end in Z
        // https://github.com/cryptonomex/graphene/issues/368
        time_string = time_string + "Z"
    return new Date(time_string)
}

function sign(steem){
    chain_id = "0000000000000000000000000000000000000000000000000000000000000000";
    steem.send('get_dynamic_global_properties',[], function(r) {
	var username = 'xeroc';
	var password = '5465406540654065dfgasg';
	var postingKey = generateKey(username, password, 'posting');

	var tx = {};
        head_block_time_string = r.time;
        tx.expiration = base_expiration_sec(head_block_time_string) + 15;
	tx.extensions = [];
        tx.operations = [['vote',
			  {'author': 'piston',
			   'permlink': 'xeroc',
			   'voter': username,
			   'weight': 10000}]];
        tx.ref_block_num = r.head_block_number & 0xFFFF;
        tx.ref_block_prefix = new Buffer(r.head_block_id, 'hex').readUInt32LE(4);

	console.log(r.head_block_number & 0xFFFF)
	console.log(new Buffer((r.head_block_number & 0xFFFF).toString()).toString('hex'))

	
	var buf = new Buffer('123124ahgsidfasdjfksjfd0sdf98as0d98fsadfkjsdfkjsdlfkjsdffa');
//	console.log(buf.toString('hex'))
	var priv_key = PrivateKey.fromSeed('1981951951');
//	console.log(Signature.signBuffer(buf, priv_key).i.toString(16));
	
	
	var b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);


	

//	console.log(tx)
        //b.append(tx);
	b.append(new ByteBuffer(tx));
//        alert(b);
//        tx.tr_buffer = this.toByteBuffer(tx).toBinary();
    });
    /*~
    buf = Buffer.concat([new Buffer(chain_id, 'hex'), this.tr_buffer])
    var buf_sha256 = hash.sha256(buf);
    var der, e, ecsignature, i, lenR, lenS, nonce;
    i = null;
    nonce = 0;
    e = BigInteger.fromBuffer(buf_sha256);
    while (true) {
      ecsignature = ecdsa.sign(secp256k1, buf_sha256, private_key.d, nonce++);
      der = ecsignature.toDER();
      lenR = der[3];
      lenS = der[5 + lenR];
      if (lenR === 32 && lenS === 32) {
        i = ecdsa.calcPubKeyRecoveryParam(secp256k1, e, ecsignature, private_key.toPublicKey().Q);
        i += 4;  // compressed
        i += 27; // compact  //  24 or 27 :( forcing odd-y 2nd key candidate)
        break;
      }
      if (nonce % 10 === 0) {
        console.log("WARN: " + nonce + " attempts to find canonical signature");
      }
    }
	var sig = new Signature(ecsignature.r, ecsignature.s, i);
    this.signatures.push(sig.toBuffer());
    this.signer_private_keys = [];
    this.signed = true;*/
    return;
}

var server = 'wss://this.piston.rocks';
var ws = new WebSocketWrapper(server);
ws.connect().then(function(response) {
    var steem = new SteemWrapper(ws);
    sign(steem);
});
