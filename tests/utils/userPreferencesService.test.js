/* global describe, beforeEach, it, expect, jest */
const userPreferences = require('../../server/services/user-preference-service')
const requestUtils = require('../../server/services/utils/request');

jest.mock('../../server/services/utils/request', () => ({
    ...jest.requireActual('../../server/services/utils/request'),
    request: jest.fn(() => ({
        data: {
            items: [
                'probationStatus=CURRENT',
                `validDate=${new Date().toString()}`
            ]
        }
    }))
}))

describe('User preferences service', () => {
    beforeEach(() => {
        userPreferences.getPreferences = jest.fn()
    })

    it('should get saved filters from user preferences output', async () => {
        expect(await userPreferences.getFilters()).toEqual({ probationStatus: 'CURRENT' })
    })

    it('should give a blank response for an incorrect day', async () => {
        requestUtils.request.mockReturnValueOnce({
            data: {
                items: [
                    'probationStatus=CURRENT',
                    `validDate=${new Date('01-01-1990').toString()}`
                ]
            }
        })
        expect(await userPreferences.getFilters()).toEqual({})
    })

})
