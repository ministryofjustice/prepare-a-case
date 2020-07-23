module.exports = e => {
  console.error('API Error - Code:', e.code, 'URL:', e.config && e.config.url, 'Method:', e.config && e.config.method)
}
