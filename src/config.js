require('dotenv').config()

const config = {
  port: process.env.PORT || 8080,
  jobEnabled: process.env.JOB_ENABLED == 'true',
  cron: process.env.CRON || '*/5 * * * * *',
  tz: process.env.TZ || 'Asia/Bangkok',
  target: process.env.TARGET || 'http://localhost:8080',
  maxProcessingTime: 0, // seconds
  db: {
    enabled: process.env.DB_ENABLED == 'true',
    cron: process.env.DB_CRON || '*/5 * * * * *',
    connection: process.env.DB_CONNECTION,
  }
}

console.log('config:', config)

if (config.db.enabled === true && config.db.connection == undefined) {
  console.error('[ERROR] Missing ENV DB_CONNECTION --> Process terminated')
  process.exit(-1);
}

module.exports = config;