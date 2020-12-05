// ==UserScript==
// @name         btdouban
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  [!!!Ensure your network is under VPN] Gets Douban medias' BitTorrent resources
// @author       shadow-walker
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_download
// @connect      *
// @include        *//movie.douban.com/subject/*
// ==/UserScript==

(function () {
  'use strict';

  var configs = [{
    enabled: true,
    weight: 2,
    src: 'https://btdb.eu/search/__keyword__/0/',
    uiRef: function (self, data) {
      var html = $.parseHTML(data.responseText);
      var items = ''
      var medias = $(html).find('.media')
      medias.each(function () {
        let {title, size, sd, dn, link} = self.fieldRef(this)
        //items += `<li><a href="${link}">${title}</a><span style="float: right">sd: ${sd}, dn: ${dn}, ${size}</span></li>`
        items += `<li><a href="${link}">${title} (sd: ${sd}, dn: ${dn}, ${size})</a></li>`
      })
      items = items.length > 0 ? items : '[btdb.eu] No any magnet links can be found!'
      var layer = $(`<div class="clearfix" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
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
      var dn = /Leechers\s:\s(\d*)/g.exec($(info[3]).text())[1]
      return {title: title, link: link, sd: sd, dn: dn, size: size}
    }
  }, {
    enabled: true,
    weight: 1,
    src: 'http://kat.rip/usearch/__keyword__/',
    uiRef: function (self, data) {
      var html = $.parseHTML(data.responseText);
      var items = ''
      var medias = $(html).find('.mainpart .data .even, .odd')
      medias.each(function () {
        let {title, size, sd, dn, link} = self.fieldRef(this)
        //items += `<li><a href="${link}">${title}</a><span style="float: right">sd: ${sd}, dn: ${dn}, ${size}</span></li>`
        items += `<li><a href="${link}">${title} (sd: ${sd}, dn: ${dn}, ${size})</a></li>`
      })
      items = items.length > 0 ? items : '[kat.rip] No any magnet links can be found!'
      var layer = $(`<div class="clearfix" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
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
      var dn = $(tds[5]).text()
      return {title: title, link: link, sd: sd, dn: dn, size: size}
    }
  }]

  var getKeyword = function () {
    var txt = $('h1 span:eq(0)').text()
    //txt = txt.replace(/^[^a-zA-Z]*/, "")
    txt = txt.replace(/Season\s/, "S")
    return txt
  }

  var doRequest = function (url) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
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
          resolve(data)
        }
      })
    })
  }

  Promise.each = async function (configs) {
    configs.sort(function (a, b) {
      return a.weight - b.weight
    })

    var keyword = getKeyword()
    console.log('[btdouban] keyword: ', keyword)

    for (var i = 0; i < configs.length; i++) {
      var c = configs[i]
      if (!c.enabled) continue

      var url = c.src.replace('__keyword__', keyword)

      url = encodeURI(url)
      var data = await doRequest(url).catch(function (error) {
        console.log(error)
      })

      c.uiRef(c, data)

      if (c.has(data)) break
    }
  }

  Promise.each(configs)
})();
