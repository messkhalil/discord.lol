const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.resolve(process.cwd(), 'data.db');

function connect() {
	const exists = fs.existsSync(DB_PATH);
	const db = new sqlite3.Database(DB_PATH);
	if (!exists) init(db);
	return db;
}

function init(db) {
	db.serialize(() => {
		db.run(
			`CREATE TABLE bots (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, token TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
		);
		db.run(
			`CREATE TABLE audits (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, details TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
		);
	});
}

const db = connect();

function saveBot(name, encryptedToken) {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare('INSERT INTO bots (name, token) VALUES (?, ?)');
		stmt.run(name, encryptedToken, function (err) {
			stmt.finalize();
			if (err) return reject(err);
			resolve({ id: this.lastID, name, created_at: new Date().toISOString() });
		});
	});
}

function listBots() {
	return new Promise((resolve, reject) => {
		db.all('SELECT id, name, created_at FROM bots ORDER BY id DESC', (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
}

function addAudit(action, details) {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare('INSERT INTO audits (action, details) VALUES (?, ?)');
		stmt.run(action, details, function (err) {
			stmt.finalize();
			if (err) return reject(err);
			resolve({ id: this.lastID });
		});
	});
}

module.exports = { saveBot, listBots, addAudit };

