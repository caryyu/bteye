// ==UserScript==
// @name         btdouban
// @version      0.0.2
// @description  [Caution: Ensure using VPN] Gets Douban medias' BitTorrent resources
// @namespace    https://github.com/caryyu/bteye
// @author       caryyu
// @match        *://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @connect      btdb.eu
// @connect      kat.rip
// @connect      herokuapp.com
// @include      *//movie.douban.com/subject/*
// @require      https://github.com/webtorrent/webtorrent/raw/master/webtorrent.min.js
// @require      https://github.com/DIYgod/DPlayer/raw/master/dist/DPlayer.min.js
// @require      https://github.com/caryyu/bteye/raw/master/douban/playermanager.js
// ==/UserScript==

(function () {
  'use strict';

  var configs = [{
    enabled: true,
    weight: 300,
    src: 'https://btdb.eu/search/__keyword__/0/',
    getKeyword: function () {
      var txt = $('h1 span:eq(0)').text()
      //txt = txt.replace(/^[^a-zA-Z]*/, "")
      txt = txt.replace(/Season\s/, "S")
      return txt
    }, 
    uiRef: function (self, data) {
      var html = $.parseHTML(data.responseText);
      var items = ''
      var medias = $(html).find('.media')
      medias.each(function () {
        let {title, size, sd, lc, link} = self.fieldRef(this)
        items += `<li><a href="javascript:void(0)" link="${link}">[Play]</a> <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
      })
      items = items.length > 0 ? items : '[btdb.eu] No any magnet links can be found!'
      var layer = $(`<div class="clearfix magnet-section" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
      $('.article .subjectwrap:first').append(layer)
    },
    has: function (data) {
      var html = $.parseHTML(data.responseText);
      var items = ''
      var medias = $(html).find('.media')
      return medias.length > 0
    },
    fieldRef: function (html) {
      var title = $(html).find('.media-body .item-title a').text()
      var info = $(html).find('.media-body .item-meta-info small')
      var link = $(html).find('.media-right a:first').attr('href')
      var size = /Size\s:\s(.+)/g.exec($(info[0]).text())[1]
      var sd = /Seeders\s:\s(\d*)/g.exec($(info[2]).text())[1]
      var lc = /Leechers\s:\s(\d*)/g.exec($(info[3]).text())[1]
      return {title: title, link: link, sd: sd, lc: lc, size: size}
    }
  }, {
    enabled: true,
    weight: 200,
    src: 'http://kat.rip/usearch/__keyword__/',
    getKeyword: function () {
      var txt = $('h1 span:eq(0)').text()
      //txt = txt.replace(/^[^a-zA-Z]*/, "")
      txt = txt.replace(/Season\s/, "S")
      return txt
    }, 
    uiRef: function (self, data) {
      var html = $.parseHTML(data.responseText);
      var items = ''
      var medias = $(html).find('.mainpart .data .even, .odd')
      medias.each(function () {
        let {title, size, sd, lc, link} = self.fieldRef(this)
        items += `<li><a href="javascript:void(0)" link="${link}">[Play]</a> <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
      })
      items = items.length > 0 ? items : '[kat.rip] No any magnet links can be found!'
      var layer = $(`<div class="clearfix magnet-section" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
      $('.article .subjectwrap:first').append(layer)
    },
    has: function (data) {
      var html = $.parseHTML(data.responseText);
      var items = ''
      var medias = $(html).find('.mainpart .data .even, .odd')
      return medias.length > 0
    },
    fieldRef: function (html) {
      var tds = $(html).find('td')
      var title = tds.find('.torrentname .cellMainLink').text()
      var link = tds.find('.floatright a:last').attr('href')
      var size = $(tds[1]).text()
      var sd = $(tds[4]).text()
      var lc = $(tds[5]).text()
      return {title: title, link: link, sd: sd, lc: lc, size: size}
    }
  }, {
    enabled: true,
    weight: 100,
    src: 'https://thepiratebay-caryyu.herokuapp.com/search/__keyword__',
    getKeyword: function () {
      var txt = $('h1 span:eq(0)').text()
      txt = txt.replace(/^[^a-zA-Z]*/, "")
      txt = txt.replace(/Season\s/, "S")
      return txt
    }, 
    uiRef: function (self, data) {
      var items = ''
      var sizePretty = function(size) {
        if(size < 1024) {
          return Math.ceil(size) + 'M'
        }
        return (size / 1024) + 'G'
      }
      var medias = JSON.parse(data.responseText)
      medias.forEach(function (media) {
        let {title, size, sd, lc, link} = self.fieldRef(media)
        items += `<li><a href="javascript:void(0)" link="${link}">[Play]</a> <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${sizePretty(size)})</a></li>`
      })
      items = items.length > 0 ? items : '[herokuapp.com] No any magnet links can be found!'
      var layer = $(`<div class="clearfix magnet-section" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
      $('.article .subjectwrap:first').append(layer)
    },
    has: function (data) {
      var medias = JSON.parse(data.responseText)
      return medias.length > 0
    },
    fieldRef: function (obj) {
      var title = obj.title
      var link = obj.magnet
      var size = obj.size / 1024 / 1024 // M
      var sd = obj.seeds
      var lc = obj.leeches
      return {title: title, link: link, sd: sd, lc: lc, size: size}
    }
  }]

  var doRequest = function (url) {
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

  Promise.main = async function (configs) {
    configs.sort(function (a, b) {
      return a.weight - b.weight
    })

    for (var i = 0; i < configs.length; i++) {
      var c = configs[i]
      if (!c.enabled) continue

      var keyword = c.getKeyword()
      if (keyword.length <= 0) continue

      var url = c.src.replace('__keyword__', keyword)

      url = encodeURI(url)
      var data = await doRequest(url).catch(function (error) {
        console.log(error)
        var layer = $(`<div class="clearfix" style="float: left; width: 675px"><hr/><p>Seems like you're not using VPN</p></div>`)
        $('.article .subjectwrap:first').append(layer)
      })

      if (!data) continue

      c.uiRef(c, data)

      if (c.has(data)) break
    }

    new PlayerManager().uiApply()
  }

  Promise.main(configs)
})();

