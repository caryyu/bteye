class Source {
  enabled = true
  src = "https://stark-savannah-51602.herokuapp.com/search/__keyword__"

  async execute(keyword) {
    if (keyword.length <= 0) return []

    var url = this.src.replace('__keyword__', keyword)
    url = encodeURI(url)
    var data = await this._doRequest(url)

    var medias = JSON.parse(data.responseText)
    return medias.map(media => this._fieldRef(media))
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

  _sizePretty(size) {
    size = size / 1024 / 1024
    if (size < 1024) {
      return Math.ceil(size) + 'M'
    }
    return (size / 1024) + 'G'
  }

  _fieldRef(obj) {
    var title = obj.title
    var link = obj.magnet
    var size = this._sizePretty(obj.size)
    var sd = obj.seeds
    var lc = obj.leeches
    return {title: title, link: link, sd: sd, lc: lc, size: size}
  }
}

module.exports = Source
