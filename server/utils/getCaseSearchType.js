const getCaseSearchType = searchTerm => {
  if (searchTerm) {
    return String(searchTerm).match(/^[A-Za-z][0-9]{6}/) ? 'CRN' : 'NAME'
  }
}
module.exports = getCaseSearchType
