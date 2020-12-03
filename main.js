// ==UserScript==
// @name         btcloud
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_download
// @connect      *
// @include        *//movie.douban.com/subject/*
// ==/UserScript==

(function() {
  'use strict';

	var movieTitle = $('h1 span:eq(0)').text()
	var title = $('html head title').text()
	var keyword1 = title.replace('(豆瓣)', '').trim()
	var keyword2 = encodeURIComponent( keyword1 )
	var keyword3 = encodeURIComponent( keyword2 )
	var MovieOriginalTitle = movieTitle.replace(/^[^a-zA-Z]*/, "")
	var movieSimpleTitle = keyword1.replace(/第\S+季.*/, "")
	var movieFinalTitle = MovieOriginalTitle.replace(/Season\s/, "S")

  var url = encodeURI('https://btdb.eu/search/' + movieFinalTitle + '/0/')

  GM_xmlhttpRequest({
       method: 'GET',
       url: url,
       onload: function(r) {
           var data = r.responseText
           var html = $.parseHTML(data);
           var items = ''
           var medias = $(html).find('.media')
           medias.each(function(){
               var title = $(this).find('.media-body .item-title a').text()
               var size = $(this).find('.media-body .item-meta-info small:first').text()
               var link = $(this).find('.media-right a:first').attr('href')

               //layer.append(`<p><a href="${link}">${title}</a> - ${size}</p>`)
               items += `<li><a href="${link}">${title}</a><span style="float: right">${size}</span></li>`
           })
           items = items.length > 0 ? items : 'No any magnet links can be found!'
           var layer = $(`<div class="clearfix" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
           $('.article .subjectwrap:first').append(layer)
       }
  })
})();
