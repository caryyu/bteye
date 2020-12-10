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
        if (self.dp) self.dp.destroy()
      })
      $('body').append(layerBackgroundEl)
      $('body').append('<div id="layer-dplayer"></div>')

      var onPlay = function() {
        var link = $(this).attr('link')
        self.uiShow(link)
      }
      $('.article .subjectwrap:first')
        .append($(`<div class="clearfix" style="float: left; width: 675px"><hr/></div>`)
          .append($(this.playTestEl).click(onPlay)))
      $('.magnet-section ul li a:first-child').bind('click', onPlay)
    },
    uiShow: function (link) {
      const self = this
      $('#layer-background').show()
      $('#layer-dplayer').show()

      //console.log($(this).attr('link'))
      console.log('Supporting WebRTC: ', WebTorrent.WEBRTC_SUPPORT)
      self.dp = new DPlayer({
        container: document.getElementById('layer-dplayer'),
        video: {
          url: link,
          type: 'webtorrent',
        },
        pluginOptions: {
          webtorrent: {
            dht: true,
            webSeeds: true,
            tracker: {
              announce: [
                "wss://tracker.btorrent.xyz",
                "wss://tracker.fastcast.nz",
                "wss://tracker.openwebtorrent.com",
                "wss://tracker.webtorrent.io"
              ],
              rtcConfig: {
                "iceServers": [
                  {url: 'stun:stun01.sipphone.com'},
                  {url: 'stun:stun.ekiga.net'},
                  {url: 'stun:stun.fwdnet.net'},
                  {url: 'stun:stun.ideasip.com'},
                  {url: 'stun:stun.iptel.org'},
                  {url: 'stun:stun.rixtelecom.se'},
                  {url: 'stun:stun.schlund.de'},
                  {url: 'stun:stun.l.google.com:19302'},
                  {url: 'stun:stun1.l.google.com:19302'},
                  {url: 'stun:stun2.l.google.com:19302'},
                  {url: 'stun:stun3.l.google.com:19302'},
                  {url: 'stun:stun4.l.google.com:19302'},
                  {url: 'stun:stunserver.org'},
                  {url: 'stun:stun.softjoys.com'},
                  {url: 'stun:stun.voiparound.com'},
                  {url: 'stun:stun.voipbuster.com'},
                  {url: 'stun:stun.voipstunt.com'},
                  {url: 'stun:stun.voxgratia.org'},
                  {url: 'stun:stun.xten.com'},
                  {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                  },
                  {
                    url: 'turn:192.158.29.39:3478?transport=udp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                  },
                  {
                    url: 'turn:192.158.29.39:3478?transport=tcp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                  }
                ]
              }
            }
          },
        },
      })
      console.log(self.dp.plugins.webtorrent)
    }
  }
})();
