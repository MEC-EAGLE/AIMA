// Minimal "Prism" style file database used for this demo
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'db.json');
const DEFAULT = { users: [], posts: [], groups: [], messages: [] };

function read() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return { ...DEFAULT };
  }
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
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
