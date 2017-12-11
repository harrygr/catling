module.exports = function(pluginConfig, config, callback) {
  if (config.env.CI === 'true') {
    callback(null)
  } else {
    callback(new Error("Not running on CI, won't be published."))
  }
}
