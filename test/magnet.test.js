const request = require('request')
const parseTorrent = require('parse-torrent')

var encoding = null

request({
  method: 'get',
  uri: 'https://yts.mx/torrent/download/6A72FE26CC67037C9A9F865A5E7CFF1786E828EC',
  timeout: 30000,
  encoding: encoding,
}, function (error, response, body) {
  var data = Buffer.from(body)
  var result = parseTorrent(data)
  console.log(result)
  var uri = parseTorrent.toMagnetURI(result)
  console.log(uri)
})

