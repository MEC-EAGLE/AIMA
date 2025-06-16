// Minimal "Prism" style file database used for this demo
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Use a 32 byte key for AES-256 encryption
const SECRET = 'aima-demo-secret-key-32-chars-!!';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(SECRET), iv);
  const enc = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

function decrypt(text) {
  const [ivHex, dataHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(SECRET), iv);
  const dec = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ]);
  return dec.toString();
}

const FILE = path.join(__dirname, 'db.json');
const DEFAULT = { users: [], posts: [], groups: [], messages: [] };

function read() {
  try {
    const text = fs.readFileSync(FILE, 'utf8');
    if (text.trim().startsWith('{')) {
      return JSON.parse(text);
    }
    return JSON.parse(decrypt(text));
  } catch {
    return { ...DEFAULT };
  }
}

function write(data) {
  const enc = encrypt(JSON.stringify(data));
  fs.writeFileSync(FILE, enc);
}

module.exports = {
  get(key) {
    return read()[key] || [];
  },
  set(key, val) {
    const db = read();
    db[key] = val;
    write(db);
  }
};
