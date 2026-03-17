const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../database.json');

function readDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

exports.getUserByUsername = username => readDB().find(item => item.type === 'user' && item.username === username);

exports.createUser = user => {
  const db = readDB();
  db.push({ ...user, type: 'user' });
  writeDB(db);
  return user;
};

exports.updateUserPassword = (username, newHash) => {
  const db = readDB();
  const idx = db.findIndex(item => item.type === 'user' && item.username === username);
  if (idx === -1) return null;
  db[idx].password = newHash;
  writeDB(db);
  return db[idx];
};
