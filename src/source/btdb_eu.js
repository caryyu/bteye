class Source {
  weight = 300
  enabled = true
  site = "btdb.eu"
  src = "https://btdb.eu/search/__keyword__/0/"

  async execute(keyword) {
    if (keyword.length <= 0) return []

    var url = this.src.replace('__keyword__', keyword)
    url = encodeURI(url)
    var data = await this._doRequest(url) 

    var html = $.parseHTML(data.responseText);
    var medias = $(html).find('.media')
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
    var title = $(html).find('.media-body .item-title a').text()
    var info = $(html).find('.media-body .item-meta-info small')
    var link = $(html).find('.media-right a:first').attr('href')
    var size = /Size\s:\s(.+)/g.exec($(info[0]).text())[1]
    var sd = /Seeders\s:\s(\d*)/g.exec($(info[2]).text())[1]
    var lc = /Leechers\s:\s(\d*)/g.exec($(info[3]).text())[1]
    return {title: title, link: link, sd: sd, lc: lc, size: size}
  }
}

module.exports = Source
