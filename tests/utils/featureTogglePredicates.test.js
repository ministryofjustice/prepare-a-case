/* global describe, it, expect, jest */
const { enabledForUsers, enabledForCourts, disabledForAll, enabledForAll, allOf, anyOf, isEnv, mainFeatureToggleEnabled } = require('../../server/utils/featureTogglePredicates')
const { settings } = require('../../config')

describe('featureConfigPredicates', () => {
  describe('enabledForCourts', () => {
    it('should return true when a court is in the enabled list of courts', () => {
      expect(enabledForCourts('B10AB', 'B10JQ').isEnabled({ court: 'B10JQ' })).toBe(true)
    })

    it('should return false when a court is NOT in the enabled list of courts', () => {
      expect(enabledForCourts('B10AB', 'B10JQ').isEnabled({ court: 'B10JR' })).toBe(false)
    })

    it('should return false when null context is provided', () => {
      expect(enabledForCourts('B10AB', 'B10JQ').isEnabled(undefined)).toBe(false)
    })
  })

  describe('enabledForUsers', () => {
    it('should return true when a user is in the enabled list of users', () => {
      expect(enabledForUsers('user-four', 'user-one').isEnabled({ username: 'user-one' })).toBe(true)
    })

    it('should return false when a user is NOT in the enabled list of users', () => {
      expect(enabledForUsers('user-four', 'user-one').isEnabled({ username: 'user-three' })).toBe(false)
    })

    it('should return false when null context is provided', () => {
      expect(enabledForUsers('user-four', 'user-one').isEnabled(null)).toBe(false)
    })
  })

  describe('mainFeatureToggleEnabled', () => {
    settings.enableCaseProgress = false
    settings.enableCaseComments = false
    settings.enablePastCasesNavigation = false

    it('should return false when main feature toggles are disabled', () => {
      settings.enableCaseProgress = false
      settings.enableCaseComments = false
      settings.enablePastCasesNavigation = false
      expect(mainFeatureToggleEnabled('enableCaseProgress').isEnabled()).toBe(false)
      expect(mainFeatureToggleEnabled('enableCaseComments').isEnabled()).toBe(false)
      expect(mainFeatureToggleEnabled('enablePastCasesNavigation').isEnabled()).toBe(false)
    })

    it('should return true when main feature toggles are enabled', () => {
      settings.enableCaseProgress = true
      settings.enableCaseComments = true
      settings.enablePastCasesNavigation = true
      expect(mainFeatureToggleEnabled('enableCaseProgress').isEnabled()).toBe(true)
      expect(mainFeatureToggleEnabled('enableCaseComments').isEnabled()).toBe(true)
      expect(mainFeatureToggleEnabled('enablePastCasesNavigation').isEnabled()).toBe(true)
    })
  })

  describe('enabledForAll', () => {
    it('should return true when invoked', () => {
      expect(enabledForAll().isEnabled()).toBe(true)
    })
  })

  describe('disabledForAll', () => {
    it('should return false when invoked', () => {
      expect(disabledForAll().isEnabled()).toBe(false)
    })
  })

  describe('isEnv', () => {
    it('should return true when settings.pacEnvironment and input env matches', () => {
      settings.pacEnvironment = 'DEV'
      expect(isEnv('dev').isEnabled()).toBe(true)
      expect(isEnv('dev', 'preprod').isEnabled()).toBe(true)

      settings.pacEnvironment = 'PREPROD'
      expect(isEnv('dev', 'preprod').isEnabled()).toBe(true)

      settings.pacEnvironment = undefined
      expect(isEnv('dev', 'preprod').isEnabled()).toBe(false)
    })

    it('should return false when settings.pacEnvironment and input env DO NOT matche', () => {
      settings.pacEnvironment = 'prod'
      expect(isEnv('dev', 'preprod').isEnabled()).toBe(false)
      expect(isEnv('dev', 'preprod', 'staging').isEnabled()).toBe(false)
    })
  })

  describe('allOf', () => {
    it('should return true only if all the predicates evaluate to true', () => {
      const isEnabledMocks = [
        jest.fn().mockReturnValueOnce(true),
        jest.fn().mockReturnValueOnce(true),
        jest.fn().mockReturnValueOnce(true)
      ]
      const feature = allOf(
        { isEnabled: isEnabledMocks[0] },
        { isEnabled: isEnabledMocks[1] },
        { isEnabled: isEnabledMocks[2] }
      )

      const context = { court: 'court-one', username: 'user-one' }
      expect(feature.isEnabled(context)).toBe(true)
      isEnabledMocks.forEach(value => expect(value).toHaveBeenCalledWith(context))
    })

    it('should return false if any of the the predicates evaluate to false', () => {
      const isEnabledMocks = [
        jest.fn().mockReturnValueOnce(true),
        jest.fn().mockReturnValueOnce(true),
        jest.fn().mockReturnValueOnce(false)
      ]
      const feature = allOf(
        { isEnabled: isEnabledMocks[0] },
        { isEnabled: isEnabledMocks[1] },
        { isEnabled: isEnabledMocks[2] }
      )

      const context = { court: 'court-one', username: 'user-one' }
      expect(feature.isEnabled(context)).toBe(false)
      isEnabledMocks.forEach(value => expect(value).toHaveBeenCalledWith(context))
    })
  })

  describe('anyOf', () => {
    it('should return true if at least one of the predicates evaluate to true', () => {
      const isEnabledMocks = [
        jest.fn().mockReturnValueOnce(false),
        jest.fn().mockReturnValueOnce(false),
        jest.fn().mockReturnValueOnce(true)
      ]
      const feature = anyOf(
        { isEnabled: isEnabledMocks[0] },
        { isEnabled: isEnabledMocks[1] },
        { isEnabled: isEnabledMocks[2] }
      )

      const context = { court: 'court-one', username: 'user-one' }
      expect(feature.isEnabled(context)).toBe(true)
      isEnabledMocks.forEach(value => expect(value).toHaveBeenCalledWith(context))
    })

    it('should return false if all of the the predicates evaluate to false', () => {
      const isEnabledMocks = [
        jest.fn().mockReturnValueOnce(false),
        jest.fn().mockReturnValueOnce(false),
        jest.fn().mockReturnValueOnce(false)
      ]
      const feature = anyOf(
        { isEnabled: isEnabledMocks[0] },
        { isEnabled: isEnabledMocks[1] },
        { isEnabled: isEnabledMocks[2] }
      )

      const context = { court: 'court-one', username: 'user-one' }
      expect(feature.isEnabled(context)).toBe(false)
      isEnabledMocks.forEach(value => expect(value).toHaveBeenCalledWith(context))
    })
  })
})
