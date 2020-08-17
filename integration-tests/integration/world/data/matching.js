import bulkList from './matching/bulkList'
import defendantOneRecords from './matching/defendantOneRecords'
import defendantTwoRecords from './matching/defendantTwoRecords'

module.exports = {
  matching: {
    bulkList: { ...bulkList },
    defendantOneRecords: { ...defendantOneRecords },
    defendantTwoRecords: { ...defendantTwoRecords }
  }
}
