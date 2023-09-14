/* global describe, it, expect, jest */

const subject = require('../../server/utils/getHearingOutcomeAssignedToFilters')

describe('getHearingOutcomeAssignedToFilters', () => {
  it('should prepare set of assigned to filter with unique values sorted alphabetically', () => {
    const cases = [
      { assignedTo: 'Gin Tonic', assignedToUuid: 'gin-tonic-uuid' },
      { assignedTo: 'Hazel Nutt', assignedToUuid: 'hazel-nutt-uuid' },
      { assignedTo: 'Olive Tree', assignedToUuid: 'olive-tree-uuid' },
      { assignedTo: 'Joe Blogs', assignedToUuid: 'joe-blogs-uuid' },
      { assignedTo: 'Ash Gourd', assignedToUuid: 'ash-gourd-uuid' },
      { assignedTo: 'Hazel Nutt', assignedToUuid: 'hazel-nutt-uuid' },
      { assignedTo: 'Ash Gourd', assignedToUuid: 'ash-gourd-uuid' },
      { assignedTo: 'Gin Tonic', assignedToUuid: 'gin-tonic-uuid' },
    ]

    const selectedFilters = [
      {label: 'Gin Tonic', value: 'gin-tonic-uuid'},
      {label: 'Olive Tree', value: 'olive-tree-uuid'}
    ]

    const expected = [
      { label: 'Ash Gourd', value: 'ash-gourd-uuid' },
      { label: 'Gin Tonic', value: 'gin-tonic-uuid' },
      { label: 'Hazel Nutt', value: 'hazel-nutt-uuid' },
      { label: 'Joe Blogs', value: 'joe-blogs-uuid' },
      { label: 'Olive Tree', value: 'olive-tree-uuid' }
    ]

    const filters = subject(cases, {});
    expect(filters).toStrictEqual(expected)
  })
})