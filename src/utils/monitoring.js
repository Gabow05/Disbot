const express = require('express');
const app = express();

// Mejorado para keepon.berlin
app.get('/', (req, res) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    res.json({
        status: 'online',
        name: 'Discord Bot',
        uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodejs: process.version
    });
});

// Endpoint específico para keepon
app.get('/keepon', (req, res) => {
    res.status(200).send('OK');
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

        // Keep-alive mejorado
        setInterval(() => {
            const uptime = process.uptime();
            console.log(`[KEEPALIVE] Bot running - Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m - Memory: ${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
        }, 30000); // Log cada 30 segundos
    });
}

module.exports = { startMonitoring };