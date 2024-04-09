module.exports = async app => {

  app.use(express.static(path.join(__dirname, '../public/build'), { maxage: config.settings.assetCache }))
  app.use('/assets', [
    express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk/assets'), { maxage: config.settings.assetCache }),
    express.static(path.join(__dirname, '../node_modules/@ministryofjustice/frontend/moj/assets'), { maxage: config.settings.assetCache }),
    express.static(path.join(__dirname, '../node_modules/accessible-autocomplete/dist'), { maxage: config.settings.assetCache })
  ])
  app.use('/moj', express.static(path.join(__dirname, '../node_modules/@ministryofjustice/frontend/moj'), { maxage: config.settings.scriptCache }))
  app.use('/govuk', express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk'), { maxage: config.settings.scriptCache }))
}