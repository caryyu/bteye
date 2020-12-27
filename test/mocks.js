const request = require('request')
const jquery = require('jquery')
const JSDOM = require('jsdom').JSDOM

global.GM_xmlhttpRequest = function(opts) {
  var encoding

  if(opts.responseType === 'arraybuffer') {
    encoding = null
  }

  request({
    method: opts.method,
    uri: opts.url,
    timeout: opts.timeout,
    encoding: encoding
  }, function(error, response, body) {
      if (error) {
        opts.onerror(error)
      } else {
        opts.onload({
          status: response.statusCode,
          response: body,
          responseText: body
        })
      }
  })
}

const dom = new JSDOM()
global.window = dom.window
global.document = dom.window.document
global.$ = jquery(global.window)

