const helmet = require('helmet')

module.exports = async app => app.use((req, res, next) => {

  res.locals.nonce = config.nonce()
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          '\'self\'',
          'https://www.google-analytics.com',
          'www.google-analytics.com'
        ],
        objectSrc: ['\'none\''],
        frameSrc: ['https://www.youtube.com', '\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-eval\'',
          'www.google-analytics.com',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'js.monitor.azure.com',
          '\'sha256-6cE0E4X9g7PbRlMR/+GoyLM4W7mjVxZL4H6E8FgY8OA=\'',
          '\'sha256-l1eTVSK8DTnK8+yloud7wZUqFrI0atVo6VlC6PJvYaQ=\'',
          '\'sha256-Ex+PXm59nVbu/S+FH/u8FLio5zO5YfFPo0/jH0uw19k=\'',
          '\'sha256-QIG/FBh5vORMkpviiAyUOvMgp6XvwQIEagSXO2FUmyo=\'',
          `'nonce-${res.locals.nonce}'`
        ],
        imgSrc: [
          '\'self\'',
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          'www.google-analytics.com'
        ],
        upgradeInsecureRequests: [],
        connectSrc: [
          '\'self\'',
          'www.google-analytics.com',
          'https://www.google-analytics.com',
          'js.monitor.azure.com',
          'dc.services.visualstudio.com'
        ]
      }
    }
  })(req, res, next)
})