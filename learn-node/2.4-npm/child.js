const { Notifier } = require('./notify')

const notify = new Notifier()

notify.addListener('new events', (e) => {
  console.log('receive new events ->', e)
})
