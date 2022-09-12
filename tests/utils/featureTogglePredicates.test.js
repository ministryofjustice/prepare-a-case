/* global describe, it, expect, jest */
const { enabledForUsers, enabledForCourts, disabledForAll, enabledForAll, allOf, anyOf } = require('../../server/utils/featureTogglePredicates')

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
    it('should return true when a court is in the enabled list of courts', () => {
      expect(enabledForUsers('user-four', 'user-one').isEnabled({ username: 'user-one' })).toBe(true)
    })

    it('should return false when a court is NOT in the enabled list of courts', () => {
      expect(enabledForUsers('user-four', 'user-one').isEnabled({ username: 'user-three' })).toBe(false)
    })

    it('should return false when null context is provided', () => {
      expect(enabledForUsers('user-four', 'user-one').isEnabled(null)).toBe(false)
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
