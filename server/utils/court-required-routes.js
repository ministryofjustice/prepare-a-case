module.exports = $url => {
  const ignoreRoutes = ['/login', '/logout', '/select-court']
  return ignoreRoutes.includes($url)
}
