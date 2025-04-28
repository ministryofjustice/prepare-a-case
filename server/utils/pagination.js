const getPagination = (currentPage, resultsCount, resultsPerPageLimit, baseUrl) => {
  const firstPage = 1
  const totalPages = Math.round(Math.ceil((resultsCount / resultsPerPageLimit)))

  const pageItems = []

  const addPageNumber = ({ number, selected, type }) => {
    pageItems.push({
      text: number,
      href: baseUrl + 'page=' + number,
      selected,
      type
    })
  }

  const pageSet = new Set([firstPage, firstPage + 1, currentPage - 1, currentPage, currentPage + 1, totalPages - 1, totalPages]
    .filter(x => x >= firstPage && x <= totalPages))
  pageSet.forEach(i => {
    const type = (i > firstPage && i < currentPage - 2) || (i < totalPages && i > currentPage + 2) ? 'dots' : null
    addPageNumber({ number: i, selected: currentPage === i, type })
  })

  const previousLink = currentPage > firstPage
    ? {
        text: 'Previous',
        href: baseUrl + 'page=' + (currentPage - 1)
      }
    : null

  const nextLink = currentPage < totalPages
    ? {
        text: 'Next',
        href: baseUrl + 'page=' + (currentPage + 1)
      }
    : null

  return {
    pageItems,
    previousLink,
    nextLink
  }
}

module.exports = { getPagination }
