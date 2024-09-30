const crypto = require('crypto');

const KEY = crypto.randomBytes(32);
const SIZE = 16;
const HEX = 'hex';
const UTF8 = 'utf8';
const AES = 'aes-256-cbc';

function encrypt(text) {
    const iv = crypto.randomBytes(SIZE);
    const cipher = crypto.createCipheriv(AES, Buffer.from(KEY), iv);

    let encrypted = cipher.update(text, UTF8, HEX);
    encrypted += cipher.final(HEX);

    return `${iv.toString(HEX)}:${encrypted}`;
}

function decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), HEX);
    const encrypted = parts.join(':');
    const decipher = crypto.createDecipheriv(AES, Buffer.from(KEY), iv);

    let decrypted = decipher.update(encrypted, HEX, UTF8);
    decrypted += decipher.final(UTF8);

    return decrypted;
}

module.exports = {encrypt, decrypt};
