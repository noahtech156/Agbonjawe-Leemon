const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '../database.json');

function readDatabase() {
    const data = fs.readFileSync(databasePath, 'utf-8');
    return JSON.parse(data);
}

function writeDatabase(data) {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

exports.getUserByEmail = (email) => {
    const database = readDatabase();
    return database.users.find(user => user.email === email);
};

exports.createUser = (user) => {
    const database = readDatabase();
    database.users.push(user);
    writeDatabase(database);
};

exports.updateUserPassword = (email, newPassword) => {
    const database = readDatabase();
    const user = database.users.find(user => user.email === email);
    if (user) {
        user.password = newPassword;
        writeDatabase(database);
    }
};
