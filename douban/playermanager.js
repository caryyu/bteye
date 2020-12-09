(function () {
  window.PlayerManager = function () {
    this.style = `
     <style type="text/css">
       #layer-background{
           display: none;
           position: fixed;
           top: 0%;  left: 0%;
           width: 100%;  height: 100%;
           background-color: black;
           z-index:1001;  -moz-opacity: 0.7;  opacity:.70;  filter: alpha(opacity=70);
       }
       #layer-dplayer {
           display: none;
           position: fixed;
           top: 25%;  left: 22%;
           width: 53%;  height: 49%;
           padding: 0px;
           border: 5px solid #E8E9F7;
           background-color: white;
           z-index:1002;
           overflow: auto;
       }
     </style>
   `

    this.playTestEl = `<a href="javascript:void(0)" link="magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4">Play-Test[WebTorrent]</a>`
  }

  window.PlayerManager.prototype = {
    uiApply: function () {
      const self = this
      $('head').append(this.style)
      var layerBackgroundEl = $('<div id="layer-background"></div>')
      layerBackgroundEl.click(function () {
        $('#layer-background').hide()
        $('#layer-dplayer').hide()
        if (self.dp) dp.destroy()
      })
      $('body').append(layerBackgroundEl)
      $('body').append('<div id="layer-dplayer"></div>')
      $('.article .subjectwrap:first')
        .append($(`<div class="clearfix" style="float: left; width: 675px"><hr/></div>`)
          .append($(this.playTestEl).click(this.uiShow)))
      $('#bt-item').click(this.uiShow)
    },
    uiShow: function () {
      const self = this
      $('#layer-background').show()
      $('#layer-dplayer').show()

      self.dp = new DPlayer({
        container: document.getElementById('layer-dplayer'),
        video: {
          url: $(this).attr('link'),
          type: 'webtorrent',
        }
      })
      console.log(self.dp.plugins.webtorrent)
    }
  }
})();
