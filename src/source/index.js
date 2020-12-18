const btdb_eu = require('./btdb_eu')
const kat_rip = require('./kat_rip')
const thepiratebay_org = require('./thepiratebay_org')

module.exports = [
  new btdb_eu(),
  new kat_rip(),
  new thepiratebay_org()
]

