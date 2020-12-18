// ==UserScript==
// @name         btdouban
// @version      0.0.3
// @description  [Caution: Ensure using VPN] Gets Douban medias' BitTorrent resources
// @namespace    https://github.com/caryyu/bteye
// @author       caryyu
// @match        *://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @connect      btdb.eu
// @connect      kat.rip
// @connect      herokuapp.com
// @include      *//movie.douban.com/subject/*
// ==/UserScript==
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const configs = [{
  weight: 300,
  source: require('./src/source/btdb_eu'),
  getKeyword: function () {
    var txt = $('h1 span:eq(0)').text()
    txt = txt.replace(/Season\s/, "S")
    return txt
  },
}, {
  weight: 200,
  source: require('./src/source/kat_rip'),
  getKeyword: function () {
    var txt = $('h1 span:eq(0)').text()
    txt = txt.replace(/Season\s/, "S")
    return txt
  }
}, {
  weight: 100,
  source: require('./src/source/thepiratebay_org'),
  getKeyword: function () {
    var txt = $('h1 span:eq(0)').text()
    txt = txt.replace(/^[^a-zA-Z]*/, "")
    txt = txt.replace(/Season\s/, "S")
    return txt
  }
}]

Promise.main = async function (configs) {
  configs.sort(function (a, b) {
    return a.weight - b.weight
  })

  console.log(configs.length)
  for (var i = 0; i < configs.length; i++) {
    var c = configs[i]
    var s = new c.source()
    
    if (!s.enabled) continue

    var keyword = c.getKeyword()
    if (keyword.length <= 0) continue

    console.log(keyword)

    var data = await s.execute(keyword).catch(function (error) {
      console.log(error)
      var layer = $(`<div class="clearfix" style="float: left; width: 675px"><hr/><p>Seems like you're not using VPN</p></div>`)
      $('.article .subjectwrap:first').append(layer)
    })

    var items = ''

    if (!data || data.length <= 0) {
      items = `[${s.src}] No any magnet links can be found!`
    } else {
      data.forEach(item => {
        let {title, size, sd, lc, link} = item
        //items += `<li><a href="javascript:void(0)" link="${link}">[Play]</a> <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
        items += `<li><a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
      })
      // loop break
      i = configs.length - 1
    }

    var layer = $(`<div class="clearfix magnet-section" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
    $('.article .subjectwrap:first').append(layer)
  }

  //new PlayerManager().uiApply()
}

Promise.main(configs)

},{"./src/source/btdb_eu":2,"./src/source/kat_rip":3,"./src/source/thepiratebay_org":4}],2:[function(require,module,exports){
class Source {
  enabled = true
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

},{}],3:[function(require,module,exports){
class Source {
  enabled = true
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

},{}],4:[function(require,module,exports){
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

},{}]},{},[1]);
