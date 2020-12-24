const bencode = require('bencode')
const request = require('request')

request({
  method: 'get',
  uri: 'https://yts.mx/torrent/download/6A72FE26CC67037C9A9F865A5E7CFF1786E828EC',
  timeout: 30000,
}, function (error, response, body) {
  var data = Buffer.from(body)
  var result = bencode.decode(data)
  console.log(result)
})

