var fs = require("fs")
var browserify = require("browserify")
var tinyify = require('tinyify')

const dist = "dist/bundle-all.js"

const b = browserify({
  entries: ["./index.js"],
  cache: {},
  packageCache: {},
  plugin: [tinyify]
})

b.on('update', () => b.bundle().pipe(fs.createWriteStream(dist)))
b.transform("babelify", {
  //presets: ["@babel/preset-env", "@babel/preset-react"],
  presets: ["@babel/preset-env"],
  plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
})
b.bundle().pipe(fs.createWriteStream(dist))

