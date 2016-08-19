var hash = {

    /** @arg {string|Buffer} data
	@arg {string} [digest = null] - 'hex', 'binary' or 'base64'
	@return {string|Buffer} - Buffer when digest is null, or string
    */
    sha1: function (data, encoding) {
	if (typeof data === 'string') {
	    return CryptoJS.SHA256(data).toString();
	}
	else {
	    //return createHash('sha1').update(data).digest(encoding);
	    var wordArray = CryptoJS.enc.Hex.parse(data.toString('hex'))
	    return new Buffer(CryptoJS.SHA1(wordArray).toString());
	}
    },
    
    /** @arg {string|Buffer} data
	@arg {string} [digest = null] - 'hex', 'binary' or 'base64'
    @return {string|Buffer} - Buffer when digest is null, or string
    */
    sha256: function (data, encoding) {
	if (typeof data === 'string') {
	    return CryptoJS.SHA256(data).toString();
	}
	else {
	    //return createHash('sha256').update(data).digest(encoding)
	    var wordArray = CryptoJS.enc.Hex.parse(data.toString('hex'));
	    return new Buffer(CryptoJS.SHA256(wordArray).toString(), 'hex');
	}
    },
    
    /** @arg {string|Buffer} data
	@arg {string} [digest = null] - 'hex', 'binary' or 'base64'
	@return {string|Buffer} - Buffer when digest is null, or string
    */
    sha512: function (data, encoding) {
	if (typeof data === 'string') {
	    return CryptoJS.SHA512(data).toString();
	}
	else {
	    //return createHash('sha512').update(data).digest(encoding)
	    var wordArray = CryptoJS.enc.Hex.parse(data.toString('hex'))
	    return new Buffer(CryptoJS.SHA512(wordArray).toString(), 'hex');
	}
    },
    
    HmacSHA256: function (buffer, secret) {
	var bufferWordArray = CryptoJS.enc.Hex.parse(buffer.toString('hex'));
	var secretWordArray = CryptoJS.enc.Hex.parse(secret.toString('hex'));
	//return createHmac('sha256', secret).update(buffer).digest()
	return new Buffer(CryptoJS.HmacSHA256(bufferWordArray, secretWordArray).toString(), 'hex');
    },
    
    ripemd160: function (data) {
	//return createHash('rmd160').update(data).digest()
	var wordArray = CryptoJS.enc.Hex.parse(data.toString('hex'))
	return new Buffer(CryptoJS.RIPEMD160(wordArray).toString(), 'hex');
    }
}
