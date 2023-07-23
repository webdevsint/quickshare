const aes256 = require("aes256");

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

class Encryption {
  constructor(text, key) {
    const plainText = text;
    const buffer = Buffer.from(plainText);
    this.encrypted = aes256.encrypt(key, plainText);
  }
}

class Decryption {
  constructor(text, key) {
    const encryptedText = text;
    this.decrypted = aes256.decrypt(key, encryptedText);
  }
}

module.exports = { formatBytes, Encryption, Decryption };
