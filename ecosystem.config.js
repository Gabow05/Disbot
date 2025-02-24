module.exports = {
  apps : [{
    name: 'discord-bot',
    script: 'src/index.js',
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
    },
    // Configuración de reinicio automático
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    min_uptime: '5s',
    // Logs
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
  }]
};
