const moment = require('moment')

function parseMockResponse ($json) {
  if ($json.sessionStartTime) {
    $json.sessionStartTime = $json.sessionStartTime.replace('{{now format=\'yyyy-MM-dd\'}}', moment().format('YYYY-MM-DD'))
  }
  if ($json.convictions && $json.convictions.length) {
    $json.convictions.forEach($conviction => {
      if ($conviction.convictionDate) {
        $conviction.convictionDate = $conviction.convictionDate.replace('{{now offset=\'-6 months\' format=\'yyyy-MM-dd\'}}', moment().add(-6, 'months').format('YYYY-MM-DD'))
      }
      if ($conviction.sentence.endDate) {
        $conviction.sentence.endDate = $conviction.sentence.endDate.replace('{{now offset=\'6 months\' format=\'yyyy-MM-dd\'}}', moment().add(6, 'months').format('YYYY-MM-DD'))
        $conviction.sentence.endDate = $conviction.sentence.endDate.replace('{{now format=\'yyyy-MM-dd\'}}', moment().format('YYYY-MM-DD'))
      }
      if ($conviction.sentence && $conviction.sentence.terminationDate) {
        $conviction.sentence.terminationDate = $conviction.sentence.terminationDate.replace('{{now offset=\'5 months\' format=\'yyyy-MM-dd\'}}', moment().add(5, 'months').format('YYYY-MM-DD'))
      }
      if ($conviction.documents && $conviction.documents.length) {
        $conviction.documents.forEach($document => {
          $document.reportDocumentDates.completedDate = $document.reportDocumentDates.completedDate.replace('{{now offset=\'-1 months\' format=\'yyyy-MM-dd\'}}', moment().add(-1, 'months').format('YYYY-MM-DD'))
          $document.reportDocumentDates.completedDate = $document.reportDocumentDates.completedDate.replace('{{now offset=\'-5 days\' format=\'yyyy-MM-dd\'}}', moment().add(-5, 'days').format('YYYY-MM-DD'))
        })
      }
    })
  }
  return $json
}

module.exports = {
  parseMockResponse
}
