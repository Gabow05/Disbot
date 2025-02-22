const { createEmbed } = require('../../utils/embed.js');
const { getCurrentSeason, getUser } = require('../../utils/database.js');

module.exports = {
    name: 'ranking',
    description: 'Ver el ranking de la temporada actual',
    aliases: ['rank', 'leaderboard'],
    cooldown: 5,
    async execute(message, args) {
        const season = getCurrentSeason();
        if (!season) {
            return message.reply('No hay una temporada activa en este momento.');
        }

        const rankings = db.prepare(`
            SELECT e.user_id, e.season_rank, e.season_wins, 
                   p.name as pet_name, p.level as pet_level
            FROM economy e
            LEFT JOIN pets p ON e.user_id = p.user_id
            WHERE e.season_rank > 0
            ORDER BY e.season_rank DESC
            LIMIT 10
        `).all();

        const userRank = db.prepare(`
            SELECT COUNT(*) as rank
            FROM economy
            WHERE season_rank > (
                SELECT season_rank FROM economy WHERE user_id = ?
            )
        `).get(message.author.id);

        const embed = createEmbed(
            `🏆 Ranking de Temporada: ${season.name}`,
            `Top 10 jugadores de la temporada actual:\n\n` +
            rankings.map((rank, index) => 
                `${index + 1}. <@${rank.user_id}>\n` +
                `Puntos: ${rank.season_rank} | Victorias: ${rank.season_wins}\n` +
                `Mascota: ${rank.pet_name} (Nivel ${rank.pet_level})`
            ).join('\n\n') +
            `\n\n**Tu posición:** #${userRank.rank + 1}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
