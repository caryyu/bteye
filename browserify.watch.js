var fs = require("fs")
var browserify = require("browserify")
var watchify = require('watchify')

const dist = "dist/bundle-all.js"

const b = browserify({
  entries: ["./index.js"],
  cache: {},
  packageCache: {},
  plugin: [watchify]
})

b.on('update', () => b.bundle().pipe(fs.createWriteStream(dist)))
b.transform("babelify", {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
})
b.bundle().pipe(fs.createWriteStream(dist))

