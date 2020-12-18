class Source {
  weight = 200
  enabled = true
  site = "kat.rip"
  src = "http://kat.rip/usearch/__keyword__/"

  async execute(keyword) {
    if (keyword.length <= 0) return []

    var url = this.src.replace('__keyword__', keyword)
    url = encodeURI(url)
    var data = await this._doRequest(url) 

    var html = $.parseHTML(data.responseText);
    var medias = $(html).find('.mainpart .data .even, .odd')
    return medias.map(i => this._fieldRef(medias[i])).get()
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

  _fieldRef (html) {
    var tds = $(html).find('td')
    var title = tds.find('.torrentname .cellMainLink').text()
    var link = tds.find('.floatright a:last').attr('href')
    var size = $(tds[1]).text()
    var sd = $(tds[4]).text()
    var lc = $(tds[5]).text()
    return {title: title, link: link, sd: sd, lc: lc, size: size}
  }
}

module.exports = Source
