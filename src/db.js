const sql = require('mssql')
const CronJob = require('cron').CronJob;
const config = require('./config')
const moment = require('moment')

let db = null;

sql.connect(config.db.connection).then(pool => {
  db = pool;
  new CronJob(config.db.cron, task, null, true, config.tz);
}).catch(err => {
  console.error(err)
  process.exit(-1);
});

const task = () => {
  if (db == null) {
    console.error('Unable to connect to database')
    return;
  }

  const requestSentAt = moment()
  db.request().query('SELECT CASE WHEN 1=1 THEN 1 ELSE 0 END;')
  .then(result => {
    const responseReceivedAt = moment()
    const latency = responseReceivedAt.diff(requestSentAt);
    const success = result.rowsAffected[0] == 1;
    console.log({
      requestSentAt: requestSentAt.toISOString(),
      responseReceivedAt: responseReceivedAt.toISOString(),
      latency: latency
    })
  }).catch(err => console.error(err));
}

