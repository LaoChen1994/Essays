const moment = require('moment')

const formatDateTime = date => moment(date).format('YYYY-MM-DD HH:mm:ss')

module.exports = {
  formatDateTime
}