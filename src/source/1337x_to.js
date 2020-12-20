class Source {
  weight = 101
  enabled = true
  site = "1337x.to"
  src = "https://1337x.to/search/__keyword__/1/"

  async execute(keyword) {
    if (keyword.length <= 0) return []

    var url = this.src.replace('__keyword__', keyword)
    url = encodeURI(url)
    var data = await this._doRequest(url) 

    var html = $.parseHTML(data.responseText);
    var medias = $(html).find('.box-info-detail table tbody tr')
    return Promise.all(medias.map(i => this._fieldRef(medias[i])).get())
  }

  filterKeyword(keyword) {
    var txt = keyword
    txt = txt.replace(/Season\s/, 'S')
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

  _getMagnetLink(link) {
    var url = `https://${this.site}${link}`
    var req = this._doRequest
    return new Promise(function (resolve, reject) {
      req(url).then(data => {
        var html = data.responseText
        //var href = $(html).find('.box-info,.torrent-detail-page div:last div:first ul:first li:first a').attr('href')
        var href = $(html).find('.box-info,.torrent-detail-page div:last div:first ul:first li:first a').html()
        resolve(href)
      }).catch(error => reject(error))
    })
  }

  async _fieldRef (html) {
    var title = $(html).find('.coll-1,.name').text()
    var link = $(html).find('.coll-1 a:last').attr('href')
    var size = $(html).find('.coll-4,.size').text()
    var sd = $(html).find('.coll-2,.seeds').text()
    var lc = $(html).find('.coll-3,.leeches').text()

    link = await this._getMagnetLink(link)
    return {title: title, link: link, sd: sd, lc: lc, size: size}
  }
}

module.exports = Source

