const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio data existe
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'bot.db'));

// Crear tablas si no existen
db.exec(`
    CREATE TABLE IF NOT EXISTS economy (
        user_id TEXT PRIMARY KEY,
        coins INTEGER DEFAULT 0,
        daily_streak INTEGER DEFAULT 0,
        last_daily DATETIME,
        last_work DATETIME
    );

    CREATE TABLE IF NOT EXISTS inventory (
        user_id TEXT,
        item_id TEXT,
        quantity INTEGER DEFAULT 1,
        PRIMARY KEY (user_id, item_id)
    );

    CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        name TEXT,
        type TEXT,
        level INTEGER DEFAULT 1,
        exp INTEGER DEFAULT 0,
        health INTEGER DEFAULT 100,
        attack INTEGER DEFAULT 10,
        defense INTEGER DEFAULT 10,
        last_training DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

module.exports = {
    getUser: (userId) => {
        const user = db.prepare('SELECT * FROM economy WHERE user_id = ?').get(userId);
        if (!user) {
            db.prepare('INSERT INTO economy (user_id, coins) VALUES (?, 0)').run(userId);
            return { user_id: userId, coins: 0, daily_streak: 0 };
        }
        return user;
    },

    addCoins: (userId, amount) => {
        const user = db.prepare('SELECT coins FROM economy WHERE user_id = ?').get(userId);
        if (!user) {
            db.prepare('INSERT INTO economy (user_id, coins) VALUES (?, ?)').run(userId, amount);
        } else {
            db.prepare('UPDATE economy SET coins = coins + ? WHERE user_id = ?').run(amount, userId);
        }
    },

    setLastWork: (userId) => {
        db.prepare('UPDATE economy SET last_work = CURRENT_TIMESTAMP WHERE user_id = ?').run(userId);
    },

    setLastDaily: (userId, streak) => {
        db.prepare('UPDATE economy SET last_daily = CURRENT_TIMESTAMP, daily_streak = ? WHERE user_id = ?').run(streak, userId);
    },

    createPet: (userId, name, type) => {
        return db.prepare(`
            INSERT INTO pets (user_id, name, type) 
            VALUES (?, ?, ?)
            RETURNING *
        `).get(userId, name, type);
    },

    getPet: (petId) => {
        return db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);
    },

    getUserPets: (userId) => {
        return db.prepare('SELECT * FROM pets WHERE user_id = ?').all(userId);
    },

    updatePetStats: (petId, stats) => {
        const { level, exp, health, attack, defense } = stats;
        db.prepare(`
            UPDATE pets 
            SET level = ?, exp = ?, health = ?, attack = ?, defense = ?, 
                last_training = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(level, exp, health, attack, defense, petId);
    }
};