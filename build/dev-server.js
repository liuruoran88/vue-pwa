require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
if (!config.dev.env.MOCK) {
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
  })
}

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

app.get('/sw.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../sw.js'));
})
// mock up
var mockup = function (reqPath, reqParams) {
    if (reqPath.indexOf('?') !== -1) {
        reqPath = reqPath.substring(0, reqPath.indexOf('?'));
    }
    var filePath = path.join(__dirname, '../mock/', reqPath + '.js');
    if (fs.existsSync(filePath)) {
        console.log('mockup数据：' + reqPath);
        var response;

        if (fs.existsSync(filePath)) {
            if (require.cache[require.resolve(filePath)]) {
                delete require.cache[require.resolve(filePath)];
            }
            response = require(filePath)(reqParams);
        }
        return response;
    }
    return false;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('*', (req, res) => {
    if (config.dev.env.MOCK) {
        res.json(mockup(req.url, req.method === 'GET' ? req.query : req.body));
    }
});

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
