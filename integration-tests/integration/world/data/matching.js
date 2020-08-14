import bulkList from './matching/bulkList'
import defendantRecords from './matching/defendantRecords'

module.exports = {
  matching: {
    bulkList: { ...bulkList },
    defendantRecords: { ...defendantRecords }
  }
}
