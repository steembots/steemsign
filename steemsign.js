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

function asciiToHex(input) {
    var hex_string = '';
    for (var i = 0; i < input.length; ++i) {
	hex_string += input.charCodeAt(i).toString(16);
    }
    return hex_string;
}

function reverseHex(input) {
    var output = '';
    for (var i = input.length-2; i >= 0; i-=2) {
	output += input[i];
	output += input[i+1];
    }
    return output;
}

function sign(steem){
    chain_id = "0000000000000000000000000000000000000000000000000000000000000000";
    steem.send('get_dynamic_global_properties',[], function(r) {
	var username = 'tester';
	var password = 'testpw';
	var privateKey = generateKey(username, password, 'posting');
	var publicKey = privateKey.toPublicKey();
	
	var author = 'xeroc';
	var permlink = 'piston';
	var weight = '10000';
	
	var tx = {};
        head_block_time_string = r.time;
	var exp_in_seconds = base_expiration_sec(head_block_time_string) + 15
	
	tx.expiration = head_block_time_string;	
	tx.extensions = [];
        tx.operations = [['vote',
			  {'author': author,
			   'permlink': permlink,
			   'voter': username,
			   'weight': weight}]];
        tx.ref_block_num = r.head_block_number & 0xFFFF;
        tx.ref_block_prefix = new Buffer(r.head_block_id, 'hex').readUInt32LE(4);
	
	var ref_block_num_str_BE = BigInteger('' + tx.ref_block_num).toString(16);
	var ref_block_prefix_str_BE = BigInteger('' + tx.ref_block_prefix).toString(16);
	var time_str_BE = BigInteger('' + exp_in_seconds).toString(16);
	
	var tx_buf = reverseHex(ref_block_num_str_BE) +
	    reverseHex(ref_block_prefix_str_BE) +
	    reverseHex(time_str_BE);
	tx_buf += '0100';
	var voter_length = BigInteger('' + username.length).toString(16)
	if (username.length <= 15) {
	    tx_buf += '0';
	}
	tx_buf += voter_length;
	tx_buf += asciiToHex(username);
	var author_length = BigInteger('' + author.length).toString(16)
	if (author.length <= 15) {
	    tx_buf += '0';
	}
	tx_buf += author_length;
	tx_buf += asciiToHex(author);
	var permlink_length = BigInteger('' + permlink.length).toString(16)
	if (permlink.length <= 15) {
	    tx_buf += '0';
	}
	tx_buf += permlink_length;
	tx_buf += asciiToHex(permlink);
	tx_buf += reverseHex(BigInteger(weight).toString(16));

	console.log('Serialized Transaction: ' + tx_buf)

	tx_buf = new Buffer(tx_buf, 'hex');

	var sig = Signature.signBuffer(Buffer.concat([new Buffer(chain_id, 'hex'), tx_buf]),
				       privateKey,
				       publicKey
				      );
	tx.signatures = sig.toBuffer().toString('hex');

	console.log('Private Key: ' + privateKey.toWif())
	console.log('Public Key: ' + publicKey.toString())
	console.log('Signature: ' + tx.signatures)
	console.log('Signed Transaction: ' + tx);
    });
    return;
}

var server = 'wss://this.piston.rocks';
var ws = new WebSocketWrapper(server);
ws.connect().then(function(response) {
    var steem = new SteemWrapper(ws);
    sign(steem);
});
