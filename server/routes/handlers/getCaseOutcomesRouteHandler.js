const getCaseOutcomesRouteHandler = () => async (req, res) => {
  const { params } = req

  const templateValues = {
    title: 'Hearing outcomes',
    params
  }

  res.render('outcomes', templateValues)
}

module.exports = getCaseOutcomesRouteHandler
