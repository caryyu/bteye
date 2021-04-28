const configs = require('./src/source/')

Promise.main = async function (configs) {
  configs.sort(function (a, b) {
    return a.weight - b.weight
  })

  var keyword = $('h1 span:eq(0)').text()

  var uiContainer = $('.article .subjectwrap:first')
    .append('<div class="clearfix magnet-section" style="float: left; width: 675px;max-height: 500px; overflow-y: scroll; border: 1px #cccccc solid;padding: 10px;"></div>').children("div:last-child")
  var uiLoading = $('<span>[bteye-bydouban] Loading Loading Loading ...</span>').appendTo(uiContainer)

  var elements = []
  for (var i = 0; i < configs.length; i++) {
    var c = configs[i]
    var s = c
    
    if (!s.enabled) continue

    var k = c.filterKeyword(keyword)
    if (k.length <= 0) continue

    console.log(k)

    var data = await s.execute(k).catch(function (error) {
      console.log(error)
      //var layer = $(`<div class="clearfix" style="float: left; width: 675px"><hr/><p>Seems like you're not using VPN</p></div>`)
      //$('.article .subjectwrap:first').append(layer)
    })

    //var items = ''

    if (!data || data.length <= 0) {
      //items = `[${s.site}] No any magnet links can be found!`
      continue
    } else {
      data.forEach(item => {
        let {title, size, sd, lc, link} = item
        //items += `<li><a href="javascript:void(0)" link="${link}">[Play]</a> <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
        //items += `<li>[${s.site}] <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`
        elements.push($(`<li>[${s.site}] <a href="${link}">${title} (sd: ${sd}, lc: ${lc}, ${size})</a></li>`))
      })
      // loop break
      // i = configs.length - 1
    }
  }
  
  //console.log(elements.length)
  //var layer = $(`<div class="clearfix magnet-section" style="float: left; width: 675px"><hr/><ul>${items}</ul></div>`)
  if(!elements.length > 0) {
    elements.push($('<span>[bteye-btdouban] Did not find any available media resources</span>'))
  }
  uiLoading.remove()
  uiContainer
    .append('<ul></ul>').children("ul:last-child")
    .append(elements)
  //new PlayerManager().uiApply()
}

Promise.main(configs)

