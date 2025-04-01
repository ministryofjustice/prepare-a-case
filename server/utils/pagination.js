const getPagination = (currentPage, resultsCount, resultsPerPageLimit, baseUrl) => {
  const firstPage = 1
  const totalPages = Math.round(Math.ceil((resultsCount / resultsPerPageLimit)))

  const pageItems = []

  const addPageNumber = ({ number, current, ellipsis }) => {
    pageItems.push({
      number,
      href: baseUrl + 'page=' + number,
      current,
      ellipsis
    })
  }

  const pageSet = new Set([firstPage, firstPage + 1, currentPage - 1, currentPage, currentPage + 1, totalPages - 1, totalPages]
    .filter(x => x >= firstPage && x <= totalPages))
  pageSet.forEach(i => {
    const ellipsis = (i > firstPage && i < currentPage - 2) || (i < totalPages && i > currentPage + 2)
    addPageNumber({ number: i, current: currentPage === i, ellipsis })
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
