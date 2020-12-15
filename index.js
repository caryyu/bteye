//const Douban = require('./src/douban/main')
//Douban()
const BtdbEu = require('./src/source/btdb_eu')
new BtdbEu().execute('mulan').then(function(data){
  console.log(data)
})
