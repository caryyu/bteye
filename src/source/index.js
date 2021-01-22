// Note:
// the ones being disabled are backed by Cloudflare which can't be passed through
// @date 2021-01-22

//const btdb_eu = require('./btdb_eu')
//const kat_rip = require('./kat_rip')
const thepiratebay_org = require('./thepiratebay_org')
const _1337x_to = require('./1337x_to')
const yts_mx = require('./yts_mx')

module.exports = [
  //new btdb_eu(),
  //new kat_rip(),
  new thepiratebay_org(),
  new _1337x_to(),
  new yts_mx()
]

