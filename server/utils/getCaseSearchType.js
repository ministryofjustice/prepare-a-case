const pncPattern = /^\d{4}\/\d{7}[A-Za-z]$/
const crnPattern = /^[A-Za-z]\d{6}$/
const urnPatterns = [
  /^\d{2}[A-Za-z]{2}\d{7}$/,
  /^\d{2}[A-Za-z]\d{8}$/,
  /^[A-Za-z]{3}\d{7}$/,
  /^\d{8}[A-Za-z]{2}\d{2}[A-Za-z]{3}$/,
  /^\d{2}[A-Za-z]{2}\d{16}[A-Za-z]{2}$/
]

const getCaseSearchType = searchTerm => {
  let validations = {}
  if (searchTerm && searchTerm.trim().length > 0) {
    const searchTermString = String(searchTerm.trim())

    // Check for invalid characters
    if (!searchTermString.match(/^[A-Za-z'\-\d\s/]+$/)) {
      return { error: 'Remove any special characters apart from hyphens (-), apostrophes (\') and forward slashes (/)' }
    }

    // Check for search term length
    if (searchTermString.length > 650) {
      return { error: 'Name must be less than 650 characters' }
    }

    if (pncPattern.test(searchTermString)) { // Check for PNC pattern
      validations = { searchType: 'PNC' }
    } else if (urnPatterns.some(pattern => pattern.test(searchTermString))) { // Check for URN pattern
      validations = { searchType: 'URN' }
    } else if (crnPattern.test(searchTermString)) { // Check for CRN pattern
      validations = { searchType: 'CRN' }
    } else { // default to NAME if no other search type matched
      validations = { searchType: 'NAME' }
    }
  } else {
    validations = { error: 'You must enter a URN, CRN, PNC ID or defendant\'s name' }
  }

  return validations
}
module.exports = getCaseSearchType
