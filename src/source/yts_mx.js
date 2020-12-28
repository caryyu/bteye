const parseTorrent = require('parse-torrent')

class Source {
  weight = 102
  enabled = true
  site = "yts.mx"
  src = "https://yts.mx/browse-movies/__keyword__/all/all/0/latest/0/all"

  async execute(keyword) {
    if (keyword.length <= 0) return []

    var url = this.src.replace('__keyword__', keyword)
    url = encodeURI(url)
    var data = await this._doRequest(url) 

    var html = $.parseHTML(data.responseText);
    var items = $(html).find('.browse-content .container .row .browse-movie-wrap')

    var medias = Promise.all(items.map(async (i, val)=> {
      var link = $(val).find('.browse-movie-link').attr('href')
      var data = await this._doRequest(link)
      var html = data.responseText
      return await this._fieldRef(html)
    }).get())
    return medias
  }

  filterKeyword(keyword) {
    var txt = keyword
    txt = txt.replace(/^[^a-zA-Z]*/, "")
    txt = txt.replace(/Season\s/, "S")
    return txt
  }

  _doRequest(url) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 10000,
        onabort: function (data) {
          reject(data)
        },
        onerror: function (data) {
          reject(data)
        },
        ontimeout: function (data) {
          reject(data)
        },
        onload: function (data) {
          if (data.status === 200) {
            resolve(data)
          } else {
            reject(data)
          }
        }
      })
    })
  }

  _fieldRef(html) {
    var wrapResult = function (buffer) {
      var result = parseTorrent(buffer)
      var link = parseTorrent.toMagnetURI(result)
      var title = result['name']
      var size = result['length']
      var sd = '-1'
      var lc = '-1'

      title = title.split('\n').join(' ').trim()
      size = parseFloat(size / 1024 / 1024).toFixed(0) + 'M'
      return {title: title, link: link, sd: sd, lc: lc, size: size}
    }
    // the link is Torernt URI
    var torrents = $(html).find('#movie-info p a[rel="nofollow"]')

    return Promise.all(torrents.map((i, val) => {
      var link = $(val).attr('href')
      console.log(link)
      return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: link,
          responseType: 'arraybuffer',
          timeout: 10000,
          onabort: function (data) {
            reject(data)
          },
          onerror: function (data) {
            reject(data)
          },
          ontimeout: function (data) {
            reject(data)
          },
          onload: function (data) {
            if (data.status === 200) {
              var body = Buffer.from(data.response)
              resolve(wrapResult(body))
            } else {
              reject(data)
            }
          }
        })
      })
    }))
  }
}

module.exports = Source

