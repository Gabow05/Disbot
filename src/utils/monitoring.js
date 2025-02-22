const express = require('express');
const app = express();

// Endpoint simple para el monitoreo
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

function startMonitoring() {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Monitoring server running on port ${PORT}`);
    });
}

module.exports = { startMonitoring };
