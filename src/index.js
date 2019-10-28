const express = require('express')
const axios = require('axios')
const moment = require('moment')
const CronJob = require('cron').CronJob;

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

app.listen(port, () => console.log(`[sys] Express started on ${port}!`))

app.post('/', (req, res) => {
  const latency = req.body;
  latency.reqReceivedAt = moment()

  setTimeout(() => {
    latency.resSentAt = moment()
    res.json(latency)
  }, 1000*Math.floor(Math.random() * Math.floor(10)))
})

new CronJob('* * * * * *', function() {

  axios.post('http://localhost:8080', {
    reqSentAt: moment()
  }).then(res => {
    const latency = res.data;
    
    latency.resReceivedAt = moment()
    latency.resSentAt = moment(latency.resSentAt)
    latency.reqSentAt = moment(latency.reqSentAt)
    latency.reqReceivedAt = moment(latency.reqReceivedAt)

    latency.reqLatency = latency.reqReceivedAt.diff(latency.reqSentAt)
    latency.resLatency = latency.resReceivedAt.diff(latency.resSentAt)
    latency.latency = latency.reqLatency + latency.resLatency;
    latency.processingTime = latency.resSentAt.diff(latency.reqReceivedAt)

    latency.resReceivedAt = latency.resReceivedAt.toISOString()
    latency.resSentAt = latency.resSentAt.toISOString()
    latency.reqSentAt = latency.reqSentAt.toISOString()
    latency.reqReceivedAt = latency.reqReceivedAt.toISOString()

    console.log(latency)
  }).catch(err => console.error(err))

}, null, true, 'Asia/Bangkok');