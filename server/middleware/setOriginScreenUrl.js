const setOriginScreenUrl = async (req, res, next) => {
  // GET requests only – prevents invalid URLs being stored.
  if (req.method !== 'GET') {
    return next()
  }
  // Capture the URL of the parent screen, so that back links work as users expect.
  // Regex Matches (anchored to the end, ignoring any query string, so that
  // GET action routes nested under /outcomes/... e.g.
  // /B14LO/outcomes/hearing/123/defendant/456/toggle-hearing-outcome-required
  // are NOT mistaken for a list screen and don't clobber the stored back link):
  // - /B14LO/outcomes/in-progress?page=3
  // - /B14LO/cases?page=1
  // - /case-search?term=smith
  const pattern = /^\/([a-zA-Z0-9]+)\/(outcomes|cases)(?:\/[a-zA-Z0-9-]+)?(?:\?.*)?$|^\/case-search(?:\?.*)?$/
  if (req.session && pattern.test(req.originalUrl)) {
    req.session.originScreenUrl = req.originalUrl ?? ''
  }

  next()
}

module.exports = {
  setOriginScreenUrl
}
