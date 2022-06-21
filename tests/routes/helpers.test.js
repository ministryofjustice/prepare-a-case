const { getPsrRequestedConvictions } = require('../../server/routes/helpers')

const testConvictions = require('../../mappings/community/convictions/D541487-convictions.json').response.jsonBody.convictions

describe('getPsrRequestedConvictions', () => {
  it('Should find convictions with psr requested status and return main offence and psr report details', () => {
    const actual = getPsrRequestedConvictions({ convictions: testConvictions })
    expect(actual.length).toBe(2)
    expect(actual).toMatchObject([
      {
        psrReport: {
          author: {
            forenames: 'Carrie',
            surname: 'Smith',
            unallocated: false
          }
        },
        offence: { description: 'Burglary (dwelling) with intent to commit, or the commission of an offence triable only on indictment - 02801' }
      },
      {
        psrReport: {
          author: {
            forenames: 'Jeff',
            surname: 'Bloggs',
            unallocated: false
          }
        },
        offence: { description: 'Noise offences - 82200' }
      }])
  })
})
