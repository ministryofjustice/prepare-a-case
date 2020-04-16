import { emptyList } from './case-list/emptyList'
import { unfilteredShortList } from './case-list/unfilteredShortList'
import { unfilteredListPage1 } from './case-list/unfilteredListPage1'
import { unfilteredListPage2 } from './case-list/unfilteredListPage2'
import { unfilteredListPage3 } from './case-list/unfilteredListPage3'
import { unfilteredListPage5 } from './case-list/unfilteredListPage5'
import { unfilteredListPage11 } from './case-list/unfilteredListPage11'
import { probationStatusFilteredList } from './case-list/probationStatusFilteredList'
import { courtroomFilteredList } from './case-list/courtroomFilteredList'
import { sessionFilteredList } from './case-list/sessionFilteredList'
import { fullFilteredList } from './case-list/fullFilteredList'

const caseListTestData = {
  caseList: {
    empty: { ...emptyList },
    unfilteredShort: { ...unfilteredShortList },
    unfilteredPage1: { ...unfilteredListPage1 },
    unfilteredPage2: { ...unfilteredListPage2 },
    unfilteredPage3: { ...unfilteredListPage3 },
    unfilteredPage5: { ...unfilteredListPage5 },
    unfilteredPage11: { ...unfilteredListPage11 },
    probationStatusFiltered: { ...probationStatusFilteredList },
    courtroomFiltered: { ...courtroomFilteredList },
    sessionFiltered: { ...sessionFilteredList },
    fullFiltered: { ...fullFilteredList }
  }
}

module.exports = {
  caseListTestData
}
