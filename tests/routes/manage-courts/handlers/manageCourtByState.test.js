/* global jest, describe, it, expect */
const { get } = require('../../../../server/routes/manage-courts/handlers/manageCourtByState')
const { settings } = require('../../../../server/config')

describe('manageCourtsByState', () => {
    describe('GET Handler', () => { 
        const testBasePath = '/my-courts'
        const testRequestPath = '/req-path'

        const expectedViewTemplate = 'edit-courts'
        const expectedUserName = 'test-username'
        const defaultState = 'default-state'
        const defaultCourts = () => ['test-court-A', 'test-court-B']
        const validCourt = defaultCourts()[0]
        const invalidCourt = 'test-court-nill'
        const defaultNonce = 'test-nonce'

        const updateSelectedCourtsMock = jest.fn(({}) => ({status: 200}))
        const updateSelectedCourtsMockFailing = jest.fn(({}) => ({status: 400}))
        const requestQueries = (queries = {}) => ({
            error: queries.error ?? false,
            remove: queries.remove ?? null,
            save: queries.save ?? false
        })
        const mockRequest = (state, queries, courts) => ({
            params: { state },
            query: queries,
            session: { courts },
            path: testRequestPath
        })
        const mockResponse = () => ({
            render: jest.fn(),
            redirect: jest.fn(path => '/redirect-path'),
            locals: { nonce: defaultNonce, user: { username: expectedUserName }}
        })

        const subject = get(testBasePath, updateSelectedCourtsMock)
        const subjectWithFailingUpdate = get(testBasePath, updateSelectedCourtsMockFailing)

        const expectedRenderCalledWith = (expected = {}) => ({
            formError: expected.formError ?? false,
            serverError: expected.serverError ?? false,
            state: expected.state ?? defaultState,
            params: {
                availableCourts: settings.availableCourts,
                chosenCourts: expected.courts ?? defaultCourts(),
                nonce: expected.nonce ?? defaultNonce
            }
        })

        describe('GIVEN the handler is called with a given state and no specified query parameters', () => {
            it('THEN the template is rendered with the expected default values', async () => {
                const request = mockRequest(defaultState, requestQueries(), defaultCourts())
                const response = mockResponse()

                await subject(request, response)

                expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith())
            })
        })

        describe('GIVEN that the error query param is flagged', () => {
            it('THEN the template is rendered is the formError template param', () => {
                const errorRequest = mockRequest(defaultState, requestQueries({error: true}), defaultCourts())
                const response = mockResponse()

                subject(errorRequest, response)

                expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({formError: true}))
            })
        })

        describe('GIVEN that the remove query param is flagged', () => {
            describe('AND the current session has courts available', () => {
                describe('WHEN the selected court is found in the available courts', () => {
                    const courtFoundSuite = async () => {
                        const request = mockRequest(defaultState, requestQueries({remove: validCourt}), defaultCourts())
                        const response = mockResponse();
                        const result = await subject(request, response)
                        return { request, response, result }
                    }
                    it('THEN the selected count is removed from the session', async () => {
                        const { request } = await courtFoundSuite()

                        expect(request.session.courts.includes(validCourt)).toBe(false)
                        expect(request.session).toEqual({courts: ['test-court-B']})
                    })
                    it('AND the response is redirected to the request\'s path', async ()=> {
                        const { request, response } = await courtFoundSuite()

                        expect(response.redirect).toHaveBeenCalledWith(request.path)
                    })
                    it('AND no render occurs', async () => {
                        const { response } = await courtFoundSuite()

                        expect(response.render).not.toHaveBeenCalled()
                    })
                })
                describe('WHEN the selected court is not found in the available courts', () => {
                    const courtNotFoundSuite = async () => {
                        const request = mockRequest(defaultState, requestQueries({remove: invalidCourt}), defaultCourts())
                        const response = mockResponse()
                        const result = await subject(request, response)
                        return {request, response, result}
                    }
                    it('THEN no redirect occurs', async () => {
                        const { response } = await courtNotFoundSuite()

                        expect(response.redirect).not.toHaveBeenCalled()
                    })
                    it('AND the default template render occurs', async () => {
                        const { response } = await courtNotFoundSuite()

                        expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith())
                    })
                })
            })
            describe('AND the current session does not have courts available', () => {
                const noSessionCourtsSuite = async () => {
                    const request = mockRequest(defaultState, requestQueries({remove: validCourt}), [])
                    const response = mockResponse()
                    const result = await subject(request, response)
                    return {request, response, result}
                }
                it('THEN no redirect occurs', async () => {
                    const { response } = await noSessionCourtsSuite()

                    expect(response.redirect).not.toHaveBeenCalled()
                })
                it('AND the template is rendered but with no courts', async () => {
                    const { response } = await noSessionCourtsSuite()

                    expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({courts: []}))
                })
            })
        })

        describe('GIVEN that the save query param is flagged', () => {
            describe('AND the current session has courts avaialble', () => {
                it('THEN updateSelectedCourts is called with tthe expected details', async () => {
                    const request = mockRequest(defaultState, requestQueries({save: true}), defaultCourts())
                    const response = mockResponse()

                    await subject(request, response)

                    expect(updateSelectedCourtsMock).toHaveBeenCalledWith(expectedUserName, defaultCourts())
                })
                describe('WHEN the updateSelectedCourts called fails', () => {
                    it('THEN the template is rendered with a serverError', async () => {
                        const request = mockRequest(defaultState, requestQueries({save: true}), defaultCourts())
                        const response = mockResponse()

                        await subjectWithFailingUpdate(request, response)

                        expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({serverError: true}))
                    })
                })
                describe('WHEN the updateSelectedCourts call succeeds', () => {
                    it('THEN the response is redirected to the base route', async () => {
                        const request = mockRequest(defaultState, requestQueries({save: true}), defaultCourts())
                        const response = mockResponse()

                        await subject(request, response)

                        expect(response.redirect).toHaveBeenCalledWith(302, testBasePath)
                    })
                })
            })
            describe('AND the current session does not have courts available', () => {
                it('THEN the template is rendered with a formError and no courts', async () => {
                    const request = mockRequest(defaultState, requestQueries({save: true}), [])
                    const response = mockResponse()

                    await subject(request, response)

                    expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({formError: true, courts: []}))
                })
            })
        })
    })
})