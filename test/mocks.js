const request = require('request')
const jquery = require('jquery')
const JSDOM = require('jsdom').JSDOM

global.GM_xmlhttpRequest = function(opts) {
  request({
    method: opts.method,
    uri: opts.url,
    timeout: opts.timeout,
  }, function(error, response, body) {
      if (error) {
        opts.onerror(error)
      } else {
        opts.onload({
          status: response.statusCode,
          responseText: body
        })
      }
  })
}

const dom = new JSDOM()
global.window = dom.window
global.document = dom.window.document
global.$ = jquery(global.window)

