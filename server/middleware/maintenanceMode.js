const maintenanceFilePath = path.join(__dirname, 'public', 'maintenance.html')

module.exports = async app => {

  if (config.maintenanceModeEnabled) {
    app.use((req, res) => {
      res.sendFile(maintenanceFilePath)
    })
  }
}