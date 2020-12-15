//const Douban = require('./src/douban/main')
//Douban()

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
      items = '[btdb.eu] No any magnet links can be found!'
    } else {
      data.forEach(item => {
        let {title, size, sd, lc, link} = item
        items += `<li><a href="javascript:void(0)" link="${link}">[Play]</a> <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
      })
    }

    var layer = $(`<div class="clearfix magnet-section" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
    $('.article .subjectwrap:first').append(layer)
  }

  //new PlayerManager().uiApply()
}

Promise.main(configs)
