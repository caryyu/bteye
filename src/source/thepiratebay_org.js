class Source {
  weight = 100
  enabled = true
  site = "thepiratebay.org"
  src = "https://thepiratebay10.org/search/__keyword__/1/99/200"

  async execute(keyword) {
    if (keyword.length <= 0) return []

    var url = this.src.replace('__keyword__', keyword)
    url = encodeURI(url)
    var data = await this._doRequest(url)

    var html = $.parseHTML(data.responseText)
    $(html).find('#searchResult tbody tr:last').remove()
    var medias = $(html).find('#searchResult tbody tr')

    return Promise.all(medias.map(i => this._fieldRef(medias[i])).get())
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
        timeout: 30000,
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
    var title = $(html).find('td:nth-child(2) .detName a').text()
    var link = $(html).find('td:nth-child(2) a:nth-child(2)').attr('href')
    var size = $(html).find('td:nth-child(2) .detDesc').children().remove().end().text()
    var sd = $(html).find('td:nth-child(3)').text()
    var lc = $(html).find('td:nth-child(4)').text()

    size = size.split(',')[1]
    size = size.trim()
    size = size.split(' ', 2)[1]
    return {title: title, link: link, sd: sd, lc: lc, size: size}
  }
}

module.exports = Source
