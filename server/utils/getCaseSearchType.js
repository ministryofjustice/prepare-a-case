const getCaseSearchType = searchTerm => {
  let validations = {}
  if (searchTerm && searchTerm.trim().length > 0) {
    const searchTermString = String(searchTerm.trim())
    if (!searchTermString.match(/^[A-Za-z'\-\d\s]+$/)) {
      return { error: 'CRNs and names can only contain numbers 0 to 9, letters A to Z, hyphens and apostrophes.' }
    }
    if (searchTermString.length > 650) {
      return { error: 'Name must be less than 650 characters' }
    }
    if (searchTermString.match(/\d/)) {
      validations = searchTermString.match(/^[A-Za-z][0-9]{6}/) ? { searchType: 'CRN' } : { error: 'Enter a CRN in the format one letter followed by 6 numbers, for example A123456.' }
    } else {
      validations = { searchType: 'NAME' }
    }
  } else {
    validations = { error: 'You must enter a CRN or a person’s name.' }
  }

  return validations
}
module.exports = getCaseSearchType
