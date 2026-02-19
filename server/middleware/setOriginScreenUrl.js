const setOriginScreenUrl = async (req, res, next) => {
  // Capture the URL of the parent screen, so that back links work as users expect.
  // Regex Matches:
  // - /B14LO/outcomes/in-progress?page=3
  // - /B14LO/cases?page=1
  // - /case-search?term=smith
  const pattern = /^\/([a-zA-Z0-9]+)\/(outcomes|cases)(?:\/[a-zA-Z0-9-]+)?|^\/case-search/
  if (req.session && pattern.test(req.originalUrl)) {
    req.session.originScreenUrl = req.originalUrl ?? ''
  }
  next()
}

module.exports = {
  setOriginScreenUrl
}