import bulkList from './matching/bulkList'
import defendantOneRecords from './matching/defendantOneRecords'
import defendantTwoRecords from './matching/defendantTwoRecords'
import unlinkRecord from './matching/unlinkDefendant'

module.exports = {
  matching: {
    bulkList: { ...bulkList },
    unlinkRecord: { ...unlinkRecord },
    defendantOneRecords: { ...defendantOneRecords },
    defendantTwoRecords: { ...defendantTwoRecords }
  }
}
