const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
}

module.exports = {
    getUser: async (userId) => {
        const result = await query(
            'SELECT * FROM economy WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            await query(
                'INSERT INTO economy (user_id, coins) VALUES ($1, 0)',
                [userId]
            );
            return { user_id: userId, coins: 0, daily_streak: 0 };
        }
        return result.rows[0];
    },

    addCoins: async (userId, amount) => {
        await query(
            `INSERT INTO economy (user_id, coins, total_earned) 
             VALUES ($1, $2, $2)
             ON CONFLICT (user_id) 
             DO UPDATE SET coins = economy.coins + $2, 
                          total_earned = economy.total_earned + $2`,
            [userId, amount]
        );
    },

    setLastWork: async (userId) => {
        await query(
            'UPDATE economy SET last_work = CURRENT_TIMESTAMP WHERE user_id = $1',
            [userId]
        );
    },

    setLastDaily: async (userId, streak) => {
        await query(
            'UPDATE economy SET last_daily = CURRENT_TIMESTAMP, daily_streak = $2 WHERE user_id = $1',
            [userId, streak]
        );
    },

    createPet: async (userId, name, type) => {
        const result = await query(
            'INSERT INTO pets (user_id, name, type) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, type]
        );
        return result.rows[0];
    },

    getPet: async (petId) => {
        const result = await query('SELECT * FROM pets WHERE id = $1', [petId]);
        return result.rows[0];
    },

    getUserPets: async (userId) => {
        const result = await query('SELECT * FROM pets WHERE user_id = $1', [userId]);
        return result.rows;
    },

    updatePetStats: async (petId, stats) => {
        const { level, exp, health, attack, defense } = stats;
        await query(
            `UPDATE pets 
             SET level = $1, exp = $2, health = $3, attack = $4, defense = $5,
                 last_training = CURRENT_TIMESTAMP
             WHERE id = $6`,
            [level, exp, health, attack, defense, petId]
        );
    },

    getAchievements: async (userId) => {
        const result = await query('SELECT * FROM achievements WHERE user_id = $1', [userId]);
        return result.rows;
    },

    updateAchievementProgress: async (userId, achievementId, progress) => {
        const result = await query(
            `INSERT INTO achievements (user_id, achievement_id, progress)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, achievement_id)
             DO UPDATE SET progress = achievements.progress + $3
             RETURNING *`,
            [userId, achievementId, progress]
        );
        return result.rows[0];
    },

    completeAchievement: async (userId, achievementId) => {
        const result = await query(
            `UPDATE achievements 
             SET completed = true, completed_at = CURRENT_TIMESTAMP
             WHERE user_id = $1 AND achievement_id = $2 AND completed = false
             RETURNING *`,
            [userId, achievementId]
        );
        return result.rows[0];
    },

    createMission: async (userId, missionType, description, requirement, rewardCoins, rewardItems, expirationHours) => {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expirationHours);

        const result = await query(
            `INSERT INTO missions 
             (user_id, mission_type, description, requirement, reward_coins, reward_items, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, missionType, description, requirement, rewardCoins, rewardItems, expiresAt]
        );
        return result.rows[0];
    },

    getUserMissions: async (userId) => {
        const result = await query(
            `SELECT * FROM missions 
             WHERE user_id = $1 
             AND completed = false 
             AND expires_at > CURRENT_TIMESTAMP`,
            [userId]
        );
        return result.rows;
    },

    getShopItems: async () => {
        const result = await query('SELECT * FROM shop_items WHERE available = true');
        return result.rows;
    },

    buyItem: async (userId, itemId, quantity = 1) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const itemResult = await client.query(
                'SELECT * FROM shop_items WHERE id = $1 AND available = true',
                [itemId]
            );
            const item = itemResult.rows[0];
            if (!item) return null;

            const userResult = await client.query(
                'SELECT coins FROM economy WHERE user_id = $1',
                [userId]
            );
            const user = userResult.rows[0];
            const totalCost = item.price * quantity;

            if (user.coins < totalCost) return null;

            await client.query(
                'UPDATE economy SET coins = coins - $1 WHERE user_id = $2',
                [totalCost, userId]
            );

            await client.query(
                `INSERT INTO inventory (user_id, item_id, quantity)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (user_id, item_id)
                 DO UPDATE SET quantity = inventory.quantity + $3`,
                [userId, itemId, quantity]
            );

            await client.query('COMMIT');
            return { success: true, item, cost: totalCost };
        } catch (error) {
            await client.query('ROLLBACK');
            return null;
        } finally {
            client.release();
        }
    },

    getCurrentSeason: async () => {
        const result = await query('SELECT * FROM seasons WHERE active = true');
        return result.rows[0];
    },

    updateSeasonRank: async (userId, points) => {
        await query(
            'UPDATE economy SET season_rank = season_rank + $1 WHERE user_id = $2',
            [points, userId]
        );
    },

    getCraftingRecipes: async () => {
        const result = await query('SELECT * FROM crafting_recipes');
        return result.rows;
    },

    getActiveEvents: async () => {
        const result = await query(
            `SELECT * FROM special_events 
             WHERE active = true 
             AND CURRENT_TIMESTAMP BETWEEN start_date AND end_date`
        );
        return result.rows;
    },

    getChainMissions: async (userId) => {
        const result = await query(
            `SELECT * FROM missions 
             WHERE user_id = $1 
             AND chain_mission_id IS NOT NULL 
             AND completed = false`,
            [userId]
        );
        return result.rows;
    }
};