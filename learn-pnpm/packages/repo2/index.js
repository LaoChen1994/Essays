const { formatDateTime } = require('repo1')

const time = formatDateTime(new Date().getTime())

console.log(time)