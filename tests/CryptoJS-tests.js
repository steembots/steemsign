// Simple Encrypt/Decrypt test
var inputText = 'test message';
var secretKey = 'secret key 123';
var cipherText = CryptoJS.AES.encrypt(inputText, secretKey);
var bytes  = CryptoJS.AES.decrypt(cipherText.toString(), secretKey);
var plainText = bytes.toString(CryptoJS.enc.Utf8);
assert(inputText === plainText);

// Object Encryption
var data = [{id: 1}, {id: 2}]
var secretKey = 'secret key 123';
var cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
var bytes  = CryptoJS.AES.decrypt(cipherText.toString(), secretKey);
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
assert(deepEqual(decryptedData, data));

alert('CryptoJS-tests:\n\nSimple encrypt/decrypt automatic tests passed.')
