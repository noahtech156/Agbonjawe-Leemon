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

exports.getAllPosts = (filter = {}, page = 1, limit = 10) => {
  let posts = readDB().filter(item => item.type === 'post');
  if (filter.category) posts = posts.filter(p => p.category === filter.category);
  const total = posts.length;
  const paginated = posts.slice((page - 1) * limit, page * limit);
  return { total, posts: paginated };
};

exports.getPostById = id => readDB().find(item => item.type === 'post' && item.id === id);

exports.createPost = post => {
  const db = readDB();
  db.push({ ...post, type: 'post' });
  writeDB(db);
  return post;
};

exports.updatePost = (id, data) => {
  const db = readDB();
  const idx = db.findIndex(item => item.type === 'post' && item.id === id);
  if (idx === -1) return null;
  db[idx] = { ...db[idx], ...data };
  writeDB(db);
  return db[idx];
};

exports.deletePost = id => {
  let db = readDB();
  const before = db.length;
  db = db.filter(item => !(item.type === 'post' && item.id === id));
  writeDB(db);
  return db.length < before;
};
