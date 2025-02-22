const express = require('express');
const app = express();

// Endpoint mejorado para el monitoreo
app.get('/', (req, res) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    res.json({
        status: 'Bot is running!',
        uptime: `${days}d ${hours}h ${minutes}m`,
        timestamp: new Date().toISOString()
    });
});

function startMonitoring() {
    return new Promise((resolve, reject) => {
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Monitoring server running on port ${PORT}`);
            resolve(server);
        }).on('error', (error) => {
            console.error('Error starting monitoring server:', error);
            reject(error);
        });

        // Mantener el proceso activo
        setInterval(() => {
            console.log('Keeping process alive - Current uptime:', process.uptime());
        }, 60000); // Log cada minuto
    });
}

module.exports = { startMonitoring };