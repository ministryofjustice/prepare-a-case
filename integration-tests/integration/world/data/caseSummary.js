const caseSummaryTestData = {
  caseSummary: {
    local: {
      notKnownDefendant: {
        caseNo: 8678951874,
        pnc: 'A/1234560BA',
        name: 'Kara Ayers',
        dateOfBirth: '31st October 1980',
        offence: 'Assault by beating',
        offenceDetails: 'On 01/01/2016 at Newcastle assaulted Short Pearson by beating him.',
        offenceCaption: 'Contrary to section 39 of the Criminal Justice Act 1988.'
      },
      previouslyKnownDefendant: {
        caseNo: 6627839278,
        pnc: 'A/8404713BA',
        crn: 'D541487',
        name: 'Webb Mitchell',
        dateOfBirth: '13th October 1958',
        offence: 'Theft from the person of another',
        offenceDetails: 'On 24/03/2016 at Edinburgh stole PLAYSTATION 4 to the value of 300.00, belonging to Dillard Everett.',
        offenceCaption: 'Contrary to section 1(1) and 7 of the Theft Act 1968.'
      },
      currentDefendant: {
        caseNo: 8678951874,
        pnc: 'A/1234560BA',
        crn: 'DX12340A',
        name: 'Lenore Marquez',
        dateOfBirth: '18th August 1979',
        offence: 'Attempt theft from the person of another',
        offenceDetails: 'On 05/09/2016 at Glasgow attempted to steal GAMES CONSOLES to the value of 750.00, belonging to Clemons Barron.',
        offenceCaption: 'Contrary to section 1(1) of the Criminal Attempts Act 1981.'
      },
      currentDefendantWithBreach: {}
    },
    dev: {
      notKnownDefendant: {
        caseNo: 1585562016194,
        name: 'Mr Joe JMBBLOGGS',
        dateOfBirth: '1st January 1998',
        crn: 'X340906',
        pnc: '',
        offence: 'Theft from a shop',
        offenceDetails: 'On 01/01/2015 at own, stole article, to the value of £987.00, belonging to person.',
        offenceCaption: 'Contrary to section 1(1) and 7 of the Theft Act 1968.'
      },
      previouslyKnownDefendant: {
        caseNo: 1585562016194,
        name: 'Mr Joe JMBBLOGGS',
        dateOfBirth: '1st January 1998',
        crn: 'X340906',
        pnc: '',
        offence: 'Theft from a shop',
        offenceDetails: 'On 01/01/2015 at own, stole article, to the value of £987.00, belonging to person.',
        offenceCaption: 'Contrary to section 1(1) and 7 of the Theft Act 1968.'
      },
      currentDefendant: {},
      currentDefendantWithBreach: {}
    }
  }
}

module.exports = {
  caseSummaryTestData
}
