const express = require('express')
const axios = require('axios')
const moment = require('moment')
const CronJob = require('cron').CronJob;

const config = require('./config')

const app = express()
const port = config.port

app.use(express.json())

app.listen(port, () => console.log(`[sys] Express started on ${port}!`))

app.post('/', (req, res) => {
  const latency = req.body;
  latency.reqReceivedAt = moment()

  // setTimeout(() => {
    latency.responseSentAt = moment()
    res.json(latency)
  // }, 1000 * Math.floor(Math.random() * config.maxProcessingTime))
})

const task = () => {
  axios.post(config.target, {
    reqSentAt: moment()
  }).then(res => {
    const latency = res.data;
    
    latency.responseReceivedAt = moment().toISOString()

    latency.requestLatency = moment(latency.reqReceivedAt).diff(moment(latency.reqSentAt))
    latency.responseLatency = moment(latency.responseReceivedAt).diff(moment(latency.responseSentAt))
    latency.latency = latency.requestLatency + latency.responseLatency;
    latency.processingTime = moment(latency.responseSentAt).diff(moment(latency.reqReceivedAt))

    console.log(latency)
  }).catch(err => console.error(err))
}

if (config.jobEnabled) {
  new CronJob(config.cron, task, null, true, config.tz);
}


