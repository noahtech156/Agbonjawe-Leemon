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

exports.createMessage = msg => {
  const db = readDB();
  db.push({ ...msg, type: 'contact' });
  writeDB(db);
  return msg;
};

exports.getAllMessages = () => readDB().filter(item => item.type === 'contact');
