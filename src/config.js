require('dotenv').config()

const config = {
  port: process.env.PORT || 8080,
  cron: process.env.CRON || '*/5 * * * * *',
  tz: process.env.TZ || 'Asia/Bangkok',
  target: process.env.TARGET || 'http://localhost:8080',
  maxProcessingTime: 0 // seconds
}

console.log('config:', config)

module.exports = config;