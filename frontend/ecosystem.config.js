module.exports = {
  apps: [{
    name: 'bimverdi-frontend',
    script: 'npm',
    args: 'run dev:next',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      NODE_OPTIONS: '--max-old-space-size=4096'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    exp_backoff_restart_delay: 100,
    kill_timeout: 3000,
  }]
};
